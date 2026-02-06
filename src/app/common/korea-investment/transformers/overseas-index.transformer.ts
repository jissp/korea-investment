import { Pipe } from '@common/types';
import { toDateYmdByDate } from '@common/utils';
import { OverseasQuotationInquireDailyChartPriceOutput } from '@modules/korea-investment/common';
import { MarketType } from '@app/common/types';
import { getMarketNameDomain } from '@app/common/domains';
import { MarketIndexDto } from '@app/modules/repositories/market-index';

interface TransformerArgs {
    code: string;
    output: OverseasQuotationInquireDailyChartPriceOutput;
}

export class OverseasIndexTransformer implements Pipe<
    TransformerArgs,
    MarketIndexDto
> {
    transform({ code, output }: TransformerArgs): MarketIndexDto {
        return {
            marketType: MarketType.Overseas,
            date: toDateYmdByDate({
                separator: '-',
            }),
            code,
            name: getMarketNameDomain(code),
            value: Number(output.ovrs_nmix_prpr),
            changeValue: Number(output.ovrs_nmix_prdy_vrss),
            changeValueRate: Number(output.prdy_ctrt),
        };
    }
}
