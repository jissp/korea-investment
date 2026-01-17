import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import { KoreaInvestmentHolidayService } from '@app/modules/repositories/korea-investment-holiday';
import { KoreaInvestmentHolidayCrawlerFlowType } from './korea-investment-holiday-crawler.types';
import {
    DomesticHolidayInquiryOutput,
    DomesticHolidayInquiryParam,
} from './korea-investment-holiday-crawler.interface';
import { HolidayTransformer } from './transformers';

@Injectable()
export class KoreaInvestmentHolidayCrawlerProcessor {
    private readonly logger = new Logger(
        KoreaInvestmentHolidayCrawlerProcessor.name,
    );

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly koreaInvestmentHolidayService: KoreaInvestmentHolidayService,
    ) {}

    @OnQueueProcessor(KoreaInvestmentHolidayCrawlerFlowType.CrawlingHoliday)
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

            const holidayDtoList = outputs.map((output) =>
                transformer.transform(output),
            );

            for (const dto of holidayDtoList) {
                const isExists =
                    await this.koreaInvestmentHolidayService.exists(dto.date);
                if (isExists) {
                    continue;
                }

                await this.koreaInvestmentHolidayService.insert(dto);
            }
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
