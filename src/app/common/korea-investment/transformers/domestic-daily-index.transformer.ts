import { Pipe } from '@common/types';
import { KoreaInvestmentDomesticInquireIndexDailyPriceOutput2 } from '@modules/korea-investment/common';
import { MarketType } from '@app/common/types';
import { getMarketName } from '@app/common/domains';
import { MarketIndexDto } from '@app/modules/repositories/market-index';

interface TransformerArgs {
    code: string;
    date: string;
    output2: KoreaInvestmentDomesticInquireIndexDailyPriceOutput2;
}

export class DomesticDailyIndexTransformer implements Pipe<
    TransformerArgs,
    MarketIndexDto
> {
    transform({ code, date, output2 }: TransformerArgs): MarketIndexDto {
        return {
            marketType: MarketType.Domestic,
            date,
            code,
            name: getMarketName(code),
            value: Number(output2.bstp_nmix_prpr),
            changeValue: Number(output2.bstp_nmix_prdy_vrss),
            changeValueRate: Number(output2.bstp_nmix_prdy_ctrt),
        };
    }
}
