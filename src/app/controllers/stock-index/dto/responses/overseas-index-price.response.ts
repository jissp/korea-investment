import { ApiProperty } from '@nestjs/swagger';
import { OverseasIndexItem } from '@app/modules/repositories';

class OverseasIndexPrice implements OverseasIndexItem {
    @ApiProperty({
        description: '지수 코드',
    })
    code: string;
    @ApiProperty({
        description: '지수명',
    })
    name: string;
    @ApiProperty({
        description: '지수 현재가',
    })
    price: number;
    @ApiProperty({
        description: '지수 전일 대비',
    })
    change: number;
    @ApiProperty({
        description: '지수 전일 대비율',
    })
    changeRate: number;
}

export class OverseasIndexPriceResponse {
    @ApiProperty({
        type: OverseasIndexPrice,
        isArray: true,
    })
    data: OverseasIndexPrice[];
}
