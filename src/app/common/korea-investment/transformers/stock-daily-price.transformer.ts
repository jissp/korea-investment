import { Pipe } from '@common/types';
import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { DomesticStockInquireDailyPriceOutput } from '@modules/korea-investment/common';
import { StockDailyPriceDto } from '@app/modules/domain/stock/dto/responses/get-stock-daily-prices.response';

interface TransformerArgs {
    output: DomesticStockInquireDailyPriceOutput;
}

export class StockDailyPriceTransformer implements Pipe<
    TransformerArgs,
    StockDailyPriceDto
> {
    transform({ output }: TransformerArgs): StockDailyPriceDto {
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
