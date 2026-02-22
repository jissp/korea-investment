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

작업을 진행할 때 반드시 지켜야 하는 항목입니다.

1. **도메인 모듈 구조**: 신규 기능은 `@src/app/modules/domain/[domain-name]` 하위에 구성하며, 아래의 구조를 따릅니다.
    - `dto/`: `requests/`, `responses/` 디렉토리로 요청/응답 분리
    - `use-cases/`: 각 비즈니스 로직을 개별 UseCase 클래스로 분리 (BaseUseCase 구현)
    - `[domain].controller.ts`: API 진입점
    - `[domain].module.ts`: 의존성 관리

2. **의존성 순서**: 작업은 데이터 계층부터 시작하여 상위 계층으로 진행합니다.
   예시:

```
1. Repository/Entity 정의 (필요 시)
2. Request/Response DTO 정의
3. 개별 UseCase 구현 (Domain logic)
4. Controller 연결
5. Module 및 API 등록
```

## 3. Tech & Convention (Check-only)

- **Stack:** NestJS, TypeScript, TypeORM
- **Architecture:** Clean Architecture (UseCase pattern)
- **Rules:** `CLAUDE.md` 준수 / ESLint 엄격 적용
- **Path Aliases:** `@app/modules/domain/...`, `@app/modules/repositories/...` 적극 활용

## 4. Step-by-Step Implementation (AI 가이드)

1. [ ] **Step 1:** {데이터 모델링 및 리포지토리 구성}
2. [ ] **Step 2:** {DTO(Request/Response) 정의}
3. [ ] **Step 3:** {개별 비즈니스 로직을 담은 UseCase 구현}
4. [ ] **Step 4:** {Controller 인터페이스 구현 및 API 명세 작성}
5. [ ] **Step 5:** {Module 정의 및 최종 조립}

## 5. Definition of Done (DoD)

- [ ] 테스트 통과 및 린트 에러 없음
- [ ] Swagger API 명세 확인 완료
- [ ] UseCase 단일 책임 원칙 준수 확인
- [ ] {특정 핵심 동작} 확인 완료