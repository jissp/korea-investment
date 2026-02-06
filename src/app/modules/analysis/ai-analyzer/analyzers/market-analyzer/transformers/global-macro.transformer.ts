import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { formatTemplate } from '@app/common/domains';
import { GLOBAL_MACRO_PROMPT_TEMPLATE } from '../prompts';

type TransformerArgs = {
    assets: string[];
};

@Injectable()
export class GlobalMacroTransformer implements Pipe<TransformerArgs, string> {
    transform({ assets }: TransformerArgs): string {
        const assetListPrompt = this.buildAssetPrompt(assets);

        return formatTemplate(GLOBAL_MACRO_PROMPT_TEMPLATE, {
            currentDate: new Date().toISOString(),
            assetListPrompt,
        });
    }

    /**
     * @param assets
     * @private
     */
    private buildAssetPrompt(assets: string[]) {
        const prompts = assets.map((name, index) => {
            return formatTemplate('{index}. {name}', {
                index: index + 1,
                name,
            });
        });

        return prompts.join('\n');
    }
}
