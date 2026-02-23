import { ApiProperty } from '@nestjs/swagger';
import { Nullable } from '@common/types';
import { Stock } from '@app/modules/repositories/stock';

export class GetStockResponse {
    @ApiProperty({
        type: Stock,
        description: '종목 정보',
        nullable: true,
    })
    data: Nullable<Stock>;
}
