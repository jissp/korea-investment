import { Pipe } from '@common/types';
import { DomesticStockInvestorTrendEstimateOutput2 } from '@modules/korea-investment/korea-investment-quotation-client';
import { Stock } from '@app/modules/repositories/stock';
import { StockInvestorByEstimateDto } from '@app/controllers';

interface TransformerParams {
    stock: Stock;
    output: DomesticStockInvestorTrendEstimateOutput2;
}

export class StockInvestorByEstimateTransformer implements Pipe<
    TransformerParams,
    StockInvestorByEstimateDto
> {
    transform({
        stock,
        output,
    }: TransformerParams): StockInvestorByEstimateDto {
        return {
            time: output.bsop_hour_gb,
            stockCode: stock.shortCode,
            stockName: stock.name,
            person: Number(output.frgn_fake_ntby_qty),
            organization: Number(output.orgn_fake_ntby_qty),
            sum: Number(output.sum_fake_ntby_qty),
        };
    }
}
