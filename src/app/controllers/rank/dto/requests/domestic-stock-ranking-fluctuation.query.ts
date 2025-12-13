import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MarketDivCode } from '@modules/korea-investment/common';

export class DomesticStockRankingFluctuationQuery {
    @ApiProperty({
        type: String,
        enum: MarketDivCode,
        description: '조건 시장 분류 코드 (J:KRX, NX:NXT)',
    })
    @IsEnum(MarketDivCode)
    fidCondMrktDivCode: MarketDivCode;

    @ApiPropertyOptional({
        type: String,
        description: '조건 화면 분류 코드',
        default: '20170',
    })
    @IsString()
    @IsOptional()
    fidCondScrDivCode: string = '20170';

    @ApiPropertyOptional({
        type: String,
        description:
            '입력 종목코드 (0000:전체, 0001:코스피, 1001:코스닥, 2001:코스피200)',
        default: '0000',
    })
    @IsString()
    @IsOptional()
    fidInputIscd: string = '0000';

    @ApiPropertyOptional({
        type: String,
        description:
            '순위 정렬 구분 코드 (0:상승율순, 1:하락율순, 2:시가대비상승율, 3:시가대비하락율, 4:변동율)',
        default: '0',
    })
    @IsString()
    @IsOptional()
    fidRankSortClsCode: string = '0';

    @ApiPropertyOptional({
        type: String,
        description:
            '가격 구분 코드 (상승율순:0:저가대비/1:종가대비, 하락율순:0:고가대비/1:종가대비, 기타:0:전체)',
        default: '0',
    })
    @IsString()
    @IsOptional()
    fidPrcClsCode: string = '0';

    @ApiPropertyOptional({
        type: String,
        description: '입력 수1 (0:전체, 누적일수 입력)',
        default: '0',
    })
    @IsString()
    @IsOptional()
    fidInputCnt1: string = '0';

    @ApiPropertyOptional({
        type: String,
        description: '입력 가격1 (가격 ~)',
        default: '',
    })
    @IsString()
    @IsOptional()
    fidInputPrice1: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '입력 가격2 (~ 가격)',
        default: '',
    })
    @IsString()
    @IsOptional()
    fidInputPrice2: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '등락 비율1 (비율 ~)',
        default: '',
    })
    @IsString()
    @IsOptional()
    fidRsflRate1: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '등락 비율2 (~ 비율)',
        default: '',
    })
    @IsString()
    @IsOptional()
    fidRsflRate2: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '거래량 수 (거래량 ~)',
        default: '',
    })
    @IsString()
    @IsOptional()
    fidVolCnt: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '대상 구분 코드 (0:전체)',
        default: '0',
    })
    @IsString()
    @IsOptional()
    fidTrgtClsCode: string = '0';

    @ApiPropertyOptional({
        type: String,
        description: '대상 제외 구분 코드 (0:전체)',
        default: '0',
    })
    @IsString()
    @IsOptional()
    fidTrgtExlsClsCode: string = '0';

    @ApiPropertyOptional({
        type: String,
        description: '분류 구분 코드 (0:전체)',
        default: '0',
    })
    @IsString()
    @IsOptional()
    fidDivClsCode: string = '0';
}
