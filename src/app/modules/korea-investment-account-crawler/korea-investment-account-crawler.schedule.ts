import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentAccountService } from '@app/modules/korea-investment-account';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import {
    KoreaInvestmentAccountCrawlerType,
    KoreaInvestmentAccountParam,
    KoreaInvestmentAccountStockParam,
} from './korea-investment-account-crawler.types';

@Injectable()
export class KoreaInvestmentAccountCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(
        KoreaInvestmentAccountCrawlerSchedule.name,
    );

    constructor(
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly koreaInvestmentAccountService: KoreaInvestmentAccountService,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccount)
        private readonly requestKoreaInvestmentAccountFlow: FlowProducer,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccountStocks)
        private readonly requestKoreaInvestmentAccountStockFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaInvestmentAccounts();
        this.handleCrawlingKoreaInvestmentAccountStocks();
    }

    @Cron('*/1 * * * *')
    async handleCrawlingKoreaInvestmentAccounts() {
        try {
            const queueName = KoreaInvestmentAccountCrawlerType.RequestAccount;
            const queuesOption = {
                defaultJobOptions: getDefaultJobOptions(),
            };

            const accounts =
                await this.koreaInvestmentAccountService.getAccountNumbers();

            await this.requestKoreaInvestmentAccountFlow.add(
                {
                    name: queueName,
                    queueName,
                    children: accounts.map((account) => {
                        const { caNo, prdtCd } = this.splitAccount(account);

                        return this.requestApiHelper.generateRequestApi<KoreaInvestmentAccountParam>(
                            {
                                url: '/uapi/domestic-stock/v1/trading/inquire-account-balance',
                                tradeId: 'CTRP6548R',
                                params: {
                                    CANO: caNo,
                                    ACNT_PRDT_CD: prdtCd,
                                    INQR_DVSN_1: '',
                                    BSPR_BF_DT_APLY_YN: '',
                                },
                            },
                        );
                    }),
                },
                {
                    queuesOptions: {
                        [KoreaInvestmentAccountCrawlerType.RequestAccount]:
                            queuesOption,
                        [KoreaInvestmentRequestApiType]: queuesOption,
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron('*/30 * * * * *')
    async handleCrawlingKoreaInvestmentAccountStocks() {
        try {
            const queueName =
                KoreaInvestmentAccountCrawlerType.RequestAccountStocks;
            const queuesOption = {
                defaultJobOptions: getDefaultJobOptions(),
            };

            const accounts =
                await this.koreaInvestmentAccountService.getAccountNumbers();

            await this.requestKoreaInvestmentAccountStockFlow.add(
                {
                    name: queueName,
                    queueName,
                    children: accounts.map((account) => {
                        const { caNo, prdtCd } = this.splitAccount(account);

                        return this.requestApiHelper.generateRequestApi<KoreaInvestmentAccountStockParam>(
                            {
                                url: '/uapi/domestic-stock/v1/trading/inquire-balance',
                                tradeId: 'TTTC8434R',
                                params: {
                                    CANO: caNo,
                                    ACNT_PRDT_CD: prdtCd,
                                    AFHR_FLPR_YN: 'N',
                                    OFL_YN: '',
                                    INQR_DVSN: '02',
                                    UNPR_DVSN: '01',
                                    FUND_STTL_ICLD_YN: 'N',
                                    FNCG_AMT_AUTO_RDPT_YN: 'N',
                                    PRCS_DVSN: '00',
                                    CTX_AREA_NK100: '',
                                    CTX_AREA_FK100: '',
                                },
                            },
                        );
                    }),
                },
                {
                    queuesOptions: {
                        [KoreaInvestmentAccountCrawlerType.RequestAccountStocks]:
                            queuesOption,
                        [KoreaInvestmentRequestApiType]: queuesOption,
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * 계좌 번호를 분리합니다.
     * @param account
     * @private
     */
    private splitAccount(account: string) {
        const [caNo, prdtCd] = account.split('-');

        return {
            caNo,
            prdtCd,
        };
    }
}
