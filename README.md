# Korea Investment Stock Analysis System

한국투자증권 API와 Google Gemini AI를 활용한 **실시간 주식 분석 및 정보 제공 시스템**입니다. 

NestJS 11.x 프레임워크를 기반으로 구축되었으며, 실시간 체결가 스트리밍, AI 기반 종목 분석, 뉴스 크롤링 등의 기능을 제공합니다.

## 1. 프로젝트 개요

### 1.1 시스템 목적
이 프로젝트는 한국투자증권의 Open API와 Google의 Gemini AI를 결합하여 사용자에게 심도 있는 주식 정보를 제공하는 것을 목적으로 합니다. 실시간 데이터 처리와 대규모 데이터 수집, 그리고 LLM을 이용한 분석 리포트 생성이 핵심입니다.

### 1.2 기술 스택 (Tech Stack)

| 카테고리 | 기술 | 비고 |
|---------|------|------|
| **Framework** | NestJS 11.x | TypeScript 기반 |
| **Database** | MySQL | TypeORM (SnakeNamingStrategy 적용) |
| **Cache/Queue** | Redis + BullMQ | 데이터 캐싱 및 비동기 작업 처리 |
| **WebSocket** | Socket.io | 실시간 체결가 클라이언트 전송 |
| **AI** | Google Gemini CLI | 종목/시장 분석 및 리포트 생성 |
| **External APIs** | 한국투자증권 API, Naver 뉴스 API | 주식 데이터 및 뉴스 수집 |

### 1.3 주요 기능
*   **실시간 주식 데이터 수집:** WebSocket을 통한 체결가 스트리밍 및 클라이언트 브로드캐스팅.
*   **AI 기반 종목 분석:** Gemini를 활용하여 종목, 시장 동향, 세력 고갈 등을 분석하고 리포트 생성.
*   **뉴스 크롤링 및 분석:** Naver API 및 증권사 뉴스를 수집하여 분석.
*   **데이터 동기화:** 종목 코드, 테마, 지수 데이터 자동 다운로드 및 파싱
*   **스케줄링:** 장중 주가/순위 데이터 수집 및 정기 뉴스 크롤링.

---

## 2. 프로젝트 실행 방법

### 2.1 사전 요구 사항 (Prerequisites)
*   Node.js (v20 이상 권장)
*   MySQL Database
*   Redis Server
*   Google Gemini CLI 설치 (`gemini` 명령어 사용 가능해야 함)

### 2.2 환경 변수 설정 (.env)
프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정해야 합니다.

```bash
# Database
DATABASE_HOST="localhost"
DATABASE_DATABASE="korea-investment"
DATABASE_USERNAME="nest"
DATABASE_PASSWORD="nest!@#"
DATABASE_PORT="3306"

# 한국투자증권 API 정보
KOREA_INVESTMENT_HOST="https://openapi.koreainvestment.com:9443"
KOREA_INVESTMENT_WEBSOCKET_HOST="ws://ops.koreainvestment.com:21000"
KOREA_INVESTMENT_USER_ID=""
KOREA_INVESTMENT_APP_KEY=""
KOREA_INVESTMENT_APP_SECRET=""
KOREA_INVESTMENT_ADDITIONAL_APP_KEY=""
KOREA_INVESTMENT_ADDITIONAL_APP_SECRET=""

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_MODE="single"

# 스톡 플러스 HOST 정보
STOCK_PLUS_HOST="https://spn.stockplus.com"

NAVER_APP_HOST="https://openapi.naver.com"

# Naver API (Rate Limit 회피를 위한 다중 키 설정)
NAVER_APP_CLIENT_ID=""
NAVER_APP_CLIENT_SECRET=""
NAVER_APP_SEARCH_2_CLIENT_ID=""
NAVER_APP_SEARCH_2_CLIENT_SECRET=""
NAVER_APP_SEARCH_3_CLIENT_ID=""
NAVER_APP_SEARCH_3_CLIENT_SECRET=""

# Google Gemini
GEMINI_CLI_MODEL="gemini-3-flash-preview"

# 슬랙 연동 정보
SLACK_SIGNING_SECRET=""
SLACK_BOT_TOKEN=""
SLACK_APP_TOKEN=""
SLACK_STOCK_CHANNEL_ID=""
SLACK_STOCK_GEMINI_LOG_CHANNEL_ID=""
```

