import { Pipe } from '@common/types';
import { DomesticStockQuotationsIntstockMultPriceOutput } from '@modules/korea-investment/common';
import { MostViewedStockDto } from '@app/modules/repositories/most-viewed-stock';
import { HtsTopView } from '@app/modules/crawlers/stock-rank-crawler';

interface TransformerArgs {
    stock: HtsTopView;
    output: DomesticStockQuotationsIntstockMultPriceOutput;
}

export class MostViewedStockTransformer implements Pipe<
    TransformerArgs,
    MostViewedStockDto
> {
    transform({ stock, output }: TransformerArgs): MostViewedStockDto {
        return {
            exchangeType: stock.exchangeType,
            stockCode: stock.stockCode,
            stockName: output.inter_kor_isnm,
            price: Number(output.inter2_prpr),
            changePrice: Number(output.inter2_prdy_vrss),
            changePriceRate: Number(output.prdy_ctrt),
        };
    }
}
