import { Pipe } from '@common/types';
import { getStockName } from '@common/domains';
import { MarketType } from '@app/common/types';
import { KoreaInvestmentDomesticInquireIndexDailyPriceOutput2 } from '@modules/korea-investment/common';
import { MarketIndexDto } from '@app/modules/repositories/market-index';

type TransformerType = {
    code: string;
    date: string;
    output2: KoreaInvestmentDomesticInquireIndexDailyPriceOutput2;
};

export class DomesticDailyIndexTransformer implements Pipe<
    TransformerType,
    MarketIndexDto
> {
    transform({ code, date, output2 }: TransformerType): MarketIndexDto {
        return {
            marketType: MarketType.Domestic,
            date,
            code,
            name: getStockName(code),
            value: Number(output2.bstp_nmix_prpr),
            changeValue: Number(output2.bstp_nmix_prdy_vrss),
            changeValueRate: Number(output2.bstp_nmix_prdy_ctrt),
        };
    }
}
