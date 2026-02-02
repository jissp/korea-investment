import { Pipe } from '@common/types';
import { DomesticStockQuotationsIntstockMultPriceOutput } from '@modules/korea-investment/korea-investment-quotation-client';
import { MostViewedStockDto } from '@app/modules/repositories/most-viewed-stock';
import { HtsTopView } from '../../../modules/crawlers/stock-rank-crawler/stock-rank-crawler.types';

interface MostViewedStockTransformerParams {
    stock: HtsTopView;
    output: DomesticStockQuotationsIntstockMultPriceOutput;
}

export class MostViewedStockTransformer implements Pipe<
    MostViewedStockTransformerParams,
    MostViewedStockDto
> {
    transform({
        stock,
        output,
    }: MostViewedStockTransformerParams): MostViewedStockDto {
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
