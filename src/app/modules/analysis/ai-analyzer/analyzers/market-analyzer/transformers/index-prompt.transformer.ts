import { groupBy, keyBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { DOMESTIC_INDEX_CODES, OVERSEAS_INDEX_CODES } from '@app/common/types';
import { formatTemplate } from '@app/common/domains';
import { MarketIndex } from '@app/modules/repositories/market-index';
import { INDEX_PROMPT_TEMPLATE } from '../prompts';

type TransformerArgs = {
    marketIndices: MarketIndex[];
};

const indexMap = keyBy(
    [...DOMESTIC_INDEX_CODES, ...OVERSEAS_INDEX_CODES],
    'code',
);

@Injectable()
export class IndexPromptTransformer implements Pipe<TransformerArgs, string> {
    /**
     * @param marketIndices
     */
    transform({ marketIndices }: TransformerArgs): string {
        const currentDate = new Date();
        const marketIndicesPrompt =
            this.transformPromptByMarketIndices(marketIndices);

        return formatTemplate(INDEX_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            marketIndicesPrompt,
        });
    }

    transformPromptByMarketIndices(marketIndices: MarketIndex[]): string {
        const groupedMarketIndices = groupBy(marketIndices, 'code');

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