### 2.3 데이터 초기화 스크립트 실행
서버 실행 전, 주식 종목 코드 및 테마 데이터를 한국투자증권 서버로부터 받아와 DB에 구축해야 합니다.

**전체 데이터 동기화 (권장)**
```bash
npm run refresh-stock-codes
```
위 명령어는 아래의 과정을 순차적으로 수행합니다:
1.  `download-stock-files`: `.mst.zip` 파일 다운로드 및 압축 해제
2.  `convert-korea-investment-code`: CP949 인코딩 파일 파싱 및 JSON 변환
3.  `stock-code-migration`: 종목 코드 DB 저장 (KOSPI, KOSDAQ 등)
4.  `theme-migration`: 테마 및 테마-종목 매핑 정보 저장

**개별 스크립트 실행**
필요에 따라 각 단계를 개별적으로 실행할 수 있습니다.
```bash
npm run download-stock-files        # 파일 다운로드
npm run convert-korea-investment-code # 파일 파싱
npm run stock-code-migration        # 종목 코드 마이그레이션
npm run domestic-idx-migration      # 국내 지수 마이그레이션
npm run theme-migration             # 테마 마이그레이션
```

### 2.4 서버 실행
```bash
# 개발 모드 실행
npm run start:dev

# 프로덕션 빌드 및 실행
npm run build
npm run start:prod
```

---

## 3. 핵심 구조 및 아키텍처

### 3.1 디렉토리 구조
```
src/
├── app/
│   ├── controllers/            # REST API 컨트롤러 (13개)
│   ├── gateways/               # WebSocket Gateway
│   ├── modules/                # 비즈니스 로직 모듈
│   │   ├── analysis/           # AI 분석 엔진
│   │   ├── korea-investment-request-api/ # API Rate Limiter
│   │   ├── korea-investment-collector/ # 실시간 데이터 구독/구독 해지
│   │   ├── repositories/       # TypeORM Repositories
│   │   └── crawlers/           # 배치 크롤러
│   └── common/                 # Global Pipes, Guards, Filters
├── modules/               # 최상위 공통 모듈
│   ├── gemini-cli/        # Gemini CLI
│   ├── korea-investment/  # 증권사 API 클라이언트/소켓
│   ├── mcp-server/        # MCP 서버 
│   ├── metadata-scanner/  # Metadata Scanner (데코레이터 처리용)
│   ├── naver/             # Naver API
│   ├── queue/             # BullMQ 설정
│   ├── redis/             # Redis 서비스
│   ├── slack/             # 슬랙
│   └── stock-plus/        # 스톡 플러스 뉴스 수집
└── scripts/               # 데이터 동기화 스크립트
```

### 3.2 API Endpoints (Controllers)
총 13개의 컨트롤러가 정의되어 있습니다.

| Controller | 경로 | 설명 |
|------------|------|------|
| **Stock** | `/v1/stocks` | 종목 상세 조회, 가격 정보, 구독 관리 |
| **Analysis** | `/v1/analysis` | AI 분석 요청 및 리포트 조회 |
| **News** | `/v1/news` | 종목/시장 뉴스 조회 |
| **Account** | `/v1/accounts` | 계좌 정보 관리 |
| **FavoriteStock** | `/v1/favorite-stocks` | 관심 종목 관리 |
| **StockInvestor** | `/v1/stocks/:stockCode/investors` | 투자자별(외인/기관) 동향 |
| **Keyword** | `/v1/keywords` | 뉴스/검색 키워드 관리 |
| **Theme** | `/v1/themes` | 테마별 종목 조회 |
| **Market** | `/v1/markets` | 시장 지수 및 정보 |
| **Other** | - | LatestStockRank, AccountStock, AccountStockGroup 등 |

---

### 3.3 주요 모듈 상세 (Modules)

#### APP Modules (`src/app/modules`)

