---
template: plan
version: 1.2
description: PDCA Plan phase document template with Architecture and Convention considerations
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - author: Author
  - project: Project name (from package.json or CLAUDE.md)
  - version: Project version (from package.json)
---

# 작업 개요

## 작업 목적
[작업 목적에 대해서 이해한 바 설명]

## 작업 시 제외사항
[토큰 낭비를 방지하기 위해 하지말아야할 것 명시]

# 이해 및 분석

## 현재 프로젝트 아키텍처
[사용자가 요청한 작업과 관련된 파일과 로직을 확인하고, 그 구조를 분석하여 나열]

## 작업 범위
- [ ] [사용자가 요청한 작업을 수행하기 위한 내용(코드 포함)을 나열]

# 작업 진행

## 필수 사항

작업을 진행할 때 반드시 시켜야하는 항목입니다.

1. 작업은 반드시 의존성 순서에 맞게 진행하세요. 
예시:
```
1. 마이크로 모듈 설계(예: RssReader, XmlParser)
2. 모듈 설계(GoogleRss)
3. GoogleRss Service Layer 로직 구현
4. Controller 또는 Scheduler 설계
5. ...
```

이 때 마이크로 모듈 설계 단계에서도 위 순서에 맞게 작업을 진행해야 합니다.

## 3. Tech & Convention (Check-only)
- **Stack:** NestJS, TypeScript
- **Rules:** `CLAUDE.md` 준수 / ESLint 엄격 적용
- **Env:** `NEXT_PUBLIC_API_URL`, `DATABASE_URL` 필요

## 4. Step-by-Step Implementation (AI 가이드)

1. 

1. [ ] **Step 1:** {데이터 모델링 및 DB 마이그레이션}
2. [ ] **Step 2:** {핵심 로직 및 API 구현}
3. [ ] **Step 3:** {UI 컴포넌트 및 상태 연결}

## 5. Definition of Done (DoD)
- [ ] 테스트 통과 및 린트 에러 없음
- [ ] {특정 핵심 동작} 확인 완료