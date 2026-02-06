import { difference } from 'lodash';
import { FlowProducer, Job } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getDefaultJobOptions, OnQueueProcessor } from '@modules/queue';
import {
    KoreaInvestmentAccountOutput2,
    KoreaInvestmentAccountParam,
    KoreaInvestmentAccountStockOutput,
    KoreaInvestmentAccountStockParam,
    KoreaInvestmentInterestGroupListOutput,
    KoreaInvestmentInterestGroupListParam,
    KoreaInvestmentInterestStockListByGroupOutput,
    KoreaInvestmentInterestStockListByGroupOutput2,
    KoreaInvestmentInterestStockListByGroupParam,
} from '@modules/korea-investment/common';
import { isDelistedStockByName } from '@app/common/domains';
import {
    AccountStockGroupTransformer,
    AccountStockTransformer,
    AccountTransformer,
} from '@app/common/korea-investment';
import {
    KoreaInvestmentCallApiMultiResult,
    KoreaInvestmentRequestApiHelper,
    KoreaInvestmentRequestApiType,
} from '@app/modules/korea-investment-request-api/common';
import {
    AccountService,
    AccountStockService,
} from '@app/modules/repositories/account';
import {
    AccountStockGroupService,
    AccountStockGroupStockDto,
    AccountStockGroupStockService,
} from '@app/modules/repositories/account-stock-group';
import {
    FavoriteStockDto,
    FavoriteStockService,
    FavoriteType,
} from '@app/modules/repositories/favorite-stock';
import { KeywordService, KeywordType } from '@app/modules/repositories/keyword';
import { KoreaInvestmentAccountCrawlerType } from './korea-investment-account-crawler.types';

type StockInfo = { stockName: string; stockCode: string };

