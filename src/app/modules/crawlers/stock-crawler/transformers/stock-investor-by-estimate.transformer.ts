import { Pipe } from '@common/types';
import { DomesticStockInvestorTrendEstimateOutput2 } from '@modules/korea-investment/korea-investment-quotation-client';
import { Stock } from '@app/modules/repositories/stock';
import { StockHourForeignerInvestorDto } from '@app/modules/repositories/stock-investor';

interface TransformerParams {
    stock: Stock;
    output: DomesticStockInvestorTrendEstimateOutput2;
}

export class StockInvestorByEstimateTransformer implements Pipe<
    TransformerParams,
    Omit<StockHourForeignerInvestorDto, 'date'>
> {
    transform({
        stock,
        output,
    }: TransformerParams): Omit<StockHourForeignerInvestorDto, 'date'> {
        return {
            timeCode: output.bsop_hour_gb,
            stockCode: stock.shortCode,
            foreigner: Number(output.frgn_fake_ntby_qty),
            organization: Number(output.orgn_fake_ntby_qty),
        };
    }
}
