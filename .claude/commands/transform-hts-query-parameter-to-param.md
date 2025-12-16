---
description: 한국투자증권의 Query Parameter와 Response 데이터를 Interface, Dto로 변환하는 프롬프트
---

아래의 작업 지침을 순서대로 따라 파일을 변환하십시오.

# 데이터 양식

## Query Parameter

```text
$ARGUMENTS
```

## 작업 지침

1. [Query Parameter](#query-parameter)를 Param 객체로 변환하십시오.
   변환 방법은 [Query Parameter 변환 예시](#query-parameter-변환-예시)를 참고하세요.
2. 변환된 내용은 /temp/[YYYYMMDDhhmmdd].param.ts 경로에 파일로 생성하십시오.

## Query Parameter 변환 예시

1. 각 항목은 아래와 같은 패턴의 양식으로 변환되어야 합니다.

변환 전:
```text
FID_COND_MRKT_DIV_CODE	FID 조건 시장 분류 코드	String	Y	2	N: 해외지수, X 환율, I: 국채, S:금선물
FID_INPUT_ISCD	FID 입력 종목코드	String	Y	12	종목코드
※ 해외주식 마스터 코드 참조
(포럼 > FAQ > 종목정보 다운로드(해외) > 해외지수)

※ 해당 API로 미국주식 조회 시, 다우30, 나스닥100, S&P500 종목만 조회 가능합니다. 더 많은 미국주식 종목 시세를 이용할 시에는, 해외주식기간별시세 API 사용 부탁드립니다.
FID_INPUT_DATE_1	FID 입력 날짜1	String	Y	10	시작일자(YYYYMMDD)
```

변환 후:
```typescript
export interface Param {
    /**
     * FID 조건 시장 분류 코드
     * N: 해외지수, X 환율, I: 국채, S:금선물
     */
    FID_COND_MRKT_DIV_CODE: string;
    
    /**
     * FID 입력 종목코드
     * ※ 해외주식 마스터 코드 참조
     * (포럼 > FAQ > 종목정보 다운로드(해외) > 해외지수)
     *
     * ※ 해당 API로 미국주식 조회 시, 다우30, 나스닥100, S&P500 종목만 조회 가능합니다. 더 많은 미국주식 종목 시세를 이용할 시에는, 해외주식기간별시세 API 사용 부탁드립니다.
     */
    FID_INPUT_ISCD: string;
    
    /**
     * FID 입력 날짜1
     * 시작일자(YYYYMMDD)
     */
    FID_INPUT_DATE_1: string;
}
```
