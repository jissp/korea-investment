import { Dictionary, groupBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { MarketIndex } from '@app/modules/repositories/market-index';
import { formatTemplate } from '@app/common/domains';
import { GLOBAL_INDEX_PROMPT_TEMPLATE } from '../prompts';

type TransformerArgs = {
    name: string;
    marketIndices: MarketIndex[];
};

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

        return formatTemplate(GLOBAL_INDEX_PROMPT_TEMPLATE, {
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
