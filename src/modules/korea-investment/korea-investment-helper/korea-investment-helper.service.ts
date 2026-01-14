import { Axios, AxiosRequestConfig } from 'axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getRedisKey, RedisService } from '@modules/redis';
import { KoreaInvestmentBaseHeader } from '@modules/korea-investment/common';
import { KoreaInvestmentConfigService } from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentOauthClient } from '@modules/korea-investment/korea-investment-oauth-client';
import {
    KoreaInvestmentHelperConfig,
    KoreaInvestmentHelperProvider,
} from './korea-investment-helper.types';

@Injectable()
export class KoreaInvestmentHelperService {
    private readonly WEBSOCKET_TOKEN_TTL = 86400;
    private readonly WEBSOCKET_TOKEN_TTL_BUFFER = 3600;

    private readonly logger = new Logger(KoreaInvestmentHelperService.name);

    constructor(
        private readonly redisService: RedisService,
        private readonly configService: KoreaInvestmentConfigService,
        private readonly oAuthClient: KoreaInvestmentOauthClient,
        @Inject(KoreaInvestmentHelperProvider.Config)
        private readonly config: KoreaInvestmentHelperConfig,
        @Inject(KoreaInvestmentHelperProvider.Client)
        private readonly client: Axios,
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
        try {
            const response = await this.client.request<R>({
                method,
                url,
                params,
                data: payload,
                headers,
                timeout: 5000,
            });

            return response.data;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    /**
     * @param tradeId
     */
    public async buildHeaders(
        tradeId: string,
    ): Promise<Pick<KoreaInvestmentBaseHeader, 'authorization' | 'tr_id'>> {
        const token = await this.getToken();

        return {
            authorization: `Bearer ${token}`,
            tr_id: tradeId,
        };
    }

    /**
     * 한국투자증권 API 액세스 토큰을 발급합니다.
     */
    public async getToken() {
        const credentialType = this.getCredentialType();
        const redisKey = getRedisKey(
            'korea-investment',
            'token',
            credentialType,
        );

        const token = await this.redisService.get(redisKey);
        if (token) {
            return token;
        }

        const { access_token, access_token_token_expired } =
            await this.oAuthClient.getToken(this.configService.getCredential());

        const expireSeconds = this.calculateTokenExpireSeconds(
            access_token_token_expired,
        );

        await this.redisService.set(redisKey, access_token, {
            seconds: expireSeconds - 60,
        });

        return access_token;
    }

    /**
     * 실시간 (웹소켓) 접속키를 응답합니다.
     */
    public async getWebSocketToken() {
        const redisKey = getRedisKey('korea-investment', 'websocket-token');

        const token = await this.redisService.get(redisKey);
        if (token) {
            return token;
        }

        const { approval_key } = await this.oAuthClient.getWebSocketToken(
            this.configService.getCredential(),
        );

        await this.redisService.set(redisKey, approval_key, {
            seconds: this.WEBSOCKET_TOKEN_TTL - this.WEBSOCKET_TOKEN_TTL_BUFFER,
        });

        return approval_key;
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

    /**
     * 인증정보 타입을 반환합니다.
     */
    public getCredentialType() {
        return this.config.credentialType;
    }

    /**
     * 한국투자증권 API 인증 정보 설정을 응답합니다.
     */
    public getCredential() {
        return this.config.credential;
    }
}
