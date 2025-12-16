import { AxiosInstance } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import {
    NaverApiNewsParams,
    NaverApiNewsResponse,
} from '@modules/naver/naver-api/naver-api.types';

@Injectable()
export class NaverApiClient {
    constructor(@Inject('Client') private readonly client: AxiosInstance) {}

    /**
     * @param params
     */
    public async getNews(
        params: NaverApiNewsParams,
    ): Promise<NaverApiNewsResponse> {
        const response = await this.client.get<NaverApiNewsResponse>(
            '/v1/search/news.json',
            { params },
        );

        return response.data;
    }
}
