import { Pipe } from '@common/types';
import { DomesticStockInvestorTrendEstimateOutput2 } from '@modules/korea-investment/korea-investment-quotation-client';
import { Stock } from '@app/modules/repositories/stock';
import { StockInvestorByEstimateDto } from '@app/controllers';

interface TransformerParams {
    stock: Stock;
    output: DomesticStockInvestorTrendEstimateOutput2;
}

export class StockInvestorByForeignTransformer implements Pipe<
    TransformerParams,
    StockInvestorByEstimateDto
> {
    transform({
        stock,
        output,
    }: TransformerParams): StockInvestorByEstimateDto {
        return {
            // hour: this.getHour(output.bsop_hour_gb),
            time: output.bsop_hour_gb,
            stockCode: stock.shortCode,
            stockName: stock.name,
            person: Number(output.frgn_fake_ntby_qty),
            organization: Number(output.orgn_fake_ntby_qty),
            sum: Number(output.sum_fake_ntby_qty),
        };
    }

    private getHour(hourGb: string) {
        switch (hourGb) {
            case '1':
                return '09:30';
            case '2':
                return '10:00';
            case '3':
                return '11:20';
            case '4':
                return '13:20';
            case '5':
                return '14:30';
        }

        throw new Error('Invalid hourGb value');
    }
}
