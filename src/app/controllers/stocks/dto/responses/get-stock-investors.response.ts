import { ApiProperty } from '@nestjs/swagger';
import { StockInvestor } from '@app/modules/repositories/stock-investor';

export class GetStockInvestorsResponse {
    @ApiProperty({
        type: StockInvestor,
        description: '투자자 동향 데이터 (최신순 정렬)',
        isArray: true,
    })
    data: StockInvestor[];
}
