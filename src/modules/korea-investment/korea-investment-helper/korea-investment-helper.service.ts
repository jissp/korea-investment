import { Axios, AxiosRequestConfig } from 'axios';
import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { Cacheable, getRedisKey } from '@modules/redis';
import { KoreaInvestmentBaseHeader } from '@modules/korea-investment/common';
import { KoreaInvestmentOauthClient } from '@modules/korea-investment/korea-investment-oauth-client';
import {
    KoreaInvestmentHelperConfig,
    KoreaInvestmentHelperProvider,
} from './korea-investment-helper.types';

const ACCESS_TOKEN_TTL = 600;

@Injectable()
export class KoreaInvestmentHelperService {
    private readonly logger = new Logger(KoreaInvestmentHelperService.name);

    constructor(
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
    @Cacheable({
        key: function (this: KoreaInvestmentHelperService) {
            const credentialType = this.config.credentialType;

            return getRedisKey('korea-investment', 'token', credentialType);
        },
        ttl: ACCESS_TOKEN_TTL,
    })
    public async getToken() {
        const { access_token } = await this.oAuthClient.getToken(
            this.config.credential,
        );
        if (!access_token) {
            this.logger.error('토큰 발급 실패');
            throw new BadRequestException('토큰 발급 실패');
        }

        return access_token;
    }

    /**
     * 실시간 (웹소켓) 접속키를 응답합니다.
     */
    @Cacheable({
        key: () => getRedisKey('korea-investment', 'websocket-token'),
        ttl: ACCESS_TOKEN_TTL,
    })
    public async getWebSocketToken() {
        const { approval_key } = await this.oAuthClient.getWebSocketToken(
            this.config.credential,
        );

        return approval_key;
    }
}
