import { Pipe } from '@common/types';
import { getStockName } from '@common/domains';
import { DomesticIndexItem } from '@app/modules/repositories';
import { KoreaInvestmentDomesticInquireIndexDailyPriceOutput } from '../korea-investment-index-crawler.interface';

type TransformerType = {
    code: string;
    output: KoreaInvestmentDomesticInquireIndexDailyPriceOutput;
};

export class DomesticIndexTransformer implements Pipe<
    TransformerType,
    DomesticIndexItem
> {
    transform({ code, output }: TransformerType): DomesticIndexItem {
        return {
            code,
            name: getStockName(code),
            price: Number(output.bstp_nmix_prpr),
            change: Number(output.bstp_nmix_prdy_vrss),
            changeRate: Number(output.bstp_nmix_prdy_ctrt),
        };
    }
}
