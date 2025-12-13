import { AxiosInstance } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { StockPlusNewsResponse, StockPlusResponse } from './stock-plus.types';

@Injectable()
export class StockPlusClient {
    constructor(@Inject('Client') private readonly client: AxiosInstance) {}

    /**
     * @param limit
     */
    public async getLatestNews(limit: number = 20) {
        const response = await this.client.request<
            StockPlusResponse<StockPlusNewsResponse>
        >({
            url: '/news/api/v2/breaking-news',
            headers: {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
            },
            params: {
                limit: 20,
            },
        });

        return response.data;
    }
}
