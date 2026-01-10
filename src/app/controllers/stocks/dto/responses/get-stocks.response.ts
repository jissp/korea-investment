import { ApiProperty } from '@nestjs/swagger';
import { Stock } from '@app/modules/repositories/stock';

export class GetStocksResponse {
    @ApiProperty({
        type: Stock,
        description: '투자자 동향 데이터 (최신순 정렬)',
        isArray: true,
    })
    data: Stock[];
}
