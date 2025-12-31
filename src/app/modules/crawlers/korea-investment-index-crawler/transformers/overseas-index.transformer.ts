import { Pipe } from '@common/types';
import { getStockName } from '@common/domains';
import { OverseasIndexItem } from '@app/modules/repositories';
import { OverseasQuotationInquireDailyChartPriceOutput } from '../korea-investment-index-crawler.interface';

type TransformerType = {
    code: string;
    output: OverseasQuotationInquireDailyChartPriceOutput;
};

export class OverseasIndexTransformer implements Pipe<
    TransformerType,
    OverseasIndexItem
> {
    transform({ code, output }: TransformerType): OverseasIndexItem {
        return {
            code,
            name: getStockName(code),
            price: Number(output.ovrs_nmix_prpr),
            change: Number(output.ovrs_nmix_prdy_vrss),
            changeRate: Number(output.prdy_ctrt),
        };
    }
}
