## 1. 사전 분석 및 위험 평가 (Analyze)
작업 시작 전, 다음 항목을 반드시 분석하고 사용자에게 보고하세요.
1.  **영향 범위 파악**: 기존 모듈(Module), 엔티티(Entity), 서비스(Service)와의 연관 관계를 분석합니다.
2.  **의존성 그래프 설계**: 신규 기능이 기존 모듈을 참조해야 하는지, 혹은 공통 모듈로 분리해야 하는지 결정합니다. (**순환 참조 `forwardRef` 사용 지양**)
3.  **작업 규모 산정**: (소/중/대) 분류 및 데이터베이스 마이그레이션 필요 여부를 확인합니다.
4.  **승인 절차**: 분석된 범위와 설계 방향을 요약하여 사용자에게 제시하고, **"이대로 설계를 진행할까요?"**라는 질문을 통해 명시적 승인을 받으세요.

## 2. 설계 원칙 (Standard)
NestJS의 기본 아키텍처와 Best Practice를 엄격히 준수합니다.
-   **Module-Driven**: 모든 기능은 관련 모듈 내에 응집되어야 하며, `exports`와 `imports`를 통해 명확한 인터페이스를 제공합니다.
-   **Layered Responsibility**:
    -   **Controller**: 요청 라우팅 및 응답 구조 정의.
    -   **DTO**: `class-validator`를 이용한 입력값 검증 및 타입 정의.
    -   **Service**: 비즈니스 로직의 핵심 구현. (Fat Controller 지양)
    -   **Repository/Entity**: TypeORM/Sequelize 등을 활용한 데이터 접근 계층.
    -   **Processor**: BullMQ 등 비동기 작업의 격리 처리.
    -   **Config**: `ConfigService`를 통한 환경 변수 관리 (`src/app/configuration.ts` 참조).

## 3. 설계 문서 작성 가이드 (Document)
승인 후 `.prompts/plan/[YYYYMMDDHHMMSS]_[feature-name].md` 파일을 생성하며, 반드시 **의존성 순서(Bottom-Up)**에 따라 작성합니다.

### [문서 필수 포함 내용]
1.  **Dependency Flow**: 어떤 모듈이 어떤 모듈을 참조하는지 명시 (예: Common -> User -> Auth).
2.  **Implementation Sequence**: 아래 순서를 권장합니다.
    -   1) 데이터 모델(Entity) 및 DTO 정의
    -   2) 내부 유틸리티 및 Config 설정
    -   3) 서비스(Service) 로직 및 비즈니스 예외 처리
    -   4) 컨트롤러(Controller) 및 API 명세
    -   5) 모듈(Module) 등록 및 의존성 주입
3.  **Success Criteria**: 기능 완료를 확인하기 위한 체크리스트.

## 4. 실행 흐름 (Workflow)
1.  **Step 1 (Analyze)**: 코드베이스 탐색 후 작업 범위를 요약 보고.
2.  **Step 2 (Ask)**: 설계 진행 여부에 대한 사용자 컨펌.
3.  **Step 3 (Document)**: 의존성 계층 구조가 반영된 설계 문서 생성 및 저장.