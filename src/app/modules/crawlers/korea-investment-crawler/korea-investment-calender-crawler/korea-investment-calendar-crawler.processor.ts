import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import {
    DomesticHolidayInquiryOutput,
    DomesticHolidayInquiryParam,
} from '@modules/korea-investment/common';
import { HolidayTransformer } from '@app/common/korea-investment';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import { KoreaInvestmentCalendarService } from '@app/modules/repositories/korea-investment-calendar';
import { KoreaInvestmentCalendarCrawlerFlowType } from './korea-investment-calendar-crawler.types';

@Injectable()
export class KoreaInvestmentCalendarCrawlerProcessor {
    private readonly logger = new Logger(
        KoreaInvestmentCalendarCrawlerProcessor.name,
    );

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly calendarService: KoreaInvestmentCalendarService,
    ) {}

    @OnQueueProcessor(KoreaInvestmentCalendarCrawlerFlowType.CrawlingCalendar)
    async processRequestDomesticDailyIndex(job: Job) {
        try {
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildResponses<
                    DomesticHolidayInquiryParam,
                    DomesticHolidayInquiryOutput[]
                >(job);
            const outputs = childrenResponses.flatMap(
                ({ response }) => response.output,
            );

            const transformer = new HolidayTransformer();

            const dtoList = outputs.map((output) =>
                transformer.transform(output),
            );

            for (const dto of dtoList) {
                const isExists = await this.calendarService.exists(dto.date);
                if (isExists) {
                    continue;
                }

                await this.calendarService.insert(dto);
            }
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
