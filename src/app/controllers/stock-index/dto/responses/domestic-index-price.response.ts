import { ApiProperty } from '@nestjs/swagger';
import { DomesticIndexItem } from '@app/modules/repositories/index-repository/index-repository.types';

class DomesticIndexPrice implements DomesticIndexItem {
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

export class DomesticIndexPriceResponse {
    @ApiProperty({
        type: DomesticIndexPrice,
        isArray: true,
    })
    data: DomesticIndexPrice[];
}
