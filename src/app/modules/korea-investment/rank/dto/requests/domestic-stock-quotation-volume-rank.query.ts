import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MarketDivCode } from '@modules/korea-investment/common';

export class DomesticStockQuotationVolumeRankQuery {
    @ApiProperty({
        type: String,
        enum: MarketDivCode,
        description: '조건 시장 분류 코드 (J:KRX, NX:NXT)',
    })
    @IsEnum(MarketDivCode)
    fidCondMrktDivCode: MarketDivCode;

    @ApiPropertyOptional({
        type: String,
        description: '조건 화면 분류 코드. 20171 고정',
        default: '20171',
    })
    @IsString()
    @IsOptional()
    fidCondScrDivCode?: string;

    @ApiPropertyOptional({
        type: String,
        description: '입력 종목코드 (0000:전체, 기타:업종코드)',
        default: '0000',
    })
    @IsString()
    @IsOptional()
    fidInputIscd?: string;

    @ApiPropertyOptional({
        type: String,
        description: '분류 구분 코드 (0:전체, 1:보통주, 2:우선주)',
        default: '0',
    })
    @IsString()
    @IsOptional()
    fidDivClsCode?: string;

    @ApiProperty({
        type: String,
        description:
            '소속 구분 코드 (0:평균거래량, 1:거래증가율, 2:평균거래회전율, 3:거래금액순, 4:평균거래금액회전율)',
    })
    @IsString()
    fidBlngClsCode: string;

    @ApiPropertyOptional({
        type: String,
        description:
            '대상 구분 코드 (1 or 0 9자리 - 증거금 30% 40% 50% 60% 100% 신용보증금 30% 40% 50% 60%)',
        default: '000000000',
    })
    @IsString()
    @IsOptional()
    fidTrgtClsCode?: string;

    @ApiPropertyOptional({
        type: String,
        description:
            '대상 제외 구분 코드 (1 or 0 10자리 - 투자위험/경고/주의 관리종목 정리매매 불성실공시 우선주 거래정지 ETF ETN 신용주문불가 SPAC)',
        default: '0000000000',
    })
    @IsString()
    @IsOptional()
    fidTrgtExlsClsCode?: string;

    @ApiPropertyOptional({
        type: String,
        description: '입력 가격1 (가격 ~)',
        default: '',
    })
    @IsString()
    @IsOptional()
    fidInputPrice1?: string;

    @ApiPropertyOptional({
        type: String,
        description: '입력 가격2 (~ 가격)',
        default: '',
    })
    @IsString()
    @IsOptional()
    fidInputPrice2?: string;

    @ApiPropertyOptional({
        type: String,
        description: '거래량 수 (거래량 ~)',
        default: '',
    })
    @IsString()
    @IsOptional()
    fidVolCnt?: string;

    @ApiPropertyOptional({
        type: String,
        description: '입력 날짜1',
        default: '',
    })
    @IsString()
    @IsOptional()
    fidInputDate1?: string;
}
