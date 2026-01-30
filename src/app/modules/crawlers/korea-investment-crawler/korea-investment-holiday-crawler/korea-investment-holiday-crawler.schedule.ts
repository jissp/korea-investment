import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PreventConcurrentExecution } from '@common/decorators';
import { toDateYmdByDate } from '@common/utils';
import { getDefaultJobOptions } from '@modules/queue';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api/common';
import { KoreaInvestmentHolidayService } from '@app/modules/repositories/korea-investment-holiday';
import { DomesticHolidayInquiryParam } from './korea-investment-holiday-crawler.interface';
import { KoreaInvestmentHolidayCrawlerFlowType } from './korea-investment-holiday-crawler.types';

@Injectable()
class KoreaInvestmentHolidayCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(
        KoreaInvestmentHolidayCrawlerSchedule.name,
    );

    constructor(
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly koreaInvestmentHolidayService: KoreaInvestmentHolidayService,
        @Inject(KoreaInvestmentHolidayCrawlerFlowType.CrawlingHoliday)
        private readonly crawlingHolidayFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleRequestCrawlingHolidayByToday();
    }

    @Cron('0 */1 * * *')
    @PreventConcurrentExecution()
    async handleRequestCrawlingHolidayByToday() {
        const fromDate = new Date();

        const holiday = await this.koreaInvestmentHolidayService.getByDate(
            toDateYmdByDate({
                date: fromDate,
                separator: '-',
            }),
        );
        if (holiday) {
            return;
        }

        fromDate.setDate(fromDate.getDate() - 7);

        const queueName = KoreaInvestmentHolidayCrawlerFlowType.CrawlingHoliday;
        await this.crawlingHolidayFlow.add(
            {
                name: queueName,
                queueName,
                children: [
                    this.requestApiHelper.generateRequestApi<DomesticHolidayInquiryParam>(
                        KoreaInvestmentRequestApiType.Additional,
                        {
                            url: '/uapi/domestic-stock/v1/quotations/chk-holiday',
                            tradeId: 'CTCA0903R',
                            params: {
                                BASS_DT: toDateYmdByDate({
                                    date: fromDate,
                                }),
                                CTX_AREA_FK: '',
                                CTX_AREA_NK: '',
                            },
                        },
                    ),
                ],
            },
            {
                queuesOptions: {
                    [queueName]: {
                        defaultJobOptions: getDefaultJobOptions(),
                    },
                    [KoreaInvestmentRequestApiType.Additional]: {
                        defaultJobOptions: getDefaultJobOptions(),
                    },
                },
            },
        );
    }
}

export default KoreaInvestmentHolidayCrawlerSchedule;
