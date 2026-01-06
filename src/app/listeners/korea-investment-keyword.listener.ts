import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
    KeywordType,
    KoreaInvestmentKeywordSettingEvent,
    KoreaInvestmentKeywordSettingService,
} from '@app/modules/korea-investment-setting';
import { NewsRepository } from '@app/modules/repositories/news-repository';
import { RedisHelper } from '@modules/redis';
import { KoreaInvestmentKeywordSettingKey } from '@app/modules/korea-investment-setting/korea-investment-keyword-setting.types';

@Injectable()
export class KoreaInvestmentKeywordListener {
    private readonly logger = new Logger(KoreaInvestmentKeywordListener.name);

    constructor(
        private readonly keywordSettingService: KoreaInvestmentKeywordSettingService,
        private readonly newsRepository: NewsRepository,
        private readonly redisHelper: RedisHelper,
    ) {}

    @OnEvent(KoreaInvestmentKeywordSettingEvent.DeletedKeyword)
    public async handleDeletedKeyword({ keyword }: { keyword: string }) {
        try {
            const stockCodes =
                await this.keywordSettingService.getStockCodesByKeyword(
                    keyword,
                );

            // 키워드 정보 제거
            await Promise.all([
                ...stockCodes.map((stockCode) =>
                    this.keywordSettingService.deleteKeywordFromStock({
                        stockCode: stockCode,
                        keyword: keyword,
                    }),
                ),
                this.newsRepository.deleteKeywordNews(keyword),
            ]);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(KoreaInvestmentKeywordSettingEvent.AddedStockKeyword)
    public async handleAddedStockKeyword({
        stockCode,
        keyword,
    }: {
        stockCode: string;
        keyword: string;
    }) {
        await Promise.all([
            this.keywordSettingService.addKeywordByType(
                KeywordType.Manual,
                keyword,
            ),
            this.keywordSettingService.addStockCodeToKeyword({
                keyword: stockCode,
                stockCode: keyword,
            }),
        ]);
    }

    @OnEvent(KoreaInvestmentKeywordSettingEvent.DeletedStockKeyword)
    public async handleRemovedStockKeyword({
        stockCode,
        keyword,
    }: {
        stockCode: string;
        keyword: string;
    }) {
        await this.keywordSettingService.deleteStockCodeFromKeyword({
            keyword: keyword,
            stockCode: stockCode,
        });

        const count =
            await this.keywordSettingService.getStockCodeCountFromKeyword(
                keyword,
            );
        if (count === 0) {
            // 키워드와 뉴스 제거
            await Promise.all([
                this.keywordSettingService.deleteKeywordByType(
                    KeywordType.Manual,
                    keyword,
                ),
                this.newsRepository.deleteKeywordNews(keyword),
            ]);
        }
    }

    @OnEvent(KoreaInvestmentKeywordSettingEvent.AddedKeywordToGroup)
    public async handleAddedKeywordToGroup({
        groupName,
        keyword,
    }: {
        groupName: string;
        keyword: string;
    }) {
        await this.getKeywordGroupsByKeywordSet(keyword).add(groupName);
    }

    @OnEvent(KoreaInvestmentKeywordSettingEvent.DeletedKeywordFromGroup)
    public async handleDeletedKeywordFromGroup({
        groupName,
        keyword,
    }: {
        groupName: string;
        keyword: string;
    }) {
        await this.getKeywordGroupsByKeywordSet(keyword).remove(groupName);
    }

    @OnEvent(KoreaInvestmentKeywordSettingEvent.DeletedKeywordGroup)
    public async handleDeletedKeywordGroup({
        groupName,
        keywords,
    }: {
        groupName: string;
        keywords: string[];
    }) {
        await Promise.all(
            keywords.map((keyword) =>
                this.getKeywordGroupsByKeywordSet(keyword).remove(groupName),
            ),
        );
    }

    /**
     * 키워드가 속해있는 키워드 그룹 목록 Set을 반환합니다.
     * @param keyword
     * @private
     */
    private getKeywordGroupsByKeywordSet(keyword: string) {
        return this.redisHelper.createSet(
            KoreaInvestmentKeywordSettingKey.KeywordGroupsByKeyword,
            keyword,
        );
    }
}
