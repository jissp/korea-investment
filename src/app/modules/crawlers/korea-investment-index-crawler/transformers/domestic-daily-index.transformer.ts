import { Pipe } from '@common/types';
import { getStockName } from '@common/domains';
import { DomesticDailyIndexItem } from '@app/modules/repositories';
import { KoreaInvestmentDomesticInquireIndexDailyPriceOutput2 } from '../korea-investment-index-crawler.interface';

type TransformerType = {
    code: string;
    date: string;
    output2: KoreaInvestmentDomesticInquireIndexDailyPriceOutput2;
};

export class DomesticDailyIndexTransformer implements Pipe<
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
            price: Number(output2.bstp_nmix_prpr),
            change: Number(output2.bstp_nmix_prdy_vrss),
            changeRate: Number(output2.bstp_nmix_prdy_ctrt),
        };
    }
}
