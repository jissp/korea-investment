import { AxiosInstance } from 'axios';
import {
    NaverApiNewsParams,
    NaverApiNewsResponse,
} from './naver-api.interface';

export class NaverApiClient {
    constructor(private readonly client: AxiosInstance) {}

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
