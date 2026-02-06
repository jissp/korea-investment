import { Pipe } from '@common/types';
import { DomesticStockQuotationsIntstockMultPriceOutput } from '@modules/korea-investment/common';
import { StockPriceDto } from '@app/controllers/stocks/dto/responses/get-stock-prices.response';

interface TransformerArgs {
    output: DomesticStockQuotationsIntstockMultPriceOutput;
}

export class StockPriceTransformer implements Pipe<
    TransformerArgs,
    StockPriceDto
> {
    transform({ output }: TransformerArgs): StockPriceDto {
        return {
            stockCode: output.inter_shrn_iscd,
            stockName: output.inter_kor_isnm,
            price: Number(output.inter2_prpr),
            changePrice: Number(output.inter2_prdy_vrss),
            changePriceRate: Number(output.prdy_ctrt),
        };
    }
}
