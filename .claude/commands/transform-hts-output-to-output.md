---
description: 한국투자증권의 Query Parameter와 Response 데이터를 Interface, Dto로 변환하는 프롬프트
---

아래의 작업 지침을 순서대로 따라 파일을 변환하십시오.

# 데이터 양식

## HTS Output

```text
$ARGUMENTS
```

## 작업 지침

1. [HTS Output](#hts-output)을 Output 객체로 변환하십시오.
   변환 방법은 [Response Output 변환 예시](#response-output-변환-예시)를 참고하세요.
2. 변환된 내용은 /temp/[YYYYMMDDhhmmdd].output.ts 경로에 파일로 생성하십시오.

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
```typescript
export interface Output {
    /**
     * 유가증권 단축 종목코드
     */
    mksc_shrn_iscd: string;
    
    /**
     * HTS 한글 종목명
     */
    hts_kor_isnm: string;
}
```