*   **Analysis Module (AI 분석)**
    *   **역할:** 종목, 시장, 세력 고갈 분석 수행 및 Gemini AI 기반 리포트 생성.
    *   **구조:** `AiAnalyzerService`가 진입점이며, **Adapter Pattern**을 사용하여 분석 유형(Stock, Market, Exhaustion)에 따라 로직을 분기합니다.
    *   **최적화:** **BullMQ Flow**를 활용하여 `RequestAnalysis`(부모) -> `PromptToGeminiCli`(자식) 구조로 작업을 분해하고, Gemini CLI를 병렬(Concurrency: 2)로 호출하여 분석 속도를 극대화했습니다.

*   **Korea Investment Collector Module (실시간 수집)**
    *   **역할:** 한국투자증권 WebSocket과 연결하여 실시간 체결가(H0UNCNT0) 데이터를 수신하고 클라이언트에 전송합니다.
    *   **구조:** **Event-Driven Architecture**를 적용하여, 수신된 패킷을 `Pipe`로 변환 후 `EventEmitter`를 통해 Gateway로 전달, 클라이언트에게 브로드캐스트합니다.
    *   **관리:** `KoreaInvestmentCollectorSocket`이 구독 요청과 연결 상태를 관리하며, 구독 작업은 Queue를 통해 비동기로 처리됩니다.

*   **Crawlers Module (배치 데이터 수집)**
    *   **역할:** 주가, 뉴스, 순위, 지수 데이터 등을 정기적으로 수집합니다.
    *   **구조:** **Strategy Pattern**을 적용하여 뉴스 크롤링 소스(종목별, 키워드별)에 따른 전략을 캡슐화했습니다.
    *   **기능:** `StockCrawler`(매시간 주가/투자자), `StockRankCrawler`(거래량/조회수 상위), `NewsCrawler`(Naver/증권사 뉴스) 등이 스케줄링되어 실행됩니다.

*   **Korea Investment Request API Module (Rate Limiting)**
    *   **역할:** 한국투자증권 API의 호출 제한(Rate Limit)을 중앙에서 제어합니다.
    *   **전략:** **Dual Queue System**을 도입하여 실시간성이 중요한 요청은 `Main Queue`(초당 2건), 대량 수집이 필요한 요청은 `Additional Queue`(초당 10건)로 분리하여 운영합니다.

*   **Repositories Module (데이터 접근)**
    *   **역할:** 13개 도메인(Stock, Account, Market 등)에 대한 DB 접근을 담당합니다.
    *   **특징:** **TypeORM**을 기반으로 하며, `SnakeNamingStrategy`를 적용하여 DB의 snake_case 컬럼을 코드의 camelCase 속성과 자동으로 매핑합니다.

죄송합니다. 앞선 답변에서 `src/modules` (인프라 및 외부 연동 계층)의 내부 구성 요소들이 상세히 언급되지 않아 부족함을 느끼셨던 것 같습니다.

문서에 명시된 `src/modules` 하위의 **5개 메인 모듈**과 그 안에 포함된 **세부 컴포넌트(Client, Service, Factory, Pipe 등)**를 빠짐없이 상세하게 나열해 드립니다.

`README.md`의 **3.4 Infrastructure & External Modules (`src/modules`)** 항목을 아래 내용으로 대체하시면 됩니다.

---

#### Common Modules (`src/modules`)

외부 API 연동 및 시스템 전반에서 공통으로 사용되는 인프라 모듈입니다.

