import * as _ from 'lodash';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnQueueProcessor } from '@modules/queue';
import { isDelistedStockByName, toKeywordType } from '@app/common';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingService,
    KoreaInvestmentSettingService,
    StockCodeType,
} from '@app/modules/korea-investment-setting';
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
    KoreaInvestmentRequestApiHelper,
} from '@app/modules/korea-investment-request-api';
import { AccountRepository } from '@app/modules/repositories';
import {
    KoreaInvestmentAccountCrawlerEventType,
    KoreaInvestmentAccountCrawlerType,
} from './korea-investment-account-crawler.types';

type StockInfo = { name: string; stockCode: string };

@Injectable()
export class KoreaInvestmentAccountCrawlerProcessor {
    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly accountRepository: AccountRepository,
        private readonly settingService: KoreaInvestmentSettingService,
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly eventEmitter: EventEmitter2,
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

        await Promise.all(
            childrenResponses.map(({ request: { params }, response }) =>
                this.accountRepository.setAccountInfo(
                    this.buildAccountNumber(params.CANO, params.ACNT_PRDT_CD),
                    response.output2,
                ),
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

        for (const {
            request,
            response: { output1 },
        } of childrenResponses) {
            const { CANO, ACNT_PRDT_CD } = request.params;

            const accountStockItems = output1.filter(
                (output) => !isDelistedStockByName(output.prdt_name),
            );

            await this.accountRepository.setAccountStocks(
                this.buildAccountNumber(CANO, ACNT_PRDT_CD),
                accountStockItems,
            );

            const stockInfoList = accountStockItems.map(
                (output): StockInfo => ({
                    name: output.prdt_name,
                    stockCode: output.pdno,
                }),
            );

            await this.updateStockKeywords(
                StockCodeType.Possess,
                stockInfoList,
            );

            await Promise.all(
                stockInfoList.map(({ stockCode }) =>
                    this.settingService.addStockCodeByType(
                        StockCodeType.Possess,
                        stockCode,
                    ),
                ),
            );
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
        const { userId } = job.data;
        const childrenResponses =
            await this.koreaInvestmentRequestApiHelper.getChildMultiResponses<
                KoreaInvestmentInterestGroupListParam,
                unknown,
                KoreaInvestmentInterestGroupListOutput[]
            >(job);

        for (const {
            response: { output2 },
        } of childrenResponses) {
            await this.accountRepository.setAccountStockGroups(userId, output2);

            output2.forEach((output) => {
                this.eventEmitter.emit(
                    KoreaInvestmentAccountCrawlerEventType.UpdatedStockGroup,
                    { userId, output },
                );
            });
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
            const groupName = output1.inter_grp_name;

            await this.accountRepository.setAccountStocksByGroup(
                groupName,
                output2,
            );

            if (!groupName.includes('키워드')) {
                continue;
            }

            const accountStockItems = output2.filter(
                (output) => !isDelistedStockByName(output.hts_kor_isnm),
            );

            const stockInfoList = accountStockItems.map(
                (output): StockInfo => ({
                    name: output.hts_kor_isnm,
                    stockCode: output.jong_code,
                }),
            );
            await Promise.all(
                stockInfoList.map(({ stockCode }) =>
                    this.settingService.addStockCodeByType(
                        StockCodeType.StockGroup,
                        stockCode,
                    ),
                ),
            );
            await this.updateStockKeywords(
                StockCodeType.StockGroup,
                stockInfoList,
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
     * @param stockCodeType
     * @param stockInfoList
     * @private
     */
    private async updateStockKeywords(
        stockCodeType: StockCodeType,
        stockInfoList: StockInfo[],
    ) {
        const keywords = stockInfoList.map(({ name }) => name);
        const addedKeywords =
            await this.keywordSettingService.getKeywordsByType(
                KeywordType.StockGroup,
            );

        // 키워드 동기화
        await this.syncKeywordsByType(
            toKeywordType(stockCodeType),
            keywords,
            addedKeywords,
        );

        // 종목별 키워드 추가
        return Promise.all(
            stockInfoList.map(({ name, stockCode }) =>
                this.keywordSettingService.addKeywordWithStockCodeMap({
                    keyword: name,
                    stockCode,
                }),
            ),
        );
    }

    /**
     * 키워드 차이를 구합니다.
     * @param keywords
     * @param addedKeywords
     * @private
     */
    private diffKeywords(keywords: string[], addedKeywords: string[]) {
        const removedKeywords = _.difference(addedKeywords, keywords);
        const newKeywords = _.difference(keywords, addedKeywords);

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

        await this.keywordSettingService.deleteKeywordByType(
            keywordType,
            ...removedKeywords,
        );
        await this.keywordSettingService.addKeywordByType(
            keywordType,
            ...newKeywords,
        );
    }
}
