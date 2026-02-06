import { Dictionary, groupBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { MarketIndex } from '@app/modules/repositories/market-index';
import { formatTemplate } from '@app/common/domains';

type TransformerArgs = {
    name: string;
    marketIndices: MarketIndex[];
};

const PROMPT_TEMPLATE = `당신은 20년동안 국내외 주요 지표를 수집하는 전문 수집꾼입니다.

아래 지침 사항을 반드시 순서대로 처리하면서 주요 지수들의 정보를 확인하세요.

# 필수 항목
- 반드시 현재 시간({currentDate})을 기준으로 최신 데이터를 확인하세요.
- 결과물: 개조식으로 정리하되, **[표면적 이유]**와 **[데이터 기반 이면의 원인]**을 구분하여 명시하세요.

# 주요 지수
{indexListPrompt}

# 지침 사항
1. 주요 지수별 제공 데이터(지표 동향)를 확인하세요.
2. 주요 지수별 최근 핵심 이슈와 뉴스 정보를 확인하세요.
- 매크로 정책(관세, 금리, 환율 등)
- 국내 상법 개정 및 밸류업 정책
- 정상회담 또는 대통령 발언
- 지정학적 / 지경학적 리스크 (전쟁, 내전 등)
- 그 외 기타 사항
3. 2번에서 확인한 데이터가 실존하는 데이터인지, 신뢰할 수 있는 데이터인지 확인하고 루머를 배제한 결과만 응답하세요.

# 제공 데이터
{marketIndicesPrompt}`;

@Injectable()
export class GlobalIndexTransformer implements Pipe<TransformerArgs, string> {
    /**
     * @param name
     * @param marketIndices
     */
    transform({ marketIndices }: TransformerArgs): string {
        const groupedMarketIndices = groupBy(
            marketIndices,
            (marketIndex) => marketIndex.name,
        );
        const indexListPrompt = this.buildIndexPrompt(groupedMarketIndices);

        return formatTemplate(PROMPT_TEMPLATE, {
            currentDate: new Date().toISOString(),
            indexListPrompt,
            marketIndicesPrompt:
                this.transformForMarketIndices(groupedMarketIndices),
        });
    }

    private transformForMarketIndices(
        groupedMarketIndices: Dictionary<MarketIndex[]>,
    ): string {
        const INDEX_TEMPLATE_FOR_ROW = `- **{date}**: 종가 {value}, 변동량: {changeValue} ({changeValueRate}%)`;
        const GROUP_TEMPLATE = '#### {name} \n{groupPrompt}';

        const indexPrompts = Object.entries(groupedMarketIndices).map(
            ([name, marketIndices]) => {
                const groupPrompt = this.formatMarketIndicesGroup(
                    marketIndices,
                    INDEX_TEMPLATE_FOR_ROW,
                );

                return formatTemplate(GROUP_TEMPLATE, { name, groupPrompt });
            },
        );

        return indexPrompts.join('\n');
    }

    private formatMarketIndicesGroup(
        marketIndices: MarketIndex[],
        template: string,
    ): string {
        return marketIndices
            .map((marketIndex) => formatTemplate(template, marketIndex))
            .join('\n');
    }

    /**
     * @private
     * @param groupedMarketIndices
     */
    private buildIndexPrompt(groupedMarketIndices: Dictionary<MarketIndex[]>) {
        const prompts = Object.keys(groupedMarketIndices).map((name, index) => {
            return formatTemplate('{index}. {name}', {
                index: index + 1,
                name,
            });
        });

        return prompts.join('\n');
    }
}
