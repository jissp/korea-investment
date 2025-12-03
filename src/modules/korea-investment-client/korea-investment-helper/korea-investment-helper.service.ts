import { Axios, AxiosRequestConfig } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { getRedisKey, RedisService } from '@modules/redis';
import { KoreaInvestmentConfigService } from '@modules/korea-investment-client/korea-investment-config';
import { KoreaInvestmentOauthClient } from '@modules/korea-investment-client/korea-investment-oauth-client';
import { KoreaInvestmentBaseHeader } from '@modules/korea-investment-client/common';
import { CustomerType } from '@modules/korea-investment-client/korea-investment-quotation-client';

@Injectable()
export class KoreaInvestmentHelperService {
    constructor(
        private readonly configService: KoreaInvestmentConfigService,
        @Inject('Client') private readonly client: Axios,
        private readonly oAuthClient: KoreaInvestmentOauthClient,
        private readonly redisService: RedisService,
    ) {}

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
            custtype: CustomerType.개인,
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

        const expireSeconds = Math.round(
            (new Date(access_token_token_expired).getTime() -
                new Date().getTime()) /
                1000,
        );

        await this.redisService.set(redisKey, access_token, {
            seconds: expireSeconds - 60,
        });

        return access_token;
    }

    public getCredential() {
        return this.configService.getCredentials();
    }
}
