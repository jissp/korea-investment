import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { StockRepository } from '@app/modules/stock-repository';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api';
import {
    KoreaInvestmentNewsCrawlerType,
    RequestDomesticNewsTitleResponse,
} from './korea-investment-news-crawler.types';

@Injectable()
export class KoreaInvestmentNewsCrawlerProcessor {
    private readonly logger = new Logger(
        KoreaInvestmentNewsCrawlerProcessor.name,
    );

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly stockRepository: StockRepository,
    ) {}

    @OnQueueProcessor(KoreaInvestmentNewsCrawlerType.RequestDomesticNewsTitle)
    async processRequestDomesticNewsTitle(job: Job) {
        try {
            const childrenResponse =
                await this.koreaInvestmentRequestApiHelper.getChildResponses<
                    any,
                    RequestDomesticNewsTitleResponse
                >(job);
            const childrenResults = childrenResponse.flatMap(
                (response) => response.output,
            );

            await this.stockRepository.setKoreaInvestmentNews(childrenResults);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
