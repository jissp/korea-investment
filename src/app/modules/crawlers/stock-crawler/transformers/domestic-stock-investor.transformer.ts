import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { DomesticStockQuotationsInquireInvestorOutput } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockDailyInvestorDto } from '@app/modules/repositories/stock-daily-investor';
import { getStockName } from '@common/domains';
import { MarketType } from '@app/common/types';

interface TransformParams {
    stockCode: string;
    output: DomesticStockQuotationsInquireInvestorOutput;
}
export class DomesticStockInvestorTransformer {
    transform({ stockCode, output }: TransformParams): StockDailyInvestorDto {
        return {
            marketType: MarketType.Domestic,
            date: toDateByKoreaInvestmentYmd(output.stck_bsop_date),
            stockCode,
            stockName: getStockName(stockCode),
            price: Number(output.stck_clpr),
            person: Number(output.prsn_ntby_qty),
            foreigner: Number(output.frgn_ntby_qty),
            organization: Number(output.orgn_ntby_qty),
        };
    }
}
