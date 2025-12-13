import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DomesticStockQuotationsNewsTitleQuery {
    @ApiPropertyOptional({
        type: String,
        description: '뉴스 제공 업체 코드',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_NEWS_OFER_ENTP_CODE: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '조건 시장 구분 코드',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_COND_MRKT_CLS_CODE: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '입력 종목코드',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_INPUT_ISCD: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '제목 내용',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_TITL_CNTT: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '입력 날짜',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_INPUT_DATE_1: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '입력 시간',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_INPUT_HOUR_1: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '순위 정렬 구분 코드',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_RANK_SORT_CLS_CODE: string = '';

    @ApiPropertyOptional({
        type: String,
        description: '입력 일련번호',
        default: '',
    })
    @IsString()
    @IsOptional()
    FID_INPUT_SRNO: string = '';
}
