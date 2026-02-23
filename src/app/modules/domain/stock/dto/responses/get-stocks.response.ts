import { ApiProperty } from '@nestjs/swagger';
import { Stock } from '@app/modules/repositories/stock';

export class GetStocksResponse {
    @ApiProperty({
        type: Stock,
        description: '종목 정보',
        isArray: true,
    })
    data: Stock[];
}
