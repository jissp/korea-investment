import { ApiProperty } from '@nestjs/swagger';
import { StockHourForeignerInvestor } from '@app/modules/repositories/stock-investor';

export class GetStockInvestorByEstimateResponse {
    @ApiProperty({
        type: StockHourForeignerInvestor,
        description: '종목별 외인기관 추정가집계 정보',
        isArray: true,
    })
    data: StockHourForeignerInvestor[];
}
