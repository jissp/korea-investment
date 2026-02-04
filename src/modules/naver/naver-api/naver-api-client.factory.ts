import axios from 'axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NaverConfig } from '@modules/naver/common';
import { NaverApiProvider, NaverAppName } from './naver-api.types';
import { NaverApiClient } from './naver-api.client';

@Injectable()
export class NaverApiClientFactory {
    constructor(
        @Inject(NaverApiProvider.NaverApiConfig)
        private readonly config: NaverConfig,
    ) {}

    /**
     * Naver API Client를 생성합니다.
     * @param appName
     */
    public create(appName: NaverAppName) {
        const client = axios.create(this.getNaverAppConfig(appName));

        return new NaverApiClient(client);
    }

    /**
     * Naver API Client 설정을 가져옵니다.
     * @param appName
     * @private
     */
    private getNaverAppConfig(appName: NaverAppName) {
        if (!this.config.app[appName]) {
            throw new BadRequestException('Invalid Naver App Name: ' + appName);
        }

        return {
            baseURL: this.config.app[appName].host,
            headers: {
                'X-Naver-Client-Id': this.config.app[appName].key,
                'X-Naver-Client-Secret': this.config.app[appName].secret,
            },
            timeout: 5000,
        };
    }
}
