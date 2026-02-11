import { AxiosInstance } from 'axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { XmlParserService } from '@modules/xml-parser';
import { RssChannel, RssReaderProvider } from './rss-reader.types';

@Injectable()
export class RssReaderService {
    private readonly logger = new Logger(RssReaderService.name);

    constructor(
        private readonly xmlParserService: XmlParserService,
        @Inject(RssReaderProvider.HttpClient)
        private readonly httpClient: AxiosInstance,
    ) {}

    /**
     * RSS URL에서 피드를 조회하고 파싱합니다.
     * @param url
     */
    public async readFeed<T>(url: string): Promise<T[]> {
        try {
            const response = await this.httpClient.get(url);

            return this.parseFeed<T>(response.data);
        } catch (error) {
            this.logger.error(`Failed to read RSS feed from ${url}`, error);
            throw error;
        }
    }

    /**
     * XML 데이터를 RSS 피드로 파싱합니다.
     * @param xml
     * @private
     */
    private parseFeed<T>(xml: string): T[] {
        const feed = this.xmlParserService.parse<{
            rss: { channel: RssChannel<T> };
        }>(xml);
        if (!feed?.rss?.channel?.item) {
            return [];
        }

        const { item } = feed.rss.channel;

        return Array.isArray(item) ? item : [item];
    }
}
