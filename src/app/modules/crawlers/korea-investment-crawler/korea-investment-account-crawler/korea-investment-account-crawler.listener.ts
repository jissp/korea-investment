import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentInterestGroupListOutput } from '@modules/korea-investment/common';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api/common';
import {
    KoreaInvestmentAccountCrawlerEventType,
    KoreaInvestmentAccountCrawlerType,
} from './korea-investment-account-crawler.types';

@Injectable()
export class KoreaInvestmentAccountCrawlerListener {
    private readonly logger = new Logger(
        KoreaInvestmentAccountCrawlerListener.name,
    );

    constructor(
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccountStocksByGroup)
        private readonly requestAccountStocksByGroupFlow: FlowProducer,
    ) {}

    @OnEvent(KoreaInvestmentAccountCrawlerEventType.UpdatedStockGroup)
    async handleUpdatedStockGroup(message: {
        userId: string;
        output: KoreaInvestmentInterestGroupListOutput;
    }) {
        try {
            const queueName =
                KoreaInvestmentAccountCrawlerType.RequestAccountStocksByGroup;
            const queuesOption = {
                defaultJobOptions: getDefaultJobOptions(),
            };

            await this.requestAccountStocksByGroupFlow.add(
                {
                    name: queueName,
                    queueName,
                    data: { userId: message.userId },
                    children: [
                        this.requestApiHelper.generateInterestStockListByGroup({
                            TYPE: '1',
                            USER_ID: message.userId,
                            INTER_GRP_CODE: message.output.inter_grp_code,
                            INTER_GRP_NAME: '',
                            DATA_RANK: '',
                            HTS_KOR_ISNM: '',
                            CNTG_CLS_CODE: '',
                            FID_ETC_CLS_CODE: '4',
                        }),
                    ],
                },
                {
                    queuesOptions: {
                        [KoreaInvestmentAccountCrawlerType.RequestAccountStocksByGroup]:
                            queuesOption,
                        [KoreaInvestmentRequestApiType.Main]: queuesOption,
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }
}
