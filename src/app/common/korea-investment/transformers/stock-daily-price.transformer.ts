import { Pipe } from '@common/types';
import { DomesticStockInquireDailyPriceOutput } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockDailyPriceDto } from '@app/controllers/stocks/dto/responses/get-stock-daily-prices.response';
import { toDateByKoreaInvestmentYmd } from '@common/utils';

export class StockDailyPriceTransformer implements Pipe<
    DomesticStockInquireDailyPriceOutput,
    StockDailyPriceDto
> {
    transform(
        output: DomesticStockInquireDailyPriceOutput,
    ): StockDailyPriceDto {
        return {
            date: toDateByKoreaInvestmentYmd(output.stck_bsop_date),
            startPrice: Number(output.stck_oprc),
            closePrice: Number(output.stck_clpr),
            lowPrice: Number(output.stck_lwpr),
            highPrice: Number(output.stck_hgpr),
            changePrice: Number(output.prdy_vrss),
            changePriceRate: Number(output.prdy_ctrt),
            foreigner: Number(output.frgn_ntby_qty),
        };
    }
}
