import { Pipe } from '@common/types';
import { getStockName } from '@common/domains';
import { MarketType } from '@app/common/types';
import { MarketIndexDto } from '@app/modules/repositories/market-index';
import { OverseasQuotationInquireDailyChartPriceOutput2 } from '../korea-investment-index-crawler.interface';

type TransformerType = {
    code: string;
    date: string;
    output2: OverseasQuotationInquireDailyChartPriceOutput2;
};

export class OverseasDailyIndexTransformer implements Pipe<
    TransformerType,
    MarketIndexDto
> {
    transform({ code, date, output2 }: TransformerType): MarketIndexDto {
        return {
            marketType: MarketType.Overseas,
            date,
            code,
            name: getStockName(code),
            value: Number(output2.ovrs_nmix_prpr),
            changeValue: 0,
            changeValueRate: 0,
        };
    }
}
