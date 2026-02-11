import { Inject, Injectable } from '@nestjs/common';
import { RssReaderService } from '@modules/rss-reader';
import {
    GoogleRssConfig,
    GoogleRssItem,
    GoogleRssProvider,
} from './google-rss.types';

@Injectable()
export class GoogleRssService {
    constructor(
        private readonly rssReaderService: RssReaderService,
        @Inject(GoogleRssProvider.Config)
        private readonly config: GoogleRssConfig,
    ) {}

    /**
     * Google News에서 비즈니스 뉴스를 조회합니다.
     */
    public async getBusinessNews(): Promise<GoogleRssItem[]> {
        return await this.rssReaderService.readFeed<GoogleRssItem>(
            this.config.business,
        );
    }
}
