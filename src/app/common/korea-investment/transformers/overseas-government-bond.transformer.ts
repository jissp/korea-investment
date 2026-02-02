import { Pipe } from '@common/types';
import { toDateYmdByDate } from '@common/utils';
import { getStockName } from '@common/domains';
import { MarketType } from '@app/common/types';
import { MarketIndexDto } from '@app/modules/repositories/market-index';
import { OverseasQuotationInquireDailyChartPriceOutput } from '../../../modules/crawlers/korea-investment-crawler/korea-investment-index-crawler/korea-investment-index-crawler.interface';

type TransformerType = {
    code: string;
    output: OverseasQuotationInquireDailyChartPriceOutput;
};

export class OverseasGovernmentBondTransformer implements Pipe<
    TransformerType,
    MarketIndexDto
> {
    transform({ code, output }: TransformerType): MarketIndexDto {
        return {
            marketType: MarketType.Overseas,
            date: toDateYmdByDate({
                separator: '-',
            }),
            code,
            name: getStockName(code),
            value: Number(output.ovrs_nmix_prpr),
            changeValue: Number(output.ovrs_nmix_prdy_vrss),
            changeValueRate: Number(output.prdy_ctrt),
        };
    }
}
