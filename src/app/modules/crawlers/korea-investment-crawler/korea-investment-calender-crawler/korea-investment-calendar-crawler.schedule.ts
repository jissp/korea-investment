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
import { KoreaInvestmentCalendarService } from '@app/modules/repositories/korea-investment-calendar';
import { DomesticHolidayInquiryParam } from './korea-investment-calendar-crawler.interface';
import { KoreaInvestmentCalendarCrawlerFlowType } from './korea-investment-calendar-crawler.types';

@Injectable()
class KoreaInvestmentCalendarCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(
        KoreaInvestmentCalendarCrawlerSchedule.name,
    );

    constructor(
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly calendarService: KoreaInvestmentCalendarService,
        @Inject(KoreaInvestmentCalendarCrawlerFlowType.CrawlingCalendar)
        private readonly crawlingCalendarFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleRequestCrawlingCalendar();
    }

    @Cron('0 */1 * * *')
    @PreventConcurrentExecution()
    async handleRequestCrawlingCalendar() {
        const fromDate = new Date();

        const holiday = await this.calendarService.getByDate(
            toDateYmdByDate({
                date: fromDate,
                separator: '-',
            }),
        );
        if (holiday) {
            return;
        }

        fromDate.setDate(fromDate.getDate() - 7);

        const queueName =
            KoreaInvestmentCalendarCrawlerFlowType.CrawlingCalendar;
        await this.crawlingCalendarFlow.add(
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

export default KoreaInvestmentCalendarCrawlerSchedule;
