import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DomesticStockQuotationsInquireMemberQuery {
    @ApiProperty({
        type: String,
        description: 'FID 조건 시장 분류 코드 (J:KRX, NX:NXT, UN:통합)',
    })
    @IsString()
    FID_COND_MRKT_DIV_CODE: string;

    @ApiProperty({
        type: String,
        description: 'FID 입력 종목코드 (종목번호 6자리, ETN의 경우 Q로 시작)',
    })
    @IsString()
    FID_INPUT_ISCD: string;
}
