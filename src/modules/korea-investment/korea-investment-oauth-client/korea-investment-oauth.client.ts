import { Axios } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { AppCredentials } from '@modules/korea-investment/common';
import {
    KoreaInvestmentOauthClientProvider,
    Oauth2WebSocketTokenRequestBody,
    Oauth2WebsocketTokenResponse,
    RequestBodyOauth2TokenP,
    ResponseOauth2RevokeTokenP,
    ResponseOauth2TokenP,
} from './korea-investment-oauth-client.types';

@Injectable()
export class KoreaInvestmentOauthClient {
    constructor(
        @Inject(KoreaInvestmentOauthClientProvider.Client)
        private readonly client: Axios,
    ) {}

    /**
     * 접근토큰발급
     * @param credential
     */
    public async getToken<R = ResponseOauth2TokenP>(
        credential: AppCredentials,
    ): Promise<R> {
        const response = await this.client.request<R>({
            method: 'POST',
            url: '/oauth2/tokenP',
            data: {
                ...credential,
                grant_type: 'client_credentials',
            } as RequestBodyOauth2TokenP,
        });

        return response.data;
    }

    /**
     * 접근토큰폐기
     * @param credential
     * @param token
     */
    public async revokeToken<R = ResponseOauth2RevokeTokenP>({
        credential,
        token,
    }: {
        credential: AppCredentials;
        token: string;
    }): Promise<R> {
        const response = await this.client.request<R>({
            method: 'POST',
            url: '/oauth2/revokeP',
            data: {
                credential,
                token,
            },
        });

        return response.data;
    }

    /**
     * 실시간(웹소켓) 접속 키 발급
     * @param credential
     */
    public async getWebSocketToken(
        credential: AppCredentials,
    ): Promise<Oauth2WebsocketTokenResponse> {
        const response =
            await this.client.request<Oauth2WebsocketTokenResponse>({
                method: 'POST',
                url: '/oauth2/Approval',
                data: {
                    appkey: credential.appkey,
                    secretkey: credential.appsecret,
                    grant_type: 'client_credentials',
                } as Oauth2WebSocketTokenRequestBody,
            });

        return response.data;
    }
}
