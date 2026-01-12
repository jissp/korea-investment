import * as _ from 'lodash';
import { FlowProducer } from 'bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { uniqueValues } from '@common/utils';
import { getCurrentMarketDivCode } from '@common/domains';
import { getDefaultJobOptions } from '@modules/queue';
import { KoreaInvestmentConfigService } from '@modules/korea-investment/korea-investment-config';
import { MarketType } from '@app/common';
import {
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api';
import { AccountService } from '@app/modules/repositories/account';
import { AccountStockGroupStockService } from '@app/modules/repositories/account-stock-group';
import { StockService } from '@app/modules/repositories/stock';
import { KoreaInvestmentAccountCrawlerType } from './korea-investment-account-crawler.types';
import { PreventConcurrentExecution } from '@common/decorators';

@Injectable()
export class KoreaInvestmentAccountCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(
        KoreaInvestmentAccountCrawlerSchedule.name,
    );

    constructor(
        private readonly koreaInvestmentConfigService: KoreaInvestmentConfigService,
        private readonly requestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
        private readonly accountService: AccountService,
        private readonly stockService: StockService,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccount)
        private readonly requestKoreaInvestmentAccountFlow: FlowProducer,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccountStocks)
        private readonly requestKoreaInvestmentAccountStockFlow: FlowProducer,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccountStockGroups)
        private readonly requestAccountStockGroupsFlow: FlowProducer,
        @Inject(
            KoreaInvestmentAccountCrawlerType.UpdateAccountStockGroupStockPrices,
        )
        private readonly updateAccountStockGroupStockPricesFlow: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingKoreaInvestmentAccounts();
        this.handleCrawlingKoreaInvestmentAccountStocks();
        this.handleCrawlingKoreaInvestmentAccountStockGroups();
        this.handleCrawlingKoreaInvestmentAccountFavoriteStocksByGroup();
        this.handleUpdateAccountStockGroupStockPrices();
    }

    @Cron('*/1 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingKoreaInvestmentAccounts() {
        try {
            const accounts = await this.accountService.getAccounts();

            const queueName = KoreaInvestmentAccountCrawlerType.RequestAccount;
            await this.requestKoreaInvestmentAccountFlow.add(
                {
                    name: queueName,
                    queueName,
                    children: accounts.map(({ accountId }) => {
                        const { caNo, prdtCd } = this.splitAccount(accountId);

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
    @PreventConcurrentExecution()
    async handleCrawlingKoreaInvestmentAccountStocks() {
        try {
            const accounts = await this.accountService.getAccounts();

            const queueName =
                KoreaInvestmentAccountCrawlerType.RequestAccountStocks;
            await this.requestKoreaInvestmentAccountStockFlow.add(
                {
                    name: queueName,
                    queueName,
                    children: accounts.map(({ accountId }) => {
                        const { caNo, prdtCd } = this.splitAccount(accountId);

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
    @PreventConcurrentExecution()
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
    @PreventConcurrentExecution()
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

    @Cron('*/10 * * * * *')
    @PreventConcurrentExecution()
    async handleUpdateAccountStockGroupStockPrices() {
        try {
            const marketDivCode = getCurrentMarketDivCode();
            if (isNil(marketDivCode)) {
                return;
            }

            const stocksByStockGroup =
                await this.accountStockGroupStockService.getAll();
            const stockCodes = uniqueValues(
                stocksByStockGroup.map((stock) => stock.stockCode),
            );

            const stocks = await this.stockService.getStocksByStockCode({
                marketType: MarketType.Domestic,
                stockCodes,
            });

            const queueName =
                KoreaInvestmentAccountCrawlerType.UpdateAccountStockGroupStockPrices;
            await Promise.all(
                _.chunk(stocks, 30).map((stocks) => {
                    const stockCodes = stocks.map((stock) => stock.shortCode);

                    return this.updateAccountStockGroupStockPricesFlow.add(
                        {
                            name: queueName,
                            queueName,
                            children: [
                                this.requestApiHelper.generateRequestApiForIntstockMultiPrice(
                                    stockCodes,
                                ),
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
                }),
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
