import { Pipe } from '@common/types';
import { toDateYmdByDate } from '@common/utils';
import { getStockName } from '@common/domains';
import { MarketType } from '@app/common/types';
import { MarketIndexDto } from '@app/modules/repositories/market-index';
import { KoreaInvestmentDomesticInquireIndexDailyPriceOutput } from '../../../modules/crawlers/korea-investment-crawler/korea-investment-index-crawler/korea-investment-index-crawler.interface';

type TransformerType = {
    code: string;
    output: KoreaInvestmentDomesticInquireIndexDailyPriceOutput;
};

export class DomesticIndexTransformer implements Pipe<
    TransformerType,
    MarketIndexDto
> {
    transform({ code, output }: TransformerType): MarketIndexDto {
        return {
            marketType: MarketType.Domestic,
            date: toDateYmdByDate({
                separator: '-',
            }),
            code,
            name: getStockName(code),
            value: Number(output.bstp_nmix_prpr),
            changeValue: Number(output.bstp_nmix_prdy_vrss),
            changeValueRate: Number(output.bstp_nmix_prdy_ctrt),
        };
    }
}
