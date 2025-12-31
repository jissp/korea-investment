import { Pipe } from '@common/types';
import { getStockName } from '@common/domains';
import { OverseasGovernmentBondItem } from '@app/modules/repositories';
import { OverseasQuotationInquireDailyChartPriceOutput } from '../korea-investment-index-crawler.interface';

type TransformerType = {
    code: string;
    output: OverseasQuotationInquireDailyChartPriceOutput;
};

export class OverseasGovernmentBondTransformer implements Pipe<
    TransformerType,
    OverseasGovernmentBondItem
> {
    transform({ code, output }: TransformerType): OverseasGovernmentBondItem {
        return {
            code,
            name: getStockName(code),
            price: Number(output.ovrs_nmix_prpr),
            change: Number(output.ovrs_nmix_prdy_vrss),
            changeRate: Number(output.prdy_ctrt),
        };
    }
}
