import { Pipe } from '@common/types';
import { OverseasQuotationInquireDailyChartPriceOutput2 } from '@modules/korea-investment/common';
import { MarketType } from '@app/common/types';
import { getMarketName } from '@app/common/domains';
import { MarketIndexDto } from '@app/modules/repositories/market-index';

interface TransformerArgs {
    code: string;
    date: string;
    output2: OverseasQuotationInquireDailyChartPriceOutput2;
}

export class OverseasDailyIndexTransformer implements Pipe<
    TransformerArgs,
    MarketIndexDto
> {
    transform({ code, date, output2 }: TransformerArgs): MarketIndexDto {
        return {
            marketType: MarketType.Overseas,
            date,
            code,
            name: getMarketName(code),
            value: Number(output2.ovrs_nmix_prpr),
            changeValue: 0,
            changeValueRate: 0,
        };
    }
}
