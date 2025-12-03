import { Axios } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { AppCredentials } from '@modules/korea-investment-client/common';
import {
    ResponseOauth2RevokeTokenP,
    ResponseOauth2TokenP,
} from './korea-investment-oauth-client.types';

@Injectable()
export class KoreaInvestmentOauthClient {
    constructor(@Inject('Client') private readonly client: Axios) {}

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
            },
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
}
