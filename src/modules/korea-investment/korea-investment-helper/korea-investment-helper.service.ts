import { Axios, AxiosRequestConfig } from 'axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getRedisKey, RedisService } from '@modules/redis';
import {
    CustomerType,
    KoreaInvestmentBaseHeader,
} from '@modules/korea-investment/common';
import { KoreaInvestmentConfigService } from '@modules/korea-investment/korea-investment-config';
import { KoreaInvestmentOauthClient } from '@modules/korea-investment/korea-investment-oauth-client';

@Injectable()
export class KoreaInvestmentHelperService {
    private readonly WEBSOCKET_TOKEN_TTL = 86400;
    private readonly WEBSOCKET_TOKEN_TTL_BUFFER = 3600; //

    private readonly logger = new Logger(KoreaInvestmentHelperService.name);

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
     * 실시간 (웹소켓) 접속키를 응답합니다.
     */
    public async getWebSocketToken() {
        const redisKey = getRedisKey('korea-investment', 'websocket-token');

        const token = await this.redisService.get(redisKey);
        if (token) {
            return token;
        }

        const { approval_key } = await this.oAuthClient.getWebSocketToken(
            this.configService.getCredentials(),
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

    public getCredential() {
        return this.configService.getCredentials();
    }

    /**
     * 숫자를 2자리 문자열로 패딩
     */
    private formatTwoDigits(num: number): string {
        return num.toString().padStart(2, '0');
    }

    /**
     * Date 객체를 YYYYMMDD 형식으로 변환
     */
    public formatDateParam(date: Date): string {
        const year = date.getFullYear();
        const month = this.formatTwoDigits(date.getMonth() + 1);
        const day = this.formatTwoDigits(date.getDate());

        return `${year}${month}${day}`;
    }

    /**
     * Date 객체를 HHMMSS 형식으로 변환
     */
    public formatTimeParam(date: Date): string {
        const hour = this.formatTwoDigits(date.getHours());
        const minute = this.formatTwoDigits(date.getMinutes());
        const seconds = this.formatTwoDigits(date.getSeconds());

        return `${hour}${minute}${seconds}`;
    }

    /**
     * 한국투자증권 dateDt 포맷 형식을 Y, M, D 로 분리한다.
     * @param dateDt
     */
    public splitDateDt(dateDt: string) {
        const dateMatch = dateDt.match(/(\d{4})(\d{2})(\d{2})/);

        if (!dateMatch) {
            throw new Error(`Invalid date format: ${dateDt}`);
        }

        const [, year, month, day] = dateMatch;

        return [year, month, day];
    }

    /**
     * 한국투자증권 timeDt 포맷 형식을 H, M, S 로 분리한다.
     * @param dateTm
     */
    public splitTimeDt(dateTm: string) {
        const timeMatch = dateTm.match(/(\d{2})(\d{2})(\d{2})/);

        if (!timeMatch) {
            throw new Error(`Invalid date format: ${dateTm}`);
        }

        const [, hour, minute, second] = timeMatch;

        return [hour, minute, second];
    }
}
