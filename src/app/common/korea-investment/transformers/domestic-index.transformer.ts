import { Pipe } from '@common/types';
import { toDateYmdByDate } from '@common/utils';
import { KoreaInvestmentDomesticInquireIndexDailyPriceOutput } from '@modules/korea-investment/common';
import { MarketType } from '@app/common/types';
import { getMarketNameDomain } from '@app/common/domains';
import { MarketIndexDto } from '@app/modules/repositories/market-index';

interface TransformerArgs {
    code: string;
    output: KoreaInvestmentDomesticInquireIndexDailyPriceOutput;
}

export class DomesticIndexTransformer implements Pipe<
    TransformerArgs,
    MarketIndexDto
> {
    transform({ code, output }: TransformerArgs): MarketIndexDto {
        return {
            marketType: MarketType.Domestic,
            date: toDateYmdByDate({
                separator: '-',
            }),
            code,
            name: getMarketNameDomain(code),
            value: Number(output.bstp_nmix_prpr),
            changeValue: Number(output.bstp_nmix_prdy_vrss),
            changeValueRate: Number(output.bstp_nmix_prdy_ctrt),
        };
    }
}
