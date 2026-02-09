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

### 3.3 주요 모듈 상세 (Key Modules)

#### **Analysis Module (AI 분석)**
*   **AiAnalyzerService:** 분석 요청의 진입점. Adapter Pattern을 사용하여 분석 유형(종목/시장/고갈)에 따라 로직을 분기합니다.
*   **BullMQ Flow:** `RequestAnalysis`(부모) -> `PromptToGeminiCli`(자식, 병렬 처리) 구조로, Gemini CLI를 병렬로 호출하여 분석 속도를 최적화합니다.

#### **Korea Investment Collector Module (실시간 수집)**
*   **WebSocket:** 한국투자증권 WebSocket과 연결하여 실시간 체결가(H0UNCNT0) 데이터를 수신합니다.
*   **Event-Driven:** 수신된 데이터는 Pipe를 통해 변환된 후 `EventEmitter`를 통해 Gateway로 전달되어 클라이언트에게 브로드캐스트됩니다.

#### **Crawlers Module (배치 작업)**
*   `StockCrawler`: 주가 및 투자자 정보 (매시간)
*   `StockRankCrawler`: 거래량/조회수 상위 종목
*   `NewsCrawler`: 뉴스 데이터 수집 (Strategy Pattern 적용)
*   `KoreaInvestmentCalendarCrawler`: 휴장일 정보

#### **Korea Investment Request API Module (Rate Limiting)**
*   API 호출 제한을 관리하기 위해 Main Queue(초당 2건)와 Additional Queue(초당 10건)를 분리하여 운영합니다.
* 