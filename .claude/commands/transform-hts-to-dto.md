---
description: 한국투자증권의 Query Parameter와 Response 데이터를 Interface, Dto로 변환하는 프롬프트
---

아래의 작업 지침을 순서대로 따라 파일을 변환하십시오.

# 데이터 양식

## API Endpoint

```text

```

## Query Parameter

```text

```

## Response

```text

```

## 작업 지침

1. 입력된 [API Endpoint](#api-endpoint)를 기본 파일명으로 사용하십시오.  
   예를 들어 `https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/domestic-stock/v1/ranking/short-sale` 일 경우 `domestic-stock-ranking-short-sale`와 같은 패턴으로 파일명을 사용해야 합니다.
2. Query Parameter를 Dto로 변환하십시오. 변환 예시는 [Query Parameter 변환 예시](#query-parameter-변환-예시) 항목을 참고하세요.
3. Response를 Output Dto로 변환하십시오. 변환 예시는 [Response Output 변환 예시](#response-output-변환-예시) 항목을 참고하세요.
   - 만약 Response2가 존재할 경우 Response와 동일하게 변환하십시오. 
4. 생성된 Output 파일을 Response Dto로 변환하십시오. 변환 예시는 [Output Response 변환 예시](#output-response-변환-예시) 항목을 참고하세요.
5. 변환된 파일은 /temp 디렉토리에 아래의 패턴으로 생성하십시오.
   - Query Parameter: [기본 파일명].query.ts
   - Output: [기본 파일명].output.ts
   - Response: [기본 파일명].response.ts

## Query Parameter 변환 예시

1. 각 항목은 아래와 같은 패턴의 양식으로 변환되어야 합니다.

변환 전:
```text
FID_APLY_RANG_VOL	FID 적용 범위 거래량	String	Y	18	공백
```

변환 후:
```text
@ApiProperty({
    type: String,
    description: 'FID 적용 범위 거래량',
})
@IsString()
FID_APLY_RANG_VOL: string;
```


## Response Output 변환 예시

1. 각 항목은 아래와 같은 패턴의 양식으로 변환되어야 합니다.

변환 전:
```text
mksc_shrn_iscd

유가증권 단축 종목코드	String	Y	9	
hts_kor_isnm

HTS 한글 종목명	String	Y	40
```

변환 후:
```text
@ApiProperty({
    type: String,
    description: '유가증권 단축 종목코드',
})
mksc_shrn_iscd: string;

@ApiProperty({
    type: String,
    description: 'HTS 한글 종목명',
})
hts_kor_isnm: string;
```

## Output Response 변환 예시

1. 각 항목은 아래와 같은 패턴의 양식으로 변환되어야 합니다.

변환 전:
```typescript
export interface DomesticStockRankingHtsTopViewOutput {
    /**
     * 종목코드
     */
    mksc_shrn_iscd: string;
}
```

변환 후:

```typescript
class DomesticStockRankingHtsTopView implements DomesticStockRankingHtsTopViewOutput {
    @ApiProperty({
        type: String,
        description: '종목코드',
    })
    mksc_shrn_iscd: string;
}

export class DomesticStockRankingHtsTopViewResponse {
    @ApiProperty({
        type: DomesticStockRankingHtsTopView,
        isArray: true,
    })
    data: DomesticStockRankingHtsTopView[];
}
```
