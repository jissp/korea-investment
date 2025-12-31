import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentConfigService } from '@modules/korea-investment/korea-investment-config';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import { AccountRepository } from '@app/modules/repositories';
import { KoreaInvestmentAccountCrawlerType } from './korea-investment-account-crawler.types';
import { KoreaInvestmentSettingService } from '@app/modules/korea-investment-setting';

@Injectable()
export class KoreaInvestmentAccountCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(
        KoreaInvestmentAccountCrawlerSchedule.name,
    );

    constructor(
        private readonly koreaInvestmentSettingService: KoreaInvestmentSettingService,
        private readonly koreaInvestmentConfigService: KoreaInvestmentConfigService,
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly accountRepository: AccountRepository,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccount)
        private readonly requestKoreaInvestmentAccountFlow: FlowProducer,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccountStocks)
        private readonly requestKoreaInvestmentAccountStockFlow: FlowProducer,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccountStockGroups)
        private readonly requestAccountStockGroupsFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaInvestmentAccounts();
        this.handleCrawlingKoreaInvestmentAccountStocks();
        this.handleCrawlingKoreaInvestmentAccountStockGroups();
    }

    @Cron('*/1 * * * *')
    async handleCrawlingKoreaInvestmentAccounts() {
        try {
            const accounts =
                await this.koreaInvestmentSettingService.getAccountNumbers();

            const queueName = KoreaInvestmentAccountCrawlerType.RequestAccount;
            await this.requestKoreaInvestmentAccountFlow.add(
                {
                    name: queueName,
                    queueName,
                    children: accounts.map((account) => {
                        const { caNo, prdtCd } = this.splitAccount(account);

                        return this.requestApiHelper.generateDomesticInquireAccountBalance(
                            {
                                CANO: caNo,
                                ACNT_PRDT_CD: prdtCd,
                                INQR_DVSN_1: '',
                                BSPR_BF_DT_APLY_YN: '',
                            },
                        );
                    }),
                },
                {
                    queuesOptions: {
                        [queueName]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [KoreaInvestmentRequestApiType]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
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
            const accounts =
                await this.koreaInvestmentSettingService.getAccountNumbers();

            const queueName =
                KoreaInvestmentAccountCrawlerType.RequestAccountStocks;
            await this.requestKoreaInvestmentAccountStockFlow.add(
                {
                    name: queueName,
                    queueName,
                    children: accounts.map((account) => {
                        const { caNo, prdtCd } = this.splitAccount(account);

                        return this.requestApiHelper.generateDomesticInquireBalance(
                            {
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
                        );
                    }),
                },
                {
                    queuesOptions: {
                        [queueName]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [KoreaInvestmentRequestApiType]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron('*/3 * * * *')
    async handleCrawlingKoreaInvestmentAccountStockGroups() {
        try {
            const userId = this.koreaInvestmentConfigService.getUserId();

            const queueName =
                KoreaInvestmentAccountCrawlerType.RequestAccountStockGroups;
            await this.requestAccountStockGroupsFlow.add(
                {
                    name: queueName,
                    queueName,
                    data: { userId },
                    children: [
                        this.requestApiHelper.generateInterestGroupList({
                            TYPE: '1',
                            FID_ETC_CLS_CODE: '00',
                            USER_ID: userId,
                        }),
                    ],
                },
                {
                    queuesOptions: {
                        [queueName]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [KoreaInvestmentRequestApiType]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                    },
                },
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Cron('*/3 * * * *')
    async handleCrawlingKoreaInvestmentAccountFavoriteStocksByGroup() {
        try {
            const userId = this.koreaInvestmentConfigService.getUserId();

            const queueName =
                KoreaInvestmentAccountCrawlerType.RequestAccountStocksByGroup;
            await this.requestAccountStockGroupsFlow.add(
                {
                    name: queueName,
                    queueName,
                    data: { userId },
                    children: [
                        this.requestApiHelper.generateInterestGroupList({
                            TYPE: '1',
                            FID_ETC_CLS_CODE: '00',
                            USER_ID: userId,
                        }),
                    ],
                },
                {
                    queuesOptions: {
                        [queueName]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
                        [KoreaInvestmentRequestApiType]: {
                            defaultJobOptions: getDefaultJobOptions(),
                        },
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
