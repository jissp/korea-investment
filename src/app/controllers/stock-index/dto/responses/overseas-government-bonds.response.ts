import { ApiProperty } from '@nestjs/swagger';
import { OverseasGovernmentBondItem } from '@app/modules/repositories';

class OverseasGovernmentBond implements OverseasGovernmentBondItem {
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

export class OverseasGovernmentBondsResponse {
    @ApiProperty({
        type: OverseasGovernmentBond,
        isArray: true,
    })
    data: OverseasGovernmentBond[];
}
