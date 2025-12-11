import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DomesticStockQuotationsInquireIndexDailyPriceQuery {
  @ApiProperty({
    type: String,
    description: 'FID 기간 분류 코드 - 일/주/월 구분코드 ( D:일별 , W:주별, M:월별 )',
  })
  @IsString()
  FID_PERIOD_DIV_CODE: string;

  @ApiProperty({
    type: String,
    description: 'FID 조건 시장 분류 코드 - 시장구분코드 (업종 U)',
  })
  @IsString()
  FID_COND_MRKT_DIV_CODE: string;

  @ApiProperty({
    type: String,
    description:
      'FID 입력 종목코드 - 코스피(0001), 코스닥(1001), 코스피200(2001) ... 포탈 (FAQ : 종목정보 다운로드(국내) - 업종코드 참조)',
  })
  @IsString()
  FID_INPUT_ISCD: string;

  @ApiProperty({
    type: String,
    description: 'FID 입력 날짜1 - 입력 날짜(ex. 20240223)',
  })
  @IsString()
  FID_INPUT_DATE_1: string;
}