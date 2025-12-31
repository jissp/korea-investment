import { Pipe } from '@common/types';
import { getStockName } from '@common/domains';
import { DomesticDailyIndexItem } from '@app/modules/repositories';
import { OverseasQuotationInquireDailyChartPriceOutput2 } from '../korea-investment-index-crawler.interface';

type TransformerType = {
    code: string;
    date: string;
    output2: OverseasQuotationInquireDailyChartPriceOutput2;
};

export class OverseasDailyIndexTransformer implements Pipe<
    TransformerType,
    DomesticDailyIndexItem
> {
    transform({
        code,
        date,
        output2,
    }: TransformerType): DomesticDailyIndexItem {
        return {
            date,
            code,
            name: getStockName(code),
            price: Number(output2.ovrs_nmix_prpr),
            change: 0,
            changeRate: 0,
        };
    }
}
