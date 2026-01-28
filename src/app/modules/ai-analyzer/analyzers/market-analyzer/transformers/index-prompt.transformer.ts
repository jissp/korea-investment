import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { DOMESTIC_INDEX_CODES, OVERSEAS_INDEX_CODES } from '@app/common';
import { MarketIndex } from '@app/modules/repositories/market-index';

type PromptArgs = {
    marketIndices: MarketIndex[];
};

const PROMPT = (marketIndicesPrompt: string) => {
    const currentDate = new Date();

    return `
당신은 거시경제 지표와 미세한 뉴스 텍스트 사이의 상관관계를 분석하여 알파(Alpha) 수익을 찾아내는 전문 퀀트 분석가이자 시장 전략가입니다.

제공한 시장 지수를 분석하고, 현재 시점(${currentDate.toISOString()})을 기준으로 국내외 금융 시장의 최신 핵심 동인(Driver)을 분석하십시오.

# 제공 데이터
${marketIndicesPrompt}

# 분석 지침

1. 실시간 데이터 통합: Google 검색을 통해 최근 시장 지수 변동 흐름과 관련있는 현재 국내외 시장의 주요 이슈를 확인하세요.
- 매크로 정책(관세, 금리, 환율 등)
- 국내 상법 개정 및 밸류업 정책
- 정상회담 또는 대통령 발언
- 지정학적 / 지경학적 리스크 (전쟁, 내전 등)
- 그 외 기타 사항

2. 데이터 신뢰도 검증: 반드시 실제 존재하는 최신 데이터인지 재확인하고, 출처가 불분명한 루머는 제외하십시오.

3. 확인한 데이터들을 그대로 응답하세요.
`;
};

const indexMap = _.keyBy(
    [...DOMESTIC_INDEX_CODES, ...OVERSEAS_INDEX_CODES],
    'code',
);

@Injectable()
export class IndexPromptTransformer implements Pipe<PromptArgs, string> {
    /**
     * @param marketIndices
     */
    transform({ marketIndices }: PromptArgs): string {
        const marketIndicesPrompt =
            this.transformPromptByMarketIndices(marketIndices);

        return PROMPT(marketIndicesPrompt);
    }

    transformPromptByMarketIndices(marketIndices: MarketIndex[]): string {
        const groupedMarketIndices = _.groupBy(marketIndices, 'code');

        const transformedPromptByGroup = Object.entries(
            groupedMarketIndices,
        ).reduce(
            (result, [code, marketIndices]) => {
                const codeName = this.toName(code);

                result[codeName] = marketIndices.map((marketIndex) =>
                    this.transformByMarketIndex(marketIndex),
                );

                return result;
            },
            {} as Record<string, string[]>,
        );

        return Object.entries(transformedPromptByGroup)
            .map(
                ([codeName, prompt]) =>
                    `**${codeName}**  \n${prompt.join('\n')}`,
            )
            .join('\n\n');
    }

    transformByMarketIndex({ value, changeValue, date }: MarketIndex) {
        return `- ${date}: 현재 지수: ${value}, 전일 대비: ${changeValue}`;
    }

    toName(code: string) {
        if (!indexMap[code]) {
            return code;
        }

        return indexMap[code].name;
    }
}
