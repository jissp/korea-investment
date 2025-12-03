import { Axios, AxiosRequestConfig } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { getRedisKey, RedisService } from '@modules/redis';
import {
    CustomerType,
    KoreaInvestmentBaseHeader,
} from '@modules/korea-investment-client/common';
import { KoreaInvestmentConfigService } from '@modules/korea-investment-client/korea-investment-config';
import { KoreaInvestmentOauthClient } from '@modules/korea-investment-client/korea-investment-oauth-client';

@Injectable()
export class KoreaInvestmentHelperService {
    constructor(
        @Inject('Client') private readonly client: Axios,
        private readonly redisService: RedisService,
        private readonly configService: KoreaInvestmentConfigService,
        private readonly oAuthClient: KoreaInvestmentOauthClient,
    ) {}

    /**
     * @param method
     * @param url
     * @param payload
     * @param params
     * @param headers
     */
    public async request<T, R>({
        method,
        url,
        data: payload,
        params,
        headers,
    }: Pick<
        AxiosRequestConfig<T>,
        'method' | 'url' | 'params' | 'data' | 'headers'
    >): Promise<R> {
        const response = await this.client.request<R>({
            method,
            url,
            params,
            data: payload,
            headers,
            timeout: 3000,
        });

        return response.data;
    }

    /**
     * @param tradeId
     * @param tradeCond
     */
    public async buildHeaders(
        tradeId: string,
        tradeCond?: string,
    ): Promise<KoreaInvestmentBaseHeader> {
        const credential = this.getCredential();
        const token = await this.getToken();

        return {
            'content-type': 'application/json; charset=utf-8',
            appkey: credential.appkey,
            appsecret: credential.appsecret,
            authorization: `Bearer ${token}`,
            custtype: CustomerType.Personal,
            tr_id: tradeId,
        };
    }

    /**
     *
     */
    public async getToken() {
        const redisKey = getRedisKey('korea-investment', 'token');

        const token = await this.redisService.get(redisKey);
        if (token) {
            return token;
        }

        const { access_token, access_token_token_expired } =
            await this.oAuthClient.getToken(
                this.configService.getCredentials(),
            );

        const expireSeconds = this.calculateTokenExpireSeconds(
            access_token_token_expired,
        );

        await this.redisService.set(redisKey, access_token, {
            seconds: expireSeconds - 60,
        });

        return access_token;
    }

    /**
     * @param expirationDateString
     * @private
     */
    private calculateTokenExpireSeconds(expirationDateString: string): number {
        const expirationTime = new Date(expirationDateString).getTime();
        const currentTime = new Date().getTime();

        return Math.round((expirationTime - currentTime) / 1000);
    }

    public getCredential() {
        return this.configService.getCredentials();
    }
}