@Injectable()
export class KoreaInvestmentAccountProcessor {
    private readonly logger = new Logger(KoreaInvestmentAccountProcessor.name);

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly accountService: AccountService,
        private readonly accountStockService: AccountStockService,
        private readonly accountStockGroupService: AccountStockGroupService,
        private readonly accountStockGroupStockService: AccountStockGroupStockService,
        private readonly favoriteStockService: FavoriteStockService,
        private readonly keywordService: KeywordService,
        @Inject(KoreaInvestmentAccountCrawlerType.RequestAccountStocksByGroup)
        private readonly requestAccountStocksByGroupFlow: FlowProducer,
    ) {}

    /**
     * 계좌 정보를 업데이트 합니다.
     * @param job
     */
    @OnQueueProcessor(KoreaInvestmentAccountCrawlerType.RequestAccount)
    async processRequestAccount(job: Job) {
        const childrenResponses =
            await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                KoreaInvestmentAccountParam,
                unknown[],
                KoreaInvestmentAccountOutput2
            >(job);

        const transformer = new AccountTransformer();

        const transformedAccountInfos = childrenResponses.map(
            ({ request: { params }, response }) => {
                return {
                    accountId: this.buildAccountNumber(
                        params.CANO,
                        params.ACNT_PRDT_CD,
                    ),
                    accountInfo: transformer.transform({
                        output: response.output2,
                    }),
                };
            },
        );

        await Promise.all(
            transformedAccountInfos.map(({ accountId, accountInfo }) =>
                this.accountService.updateAccount(accountId, accountInfo),
            ),
        );
    }

    /**
     * 계좌별 보유 종목 목록을 업데이트 합니다.
     * @param job
     */
    @OnQueueProcessor(KoreaInvestmentAccountCrawlerType.RequestAccountStocks)
    async processRequestAccountStock(job: Job) {
        const childrenResponses =
            await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                KoreaInvestmentAccountStockParam,
                KoreaInvestmentAccountStockOutput[],
                unknown
            >(job);

        const transformer = new AccountStockTransformer();

        for (const {
            request,
            response: { output1 },
        } of childrenResponses) {
            const { CANO, ACNT_PRDT_CD } = request.params;
            const accountId = this.buildAccountNumber(CANO, ACNT_PRDT_CD);

            const transformedStocks = output1.map((output) =>
                transformer.transform({
                    accountId,
                    output,
                }),
            );
            const favoriteStockDtoList = transformedStocks
                .map(({ stockCode, stockName }) => ({
                    stockCode,
                    stockName,
                }))
                .filter(
                    ({ stockName }) => !isDelistedStockByName(stockName),
                ) as FavoriteStockDto[];

            await Promise.all([
                this.accountStockService.upsert(transformedStocks),
                this.favoriteStockService.upsert(favoriteStockDtoList),
                this.updateStockKeywords(
                    KeywordType.Possess,
                    favoriteStockDtoList,
                ),
            ]);
        }
    }

    /**
     * 계좌별 관심 종목 그룹 목록을 업데이트 합니다.
     * @param job
     */
    @OnQueueProcessor(
        KoreaInvestmentAccountCrawlerType.RequestAccountStockGroups,
    )
    async processRequestAccountStockGroups(job: Job) {
        try {
            const { userId } = job.data;
            const childrenResponses =
                await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                    KoreaInvestmentInterestGroupListParam,
                    unknown,
                    KoreaInvestmentInterestGroupListOutput[]
                >(job);

            const transformer = new AccountStockGroupTransformer();
            const accountStockGroupDto = childrenResponses.flatMap(
                ({ response }) =>
                    response.output2.map((output) =>
                        transformer.transform({
                            output,
                        }),
                    ),
            );

            await this.accountStockGroupService.truncate();
            await this.accountStockGroupService.upsert(accountStockGroupDto);

            //
            await this.addRequestAccountStocksByGroupFlow(
                userId,
                childrenResponses,
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * 관심 종목 그룹별 종목 리스트를 업데이트 합니다.
     * @param job
     */
    @OnQueueProcessor(
        KoreaInvestmentAccountCrawlerType.RequestAccountStocksByGroup,
    )
    async processRequestAccountStocksByGroup(job: Job) {
        const childrenResponses =
            await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                KoreaInvestmentInterestStockListByGroupParam,
                KoreaInvestmentInterestStockListByGroupOutput,
                KoreaInvestmentInterestStockListByGroupOutput2[]
            >(job);

        for (const { response } of childrenResponses) {
            const { output1, output2 } = response;

            const accountStockItems = output2.filter(
                (output) => !isDelistedStockByName(output.hts_kor_isnm),
            );

            const stockInfoList = accountStockItems.map(
                (output): StockInfo => ({
                    stockName: output.hts_kor_isnm,
                    stockCode: output.jong_code,
                }),
            );

            const favoriteGroupNames = ['키워드'];
            const groupName = output1.inter_grp_name;
            if (
                favoriteGroupNames.some((keyword) =>
                    groupName.includes(keyword),
                )
            ) {
                await this.favoriteStockService.upsert(
                    stockInfoList.map(({ stockCode, stockName }) => ({
                        type: FavoriteType.StockGroup,
                        stockCode,
                        stockName,
                    })),
                );

                await this.updateStockKeywords(
                    KeywordType.StockGroup,
                    stockInfoList,
                );

                continue;
            }

            const accountStockGroup =
                await this.accountStockGroupService.findOneByName(groupName);
            if (!accountStockGroup) {
                continue;
            }

            await this.accountStockGroupStockService.create(
                stockInfoList.map(
                    ({ stockCode, stockName }): AccountStockGroupStockDto => {
                        return {
                            groupCode: accountStockGroup.code,
                            stockCode,
                            stockName,
                        };
                    },
                ),
            );
        }
    }

    /**
     * @param caNo
     * @param prdtCd
     * @private
     */
    private buildAccountNumber(caNo: string, prdtCd: string): string {
        return [caNo, prdtCd].join('-');
    }

    /**
     * 키워드 설정을 업데이트합니다.
     * @param keywordType
     * @param stockInfoList
     * @private
     */
    private async updateStockKeywords(
        keywordType: KeywordType,
        stockInfoList: StockInfo[],
    ) {
        const keywords = stockInfoList.map(({ stockName }) => stockName);
        const addedKeywords =
            await this.keywordService.getKeywords(keywordType);

        // 키워드 동기화
        await this.syncKeywordsByType(
            keywordType,
            keywords,
            addedKeywords.map(({ name }) => name),
        );
    }

    /**
     * 키워드 차이를 구합니다.
     * @param keywords
     * @param addedKeywords
     * @private
     */
    private diffKeywords(keywords: string[], addedKeywords: string[]) {
        const removedKeywords = difference(addedKeywords, keywords);
        const newKeywords = difference(keywords, addedKeywords);

        return { removedKeywords, newKeywords };
    }

    /**
     * 키워드를 동기화합니다.
     * @param keywordType
     * @param keywords
     * @param addedKeywords
     * @private
     */
    private async syncKeywordsByType(
        keywordType: KeywordType,
        keywords: string[],
        addedKeywords: string[],
    ) {
        const { removedKeywords, newKeywords } = this.diffKeywords(
            keywords,
            addedKeywords,
        );

        await Promise.all(
            removedKeywords.map((keyword) =>
                this.keywordService.deleteKeywordByName({
                    type: keywordType,
                    name: keyword,
                    keywordGroupId: null,
                }),
            ),
        );

        await Promise.all(
            newKeywords.map((keyword) =>
                this.keywordService.createKeyword({
                    type: keywordType,
                    name: keyword,
                    keywordGroupId: null,
                }),
            ),
        );
    }

    /**
     * @param userId
     * @param childrenResponses
     * @private
     */
    private async addRequestAccountStocksByGroupFlow(
        userId: string,
        childrenResponses: KoreaInvestmentCallApiMultiResult<
            KoreaInvestmentInterestGroupListParam,
            unknown,
            KoreaInvestmentInterestGroupListOutput[]
        >[],
    ) {
        const queueName =
            KoreaInvestmentAccountCrawlerType.RequestAccountStocksByGroup;
        const jobFlows = childrenResponses.flatMap(({ response }) =>
            response.output2.map((output) => ({
                name: queueName,
                queueName,
                data: { userId },
                children: [
                    this.koreaInvestmentRequestApiHelper.generateInterestStockListByGroup(
                        {
                            TYPE: '1',
                            USER_ID: userId,
                            INTER_GRP_CODE: output.inter_grp_code,
                            INTER_GRP_NAME: '',
                            DATA_RANK: '',
                            HTS_KOR_ISNM: '',
                            CNTG_CLS_CODE: '',
                            FID_ETC_CLS_CODE: '4',
                        },
                    ),
                ],
            })),
        );

        const queuesOptions = {
            [KoreaInvestmentAccountCrawlerType.RequestAccountStocksByGroup]: {
                defaultJobOptions: getDefaultJobOptions(),
            },
            [KoreaInvestmentRequestApiType.Main]: {
                defaultJobOptions: getDefaultJobOptions(),
            },
        };

        await Promise.all(
            jobFlows.map((jobFlow) =>
                this.requestAccountStocksByGroupFlow.add(jobFlow, {
                    queuesOptions,
                }),
            ),
        );
    }
}