*   **Korea Investment Module (`src/modules/korea-investment`)**
    *   한국투자증권 Open API 연동을 위한 핵심 모듈로, 3개의 내부 컴포넌트로 세분화되어 있습니다.
    *   **Quotation Client (`korea-investment-quotation-client`):**
        *   REST API 전용 클라이언트입니다.
        *   주식 현재가(`inquirePrice`), 일별 시세(`inquireDailyPrice`), 투자자 동향(`inquireInvestor`), 업종 지수(`inquireIndexPrice`) 등 30여 개의 시세 조회 메서드를 제공합니다.
    *   **WebSocket Factory (`korea-investment-web-socket`):**
        *   실시간 데이터를 처리하는 반응형 소켓 클라이언트입니다.
        *   **Factory & Observer Pattern:** RxJS Subject를 사용하여 메시지 스트림을 생성하고 관리합니다.
        *   **Lifecycle 관리:** 연결(`CONNECT`), 구독(`SUBSCRIBE`), 자동 핑퐁(`PINGPONG`) 로직을 내장하고 있습니다.
        *   **Pipes (데이터 변환기):** 수신된 바이너리 데이터를 가공하는 전용 파이프를 포함합니다.
            *   `KoreaInvestmentWebSocketPipe`: 기본 메시지 파싱.
            *   `TradeStreamPipe`: 주식 체결가(H0UNCNT0) 처리.
            *   `H0unasp0Pipe`: 실시간 호가 처리.
            *   `H0unpgm0Pipe`: 프로그램 매매 정보 처리.
    *   **Helper Service (`korea-investment-helper`):**
        *   인증 토큰(Access Token, WebSocket Key)의 생명주기를 관리합니다.
        *   **Auto-Refresh:** Redis를 활용하여 토큰을 캐싱하고, 만료 시간(TTL)을 계산하여 만료 60초 전 자동으로 갱신합니다.

*   **Gemini CLI Module (`src/modules/gemini-cli`)**
    *   Google Gemini AI 모델을 CLI 환경에서 제어하는 모듈입니다.
    *   **Gemini Cli Service:**
        *   Node.js의 `spawn`을 사용해 `gemini` 프로세스를 실행하고, 표준 입출력(stdin/stdout)을 통해 프롬프트를 전송 및 응답을 수집합니다.
    *   **Process Manager Service:**
        *   생성된 AI 프로세스의 생명주기를 추적합니다.
        *   메모리 누수를 방지하기 위해 모듈 종료(`onModuleDestroy`) 시 활성화된 모든 프로세스를 강제로 정리(Kill)합니다.

*   **Naver Module (`src/modules/naver`)**
    *   네이버 뉴스 검색 API 연동을 담당합니다.
    *   **Api Client Factory:**
        *   API 호출 한도(Rate Limit) 제한을 극복하기 위해 **Factory Pattern**을 적용했습니다.
        *   3개의 애플리케이션 키(`SEARCH1`, `SEARCH2`, `SEARCH3`)를 순환(Rotation)하며 클라이언트를 생성합니다.
    *   **Api Client:**
        *   실제 HTTP 요청을 수행하며, 정확도순(`sim`) 또는 날짜순(`date`) 정렬 옵션을 통해 뉴스 데이터를 수집합니다.

*   **Queue Module (`src/modules/queue`)**
    *   BullMQ를 기반으로 한 비동기 작업 처리 인프라입니다.
    *   **Dynamic Module:**
        *   `queue.module.ts`를 통해 애플리케이션 전역에서 큐 설정을 동적으로 주입받습니다.
    *   **Queue Explorer:**
        *   메타데이터 스캐너를 사용하여 `@OnQueueProcessor` 데코레이터가 붙은 메서드를 자동으로 탐색하고 Worker로 등록합니다.
    *   **Decorators:**
        *   `@OnQueueProcessor`: 특정 큐의 작업을 처리할 메서드를 지정하는 커스텀 데코레이터를 제공합니다.

*   **Redis Module (`src/modules/redis`)**
    *   인메모리 데이터 저장소(Redis) 연결 및 유틸리티를 제공합니다.
    *   **Redis Service:**
        *   기본적인 `get`, `set` 외에 `getOrDefaultValue`(조회 실패 시 기본값 반환) 메서드를 제공합니다.
        *   **Distributed Lock:** 다중 서버 환경에서 동시성 제어를 위한 `lock`, `unLock` 기능을 포함합니다.
    *   **Cacheable Decorator:**
        *   **AOP(Aspect Oriented Programming)** 기반의 캐싱 데코레이터입니다.
        *   메서드 위에 선언하여 실행 결과를 Redis에 자동으로 캐싱(TTL 설정 가능)하고, 키 생성 전략을 커스터마이징 할 수 있습니다.