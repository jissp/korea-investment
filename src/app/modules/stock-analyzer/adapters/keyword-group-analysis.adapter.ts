import * as _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import {
    NaverApiClientFactory,
    NaverApiNewsItem,
    NaverAppName,
} from '@modules/naver/naver-api';
import {
    Keyword,
    KeywordGroup,
    KeywordGroupService,
    KeywordService,
} from '@app/modules/repositories/keyword';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import { AnalyzeKeywordGroupPromptTransformer } from '../transformers';
import { AnalysisCompletedEventBody } from '../stock-analyzer.types';
import { IAnalysisAdapter } from './analysis-adapter.interface';

const DEFAULT_CHUNK_SIZE = 5;

interface KeywordGroupAnalysisData {
    keywordGroup: KeywordGroup;
    keywords: Keyword[];
    naverNewsItems: NaverApiNewsItem[];
}

@Injectable()
export class KeywordGroupAnalysisAdapter implements IAnalysisAdapter<KeywordGroupAnalysisData> {
    private readonly logger = new Logger(KeywordGroupAnalysisAdapter.name);

    constructor(
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly keywordGroupService: KeywordGroupService,
        private readonly keywordService: KeywordService,
    ) {}

    /**
     * 분석에 필요한 데이터를 수집합니다.
     * @param groupId
     */
    async collectData(groupId: string): Promise<KeywordGroupAnalysisData> {
        const keywordGroup = await this.keywordGroupService.getKeywordGroup(
            Number(groupId),
        );
        if (!keywordGroup) {
            const errorMessage = `Keyword group not found: ${groupId}`;

            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        const keywords = await this.keywordService.getKeywordsByGroupId(
            Number(groupId),
        );
        const naverNewsItems = await this.getNaverNewsItems(
            keywords.map(({ name }) => name),
        );

        return {
            keywordGroup,
            keywords,
            naverNewsItems,
        };
    }

    /**
     * 데이터를 프롬프트로 변환합니다.
     * @param data
     */
    transformToPrompt(data: KeywordGroupAnalysisData): string {
        const transformer = new AnalyzeKeywordGroupPromptTransformer();

        return transformer.transform({
            groupName: data.keywordGroup.name,
            naverNewsItems: data.naverNewsItems,
        });
    }

    /**
     * 분석 완료 이벤트 객체를 생성합니다.
     * @param target
     * @param data
     */
    getEventConfig(
        target: string,
        data: KeywordGroupAnalysisData,
    ): AnalysisCompletedEventBody {
        return {
            reportType: ReportType.KeywordGroup,
            reportTarget: target,
            title: `${data.keywordGroup.name} 분석 리포트`,
        };
    }

    /**
     * 네이버 검색 API를 사용하여 뉴스 정보를 가지고 옵니다.
     * @param keywords
     * @private
     */
    private async getNaverNewsItems(
        keywords: string[],
    ): Promise<NaverApiNewsItem[]> {
        const maxPage = keywords.length < 2 ? 1 : 2;
        const arr = Array.from({ length: maxPage }, (_, i) => i + 1);

        const client = this.naverApiClientFactory.create(NaverAppName.SEARCH);

        const keywordChunk = _.chunk(keywords, DEFAULT_CHUNK_SIZE);

        const responses = await Promise.all(
            keywordChunk.flatMap((keywords) =>
                arr.map((page) =>
                    client.getNews({
                        query: keywords.join(' | '),
                        start: page,
                        display: 100,
                        sort: 'date',
                    }),
                ),
            ),
        );

        return responses.flatMap((response) => response.items);
    }
}
