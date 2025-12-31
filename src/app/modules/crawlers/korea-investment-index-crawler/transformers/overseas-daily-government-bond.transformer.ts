import { Pipe } from '@common/types';
import { getStockName } from '@common/domains';
import { OverseasDailyGovernmentBondItem } from '@app/modules/repositories';
import { OverseasQuotationInquireDailyChartPriceOutput2 } from '../korea-investment-index-crawler.interface';

type TransformerType = {
    code: string;
    date: string;
    output2: OverseasQuotationInquireDailyChartPriceOutput2;
};

export class OverseasDailyGovernmentBondTransformer implements Pipe<
    TransformerType,
    OverseasDailyGovernmentBondItem
> {
    transform({
        code,
        date,
        output2,
    }: TransformerType): OverseasDailyGovernmentBondItem {
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
