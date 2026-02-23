당신은 현재 프로젝트에 Google 뉴스 RSS 피드를 수집하는 기능을 구현해야 합니다.

# 기능 요구사항
1. 주기적으로 Google 뉴스 RSS(XML)를 조회합니다.
2. 조회한 뉴스를 DB에 저장합니다.

# 아키텍처

## XmlParser

1. fast-xml-parser를 Wrapping 한 모듈
2. Service Layer에서 xml을 파싱해서 객체로 변화하는 로직만 제공.

## RssReader

1. 사용자가 전달한 RSS URL을 조회
2. XmlParser를 통해 파싱한 데이터를 응답
3. 응답데이터는 Generic으로 전달받아 Type 체크

## src/app/modules/Google RSS Module
1. 사용자가 전달한 rss URL을

## Google RSS Module
1. src/modules 에 Google RSS 피드 조회 모듈 필요
2. 피드 URL은 아래와 같이 설정이 되어있으며, ConfigService를 통해 조회 가능
```typescript
google: {
    rss: {
        business: getEnv('GOOGLE_RSS_BUSINESS'),
    },
},
```
3. RSS 데이터는 XML구조로 되어있기 때문에, XML로 파싱 후 item 들을 JSON 형식으로 변환 후 반환 필요.
```xml

<rss xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
    <channel>
        <generator>NFE/5.0</generator>
        <title>비즈니스 - 최신 뉴스 - Google 뉴스</title>
        <link>https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko</link>
        <language>ko</language>
        <webMaster>news-webmaster@google.com</webMaster>
        <copyright>Copyright © 2026 Google. All rights reserved. This XML feed is made available solely for the purpose of rendering Google News results within a personal feed reader for personal, non-commercial use. Any other use of the feed is expressly prohibited. By accessing this feed or using these results in any manner whatsoever, you agree to be bound by the foregoing restrictions.</copyright>
        <lastBuildDate>Wed, 11 Feb 2026 01:29:29 GMT</lastBuildDate>
        <image>
        <title>Google 뉴스</title>
        <url>https://lh3.googleusercontent.com/-DR60l-K8vnyi99NZovm9HlXyZwQ85GMDxiwJWzoasZYCUrPuUM_P_4Rb7ei03j-0nRs0c4F=w256</url>
        <link>https://news.google.com/</link>
        <height>256</height>
        <width>256</width>
        </image>
        <description>Google 뉴스</description>
        <item>
            <title>쿠팡 개인정보 유출, 해킹 아닌 관리 부실…조여오는 책임론 - 연합인포맥스</title>
            <link>https://news.google.com/rss/articles/CBMicEFVX3lxTE93YWVOZUk0d0hPX0VWTi03ckhmUUVIQVcxR0lwUnlUVVZQZ0JrdE41ajlqQ2NEN0R5M1RHQXhqZVJyOGd2MG11X1BFbF9PUTBqWi14VE9aMDVSX2VkRHByV1VWa3Y4MzVuX3R3SWRRS08?oc=5</link>
            <guid isPermaLink="false">CBMicEFVX3lxTE93YWVOZUk0d0hPX0VWTi03ckhmUUVIQVcxR0lwUnlUVVZQZ0JrdE41ajlqQ2NEN0R5M1RHQXhqZVJyOGd2MG11X1BFbF9PUTBqWi14VE9aMDVSX2VkRHByV1VWa3Y4MzVuX3R3SWRRS08</guid>
            <pubDate>Wed, 11 Feb 2026 00:12:40 GMT</pubDate>
            <description><ol><li><a href="https://news.google.com/rss/articles/CBMicEFVX3lxTE93YWVOZUk0d0hPX0VWTi03ckhmUUVIQVcxR0lwUnlUVVZQZ0JrdE41ajlqQ2NEN0R5M1RHQXhqZVJyOGd2MG11X1BFbF9PUTBqWi14VE9aMDVSX2VkRHByV1VWa3Y4MzVuX3R3SWRRS08?oc=5" target="_blank">쿠팡 개인정보 유출, 해킹 아닌 관리 부실…조여오는 책임론</a>&nbsp;&nbsp;<font color="#6f6f6f">연합인포맥스</font></li><li><a href="https://news.google.com/rss/articles/CBMilAFBVV95cUxNZEY2Q1hDUXN6bGwwOHFwWjExWU9oMDdZV3NzbXlZX25SeWtVR2JLTGZhNW9NT2ZZejcyV296b0dXMXZGZFB5NF9yY0FDSTFzQjJfdkFRLTB1TjBHRjVhV2dYOGZBZGllMmwyMWRySW1LRGRoc3o1NERzM2gwQ0ZFSlZDUGNIOC1DT3AxeWdJTzF2YmZ1?oc=5" target="_blank">쿠팡 침해사고 민관합동조사단 조사결과</a>&nbsp;&nbsp;<font color="#6f6f6f">대한민국 정책브리핑</font></li><li><a href="https://news.google.com/rss/articles/CBMiW0FVX3lxTFBRYzkwVFBKOUdSYUQzd3liMy0yWHFZYjlKWndWczJQUEJMOHJKU1dXWWZURXQwenVyc090VkpqNDlwZnY1RXgtLVJ0V282MjNXVnB5eGJ6cFhZa2s?oc=5" target="_blank">쿠팡 정보유출 3천367만명…가족·지인도 털려</a>&nbsp;&nbsp;<font color="#6f6f6f">KBS 뉴스</font></li><li><a href="https://news.google.com/rss/articles/CBMiVkFVX3lxTE5udEpLY2R0dEVFQThDXzdkOVRzekxEblpKNWZBbzEwZXNCTE03UmFkSU9Tb1gwX3VzSlE4dXFpNENmaWNmSGlwVGk5VjBZU1NXbDBySm93?oc=5" target="_blank">[쿠팡 사태⑥] 보안 전문가들 "기본도 안 지킨 인재" 한목소리</a>&nbsp;&nbsp;<font color="#6f6f6f">지디넷코리아</font></li><li><a href="https://news.google.com/rss/articles/CBMiWkFVX3lxTE9yQ0FzSDk3c28xSnZiMnJ2MFYyMVI3eUJSRkg4aGJfbldEZzRCTENVVERIVGFMRVJfNGYtWHFKSTh2Um55SktpWm5Pek02MXBpaFJVaEZOM1JVUdIBX0FVX3lxTE1EWGc1NWhacnB6Y1lhMWVmbkZnN3laUkotYUI2V2dzZEhYa2Q1Q0FSZi1YQ0VuQmNmMnIzcDZBbmVHY094V3FCT29KQUdMUWRYOU1UNnlWSjFQUHo5VVVF?oc=5" target="_blank">“공동현관 출입코드 유출, 5만건 아닌 2609건이다” 정부에 또 반발하는 쿠팡</a>&nbsp;&nbsp;<font color="#6f6f6f">경향신문</font></li></ol></description>
            <source url="https://news.einfomax.co.kr">연합인포맥스</source>
        </item>
        <item>
            <title>[초점] 메모리 가격 급등에 주식시장 명암…삼성전자·SK하이닉스 웃고 닌텐도·애플 협력사 울상 - 글로벌이코노믹</title>
            <link>https://news.google.com/rss/articles/CBMiiAFBVV95cUxQeG81dmNELTd1bFdUWkc5Zkh4MWF6NGNzaWN5SFMxLVhvdjVVU2F2NXY1OXc2TmRVckQ3NEtVRW9fdmVVV3JaQlRnc3RjdjF4SkF6NlRSWGx6czU2bk5TSU9fNzBCSUFfOE1WZWpWQUY4T2VlTFBnd1pNSHhxQ3hiOWdLc04zT1Z3?oc=5</link>
            <guid isPermaLink="false">CBMiiAFBVV95cUxQeG81dmNELTd1bFdUWkc5Zkh4MWF6NGNzaWN5SFMxLVhvdjVVU2F2NXY1OXc2TmRVckQ3NEtVRW9fdmVVV3JaQlRnc3RjdjF4SkF6NlRSWGx6czU2bk5TSU9fNzBCSUFfOE1WZWpWQUY4T2VlTFBnd1pNSHhxQ3hiOWdLc04zT1Z3</guid>
            <pubDate>Tue, 10 Feb 2026 20:00:00 GMT</pubDate>
            <description><ol><li><a href="https://news.google.com/rss/articles/CBMiiAFBVV95cUxQeG81dmNELTd1bFdUWkc5Zkh4MWF6NGNzaWN5SFMxLVhvdjVVU2F2NXY1OXc2TmRVckQ3NEtVRW9fdmVVV3JaQlRnc3RjdjF4SkF6NlRSWGx6czU2bk5TSU9fNzBCSUFfOE1WZWpWQUY4T2VlTFBnd1pNSHhxQ3hiOWdLc04zT1Z3?oc=5" target="_blank">[초점] 메모리 가격 급등에 주식시장 명암…삼성전자·SK하이닉스 웃고 닌텐도·애플 협력사 울상</a>&nbsp;&nbsp;<font color="#6f6f6f">글로벌이코노믹</font></li><li><a href="https://news.google.com/rss/articles/CBMiggFBVV95cUxNSHNoNGNTaklRR05oWHdrQkhyd0lraWx4OTNFRTVaM0ZKem9qdGNCZ3pSZm1RdnM4RGhtT3U4aFY0SXczWkhPYURUZ3gxam1yWE5ZZEQxblI4UjQ5akRjMHFlOC01S2RlUHZUYzRHUVMycHY5ZVVuckdzTm5FekVidTln0gGWAUFVX3lxTE5RN3Z6Z1J4OFRlWk1kSjRiaUJpZ2hCc1BYcS1WdU9wYjJ2Q0hCQ2E4WmozdlZmTVJSME5SaDdwVDRrS3R2M0ItX3p4cXV1S3Ffa21NTGFXMkttUFh6R3ZnOTJMenRINUZjVTAyUTlscmlmdGpYSUtVV0REZVlYRHUySnVDTHMtZlM1WkFva0VZMExHZnhjQQ?oc=5" target="_blank">‘낸드 골든 사이클’의 역설… 韓, HBM에 올인한 사이 美·中·日 공습 시작 - 조선비즈</a>&nbsp;&nbsp;<font color="#6f6f6f">Chosunbiz</font></li><li><a href="https://news.google.com/rss/articles/CBMiVkFVX3lxTE95c2lGeUdFcU9ER3E0T2ZIWFRhWEdVZUcwZlN4WTc1MTdud0R3RzZFRmphODFKWTR1QUl6TktBYXN6akI2RzQ5TUk1bUNJVWxNSHVGYnh3?oc=5" target="_blank">D램 구조적 공급 부족 직면…"생산능력 매년 5% 미만 성장"</a>&nbsp;&nbsp;<font color="#6f6f6f">지디넷코리아</font></li><li><a href="https://news.google.com/rss/articles/CBMic0FVX3lxTE0wdnMyQjRUWjBNeEtNTzBxcEZqZGNDX2RUbzF0TkZic0V3WUNuR1VPQ1FRZnh1bWlSeGpCV284VXpidVJ1dkdXNFprUFVQbHZjdlR4MWxGV0NaYTNUb2dBUG5lY1lVQi1RZlJwX2FDdk9LWE0?oc=5" target="_blank">삼성전자 SK하이닉스 메모리반도체 강력한 호황 끝 안 보여, 해외 투자기관 "예측 불가능"</a>&nbsp;&nbsp;<font color="#6f6f6f">비즈니스포스트</font></li><li><a href="https://news.google.com/rss/articles/CBMiW0FVX3lxTFBVTGdGd09IX3gzY1MxaGdNc1dETGtyQ0FkdE1lVGtocDJpckhET3BJRWtJYTR2Rm1QWVFjRUVXYy15cEhMNDZWT3plbmZXVXcxd0lkRzhhUmd5dzTSAWBBVV95cUxOaWRSSXpLV0t2M3h4T0VQMldIUDVXWnRFNHAyQ1FmOHhnOGZzbzFVZVNjbkU5eEJQMm9HS3c2anpCbDU4SUMyVHlGWGR2UEpRdml3SnB3ck9SUmlybGROVU4?oc=5" target="_blank">메모리 '슈퍼 사이클'이 기업 주가 희비 갈랐다</a>&nbsp;&nbsp;<font color="#6f6f6f">연합뉴스</font></li></ol></description>
            <source url="https://www.g-enews.com">글로벌이코노믹</source>
        </item>
        ...
    </channel>
</rss>
```

## news-crawler 모듈
1. src/app/modules/crawler/news-crawler 모듈에서 전략 추가 필요.
2. google-business.strategy.ts 전략 패턴 추가
3. Google Rss Module에서 변환한 JSON 형식의 뉴스를 NewsDto 형식으로 변환 필요

# 작업 방식
1. 위와 같이 작업을 진행하려고 하는데, 내가 놓치거나 추가적인 아이디어가 있다면 제시하고, 의견을 물어봐줘.
2. 내가 진행하라고 말을 하면 작업을 수행해주고, 너의 아이디어나 추가적인 제안이나 질문을 한다면 진행하라고 명확하게 이야기할 때 까지 나와 소통해줘.
3. 작업을 진행할 때 반드시 플랜 모드는 사용하지 말고, 위에서 이야기한 내용을 토대로 기능을 추가해줘.