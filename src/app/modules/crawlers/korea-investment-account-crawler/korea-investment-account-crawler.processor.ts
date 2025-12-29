import * as _ from 'lodash';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnQueueProcessor } from '@modules/queue';
import { BaseMultiResponse } from '@modules/korea-investment/common';
import { isDelistedStockByName } from '@app/common';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingEvent,
    KoreaInvestmentKeywordSettingService,
    KoreaInvestmentSettingService,
} from '@app/modules/korea-investment-setting';
import { KoreaInvestmentAccountService } from '@app/modules/korea-investment-account';
import {
    KoreaInvestmentAccountOutput,
    KoreaInvestmentAccountOutput2,
    KoreaInvestmentAccountParam,
    KoreaInvestmentAccountStockOutput,
    KoreaInvestmentAccountStockOutput2,
    KoreaInvestmentAccountStockParam,
    KoreaInvestmentInterestGroupListOutput,
    KoreaInvestmentInterestGroupListParam,
    KoreaInvestmentInterestStockListByGroupOutput,
    KoreaInvestmentInterestStockListByGroupOutput2,
    KoreaInvestmentInterestStockListByGroupParam,
    KoreaInvestmentRequestApiHelper,
} from '@app/modules/korea-investment-request-api';
import {
    KoreaInvestmentAccountCrawlerEventType,
    KoreaInvestmentAccountCrawlerType,
} from './korea-investment-account-crawler.types';

@Injectable()
export class KoreaInvestmentAccountCrawlerProcessor {
    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly koreaInvestmentAccountService: KoreaInvestmentAccountService,
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
                KoreaInvestmentAccountOutput[],
                KoreaInvestmentAccountOutput2
            >(job);

        await Promise.all(
            childrenResponses.map(({ request: { params }, response }) =>
                this.koreaInvestmentAccountService.setAccountInfo(
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
                KoreaInvestmentAccountStockOutput2[]
            >(job);

        for (const {
            request: { params },
            response,
        } of childrenResponses) {
            await this.koreaInvestmentAccountService.setAccountStocks(
                this.buildAccountNumber(params.CANO, params.ACNT_PRDT_CD),
                response.output1,
            );

            // 보유 종목 키워드 업데이트
            await this.updatePossessKeywordByResponse(response);
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
                null,
                KoreaInvestmentInterestGroupListOutput[]
            >(job);

        for (const { response } of childrenResponses) {
            await this.koreaInvestmentAccountService.setAccountStockGroups(
                userId,
                response.output2,
            );

            response.output2.forEach((output) => {
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

        let isUpdatedKeyword: boolean = false;
        for (const {
            request: { params },
            response,
        } of childrenResponses) {
            const groupName = response.output1.inter_grp_name;

            await this.koreaInvestmentAccountService.setAccountStocksByGroup(
                response.output1.inter_grp_name,
                response.output2,
            );

            if (groupName.includes('키워드')) {
                await this.updateStockGroupKeywordByResponse(response);
                isUpdatedKeyword = true;
            }
        }

        if (isUpdatedKeyword) {
            this.eventEmitter.emit(
                KoreaInvestmentKeywordSettingEvent.UpdatedKeyword,
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
     * 보유 종목 키워드 업데이트
     * @param response
     * @private
     */
    private async updatePossessKeywordByResponse(
        response: BaseMultiResponse<
            KoreaInvestmentAccountStockOutput[],
            KoreaInvestmentAccountStockOutput2[]
        >,
    ): Promise<void> {
        const stockInfoList = response.output1
            .map((output) => ({
                name: output.prdt_name,
                code: output.pdno,
            }))
            .filter((stockInfo) => !isDelistedStockByName(stockInfo.name));

        const possessKeywords = stockInfoList.map(
            (stockInfo) => stockInfo.name,
        );
        const addedPossessKeywords =
            await this.keywordSettingService.getKeywordsByType(
                KeywordType.Possess,
            );

        const newPossessKeywords = _.difference(
            possessKeywords,
            addedPossessKeywords,
        );
        const removedPossessKeywords = _.difference(
            addedPossessKeywords,
            possessKeywords,
        );

        await Promise.all([
            ...newPossessKeywords.map((keyword) =>
                this.keywordSettingService.addKeywordsByType(
                    KeywordType.Possess,
                    keyword,
                ),
            ),
            ...removedPossessKeywords.map((keyword) =>
                this.keywordSettingService.deleteKeywordsByType(
                    KeywordType.Possess,
                    keyword,
                ),
            ),
            ...stockInfoList.map(({ name, code }) =>
                this.settingService.addStockCode(code),
            ),
        ]);

        this.eventEmitter.emit(
            KoreaInvestmentKeywordSettingEvent.UpdatedKeyword,
        );
    }

    /**
     * 키워드 알람 그룹 키워드 업데이트
     * @param response
     * @private
     */
    private async updateStockGroupKeywordByResponse(
        response: BaseMultiResponse<
            KoreaInvestmentInterestStockListByGroupOutput,
            KoreaInvestmentInterestStockListByGroupOutput2[]
        >,
    ): Promise<void> {
        const stockInfo = response.output2.map((output) => ({
            name: output.hts_kor_isnm,
            code: output.jong_code,
        }));
        const keywords = stockInfo.map((stockInfo) => stockInfo.name);
        const addedKeywords =
            await this.keywordSettingService.getKeywordsByType(
                KeywordType.StockGroup,
            );

        const newKeywords = _.difference(keywords, addedKeywords);
        const removedPossessKeywords = _.difference(addedKeywords, keywords);

        await Promise.all([
            ...newKeywords.map((keyword) =>
                this.keywordSettingService.addKeywordsByType(
                    KeywordType.StockGroup,
                    keyword,
                ),
            ),
            ...removedPossessKeywords.map((keyword) =>
                this.keywordSettingService.deleteKeywordsByType(
                    KeywordType.StockGroup,
                    keyword,
                ),
            ),
            ...stockInfo.map(({ name, code }) =>
                this.keywordSettingService.addStockCodeToKeyword(name, code),
            ),
            ...stockInfo.map(({ name, code }) =>
                this.keywordSettingService.addKeywordToStock(code, name),
            ),
        ]);
    }
}
