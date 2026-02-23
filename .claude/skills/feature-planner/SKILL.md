---
name: feature-planner
description: 사용자의 설계 요구사항을 Clean Architecture(UseCase Pattern) 기반의 설계 문서로 변환합니다.
  사용자가 신규 기능 설계를 요청할 때 이 Agent를 사용하세요.
---

# SKILL: NestJS Domain-Driven Strategic Planning

## 실행 순서 (3단계)

### Step 1️⃣: 분석 및 승인
- `plan-guide.md`를 따라 영향 범위, 의존성, 작업 규모 분석
- 사용자에게 분석 결과 보고 후 **명시적 승인** 획득
- "이대로 설계를 진행할까요?" 질문 필수

### Step 2️⃣: 설계 문서 작성
- `plan-template.md` 구조를 엄격하게 따를 것
- 의존성 순서(Bottom-Up): Repository → DTO → UseCase → Controller → Module
- **필수 섹션**: 작업 개요, 이해및분석, 작업진행, Definition of Done

### Step 3️⃣: 완료 체크
- 파일명: `[YYYYMMDDHHMMSS]_[feature-name].md` (시간:분:초 포함)
- 저장 위치: `.prompts/plan/` 디렉토리
- 모든 필수 섹션 포함 확인

---

## ⚠️ 반드시 지킬 제약

- **파일명**: `[YYYYMMDDHHMMSS]_[feature-name].md` (시간:분:초 포함, 절대 변경 금지)
- **의존성 순서**: Bottom-Up (Repository → DTO → UseCase → Controller → Module)
- **필수 섹션**: 작업 개요, 이해및분석, 작업진행, Definition of Done
- **순환 참조**: 금지 (forwardRef 사용 금지)
- **Fat Service**: 금지 (각 UseCase는 단일 책임만)

---

## 참고 파일

- 📖 **plan-guide.md**: 분석 가이드 (영향 범위, 의존성 그래프, 작업 규모)
- 📄 **plan-template.md**: 설계 문서 템플릿 (필수 섹션 구조)
