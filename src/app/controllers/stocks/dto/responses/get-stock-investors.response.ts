import { ApiProperty } from '@nestjs/swagger';
import { StockDailyInvestor } from '@app/modules/repositories/stock-daily-investor';

export class GetStockInvestorsResponse {
    @ApiProperty({
        type: StockDailyInvestor,
        description: '투자자 동향 데이터 (최신순 정렬)',
        isArray: true,
    })
    data: StockDailyInvestor[];
}
