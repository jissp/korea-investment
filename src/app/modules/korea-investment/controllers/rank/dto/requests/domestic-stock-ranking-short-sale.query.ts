import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DomesticStockRankingShortSaleQuery {
    @ApiPropertyOptional({
        type: String,
        description: 'FID 적용 범위 거래량',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_APLY_RANG_VOL = '';

    @ApiPropertyOptional({
        type: String,
        description: '조건 시장 분류 코드',
    })
    @IsString()
    @IsOptional()
    FID_COND_MRKT_DIV_CODE = 'J';

    @ApiPropertyOptional({
        type: String,
        description: '조건 화면 분류 코드',
    })
    @IsString()
    @IsOptional()
    FID_COND_SCR_DIV_CODE = '20482';

    @ApiPropertyOptional({
        type: String,
        description: '입력 종목코드',
    })
    @IsString()
    @IsOptional()
    FID_INPUT_ISCD: string = '0000';

    @ApiPropertyOptional({
        type: String,
        description: '조회구분 (일/월)',
    })
    @IsString()
    @IsOptional()
    FID_PERIOD_DIV_CODE: string = 'D';

    @ApiProperty({
        type: String,
        description:
            '조회기간(일수). 조회구분(D) 0:1일, 1:2일, 2:3일, 3:4일, 4:1주일, 9:2주일, 14:3주일. 조회구분(M) 1:1개월, 2:2개월, 3:3개월',
    })
    @IsString()
    FID_INPUT_CNT_1: string;

    @ApiPropertyOptional({
        type: String,
        description: '대상 제외 구분 코드',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_TRGT_EXLS_CLS_CODE: string = '';

    @ApiPropertyOptional({
        type: String,
        description: 'FID 대상 구분 코드',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_TRGT_CLS_CODE: string = '';

    @ApiProperty({
        type: String,
        description: 'FID 적용 범위 가격1',
    })
    @IsString()
    FID_APLY_RANG_PRC_1: string;

    @ApiProperty({
        type: String,
        description: 'FID 적용 범위 가격2',
    })
    @IsString()
    FID_APLY_RANG_PRC_2: string;
}