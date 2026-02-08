# Korea Investment 프로젝트 구조 분석 리포트

**분석 일시**: 2026년 2월 8일 16:06:08
**분석 대상**: Korea Investment 주식 분석 시스템
**프레임워크**: NestJS 11.x (TypeScript)

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [HTTP 라이프사이클](#2-http-라이프사이클)
3. [APP Module 분석](#3-app-module-분석)
4. [공통 Module 분석](#4-공통-module-분석)
5. [Script 분석](#5-script-분석)
6. [아키텍처 및 설계 패턴](#6-아키텍처-및-설계-패턴)
7. [핵심 데이터 흐름](#7-핵심-데이터-흐름)
8. [개선 제안 사항](#8-개선-제안-사항)

---

## 1. 프로젝트 개요

### 1.1 시스템 목적

한국투자증권 API와 Google Gemini AI를 활용한 **실시간 주식 분석 및 정보 제공 시스템**입니다.

### 1.2 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **Framework** | NestJS 11.x (TypeScript) |
| **Database** | MySQL (TypeORM with SnakeNamingStrategy) |
| **Cache/Queue** | Redis + BullMQ |
| **WebSocket** | Socket.io (실시간 체결가) + Korea Investment WebSocket |
| **AI** | Google Gemini CLI (종목/시장 분석) |
| **External APIs** | 한국투자증권 API, Naver 뉴스 API |
| **Port** | 3100 |

### 1.3 주요 기능

1. **실시간 주식 데이터 수집**: WebSocket을 통한 체결가 스트리밍
2. **AI 기반 종목 분석**: Gemini를 활용한 종목/시장/고갈 추적 분석
3. **뉴스 크롤링 및 분석**: Naver API + 한국투자증권 뉴스
4. **스케줄 데이터 수집**: 투자자 정보, 지수, 순위 등
5. **종목 코드 동기화**: 자동 다운로드 및 파싱 시스템

---

## 2. HTTP 라이프사이클

### 2.1 전체 요청 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                       Client Request                             │
│                  (예: GET /v1/stocks/005930)                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. Global Pipes (main.ts)                                        │
│    - ValidationPipe (transform: true)                            │
│    - DTO 자동 검증                                               │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Middleware Layer                                              │
│    ▶ StockLoaderMiddleware                                       │
│      - req.params.stockCode 추출                                 │
│      - StockService.getStock(stockCode) 호출                     │
│      - req['stock'] = Stock 엔티티 저장                          │
│      - 적용 경로:                                                │
│        • v1/stocks/:stockCode/*                                  │
│        • v1/favorite-stocks/:stockCode                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Guard Layer                                                   │
│    ▶ ExistingStockGuard (@UseGuards 데코레이터로 적용)          │
│      - req['stock'] 존재 여부 검증                               │
│      - 없으면 NotFoundException 발생                             │
│      - 적용처: StockController, FavoriteStockController 등       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Controller Layer (13개 컨트롤러)                              │
│    ▶ StockController, AnalysisController, NewsController 등      │
│      - Route Handler 실행                                        │
│      - Service 계층 호출                                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Service Layer                                                 │
│    ▶ StockService, AiAnalyzerService 등                         │
│      - 비즈니스 로직 처리                                        │
│      - Repository 호출                                           │
│      - 외부 API 통합                                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Repository Layer (TypeORM)                                    │
│    ▶ Repository<Stock>, Repository<News> 등                     │
│      - MySQL 쿼리 실행                                           │
│      - Entity 반환                                               │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Response 생성 또는 Exception Filter                           │
│    ▶ 성공: JSON 응답                                             │
│    ▶ 실패: HttpDefaultException (Global Filter)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 주요 컴포넌트

#### Middleware
- **StockLoaderMiddleware** (`src/app/common/middlewares/stock-loader.middleware.ts`)
    - URL에서 `stockCode` 추출 후 Stock 엔티티 사전 로드
    - `req['stock']`에 저장하여 Guard/Controller에서 재사용
    - 적용 경로: `v1/stocks/:stockCode/*`, `v1/favorite-stocks/:stockCode`

#### Guard
- **ExistingStockGuard** (`src/app/common/guards/existing-stock.guard.ts`)
    - Middleware에서 로드된 `req['stock']` 존재 여부 검증
    - 없으면 `NotFoundException` 발생
    - 사용처: StockController, StockInvestorController, FavoriteStockController

#### Global Exception Filter
- **HttpDefaultException** (`src/app/common/exceptions/http-default.exception.ts`)
    - 모든 `HttpException`을 표준 JSON 형식으로 변환
    - 응답 포맷:
      ```json
      {
        "statusCode": 404,
        "timestamp": "2026-02-08T...",
        "path": "/v1/stocks/INVALID",
        "message": "Stock not found"
      }
      ```

#### Controller (13개)
| Controller | 경로 | 주요 기능 |
|-----------|------|----------|
| **StockController** | `/v1/stocks` | 종목 조회, 가격, 구독/해제 |
| **AnalysisController** | `/v1/analysis` | AI 분석 요청/조회 |
| **NewsController** | `/v1/news` | 뉴스 조회 |
| **AccountController** | `/v1/accounts` | 계정 정보 |
| **FavoriteStockController** | `/v1/favorite-stocks` | 즐겨찾기 관리 |
| **StockInvestorController** | `/v1/stocks/:stockCode/investors` | 투자자 동향 |
| **KeywordController** | `/v1/keywords` | 키워드 관리 |
| **ThemeController** | `/v1/themes` | 테마 조회 |
| **MarketController** | `/v1/markets` | 시장 정보 |
| 기타 | - | LatestStockRank, AccountStock 등 |

### 2.3 주요 처리 시나리오

#### 종목 조회 성공
```
GET /v1/stocks/005930
  → StockLoaderMiddleware (Stock 조회)
  → ExistingStockGuard (검증)
  → StockController.getStock()
  → StockService.getStock()
  → Repository.findOne()
  → HTTP 200 OK
```

#### AI 분석 요청
```
POST /v1/analysis/reports/Stock/005930
  → AnalysisController.requestAIAnalysis()
  → AiAnalyzerService.requestAnalysis()
  → FlowProducer.add() (BullMQ Job 생성)
    ├─ RequestAnalysis (부모 Job)
    └─ PromptToGeminiCli × 3 (자식 Job, 병렬)
  → HTTP 202 Accepted (즉시 반환)

백그라운드 처리:
  → AiAnalyzerProcessor.processPromptToGeminiCli()
  → GeminiCliService.requestPrompt()
  → AiAnalysisReportService.addReport()
```

#### 실시간 체결가 구독
```
POST /v1/stocks/005930/subscribe
  → KoreaInvestmentCollectorSocket.subscribe()
  → Queue Job 등록 (SubscribeStock)
  → Processor.processSubscribeStock()
    ├─ WebSocket 토큰 획득
    └─ 구독 메시지 전송 (H0UNCNT0)
  → HTTP 204 No Content

실시간 데이터:
  Korea Investment Server → WebSocket
  → KoreaInvestmentWsFactory (파싱)
  → Pipe Transform
  → EventEmitter.emit(MessagePublishedToGateway)
  → KoreaInvestmentBeGateway
  → WebSocket 클라이언트에게 'realtime-data' 브로드캐스트
```

---

## 3. APP Module 분석

### 3.1 모듈 구조 개요

```
src/app/modules/
├── analysis/                     # AI 분석 엔진
│   ├── ai-analyzer/              # Gemini 분석 메인 모듈
│   └── analyzer/                 # 점수 계산 모듈
├── korea-investment-collector/   # 실시간 데이터 수집
├── repositories/                 # 데이터 접근 계층 (13개 도메인)
├── crawlers/                     # 배치 크롤러 (5개)
├── korea-investment-request-api/ # API Rate Limiting
└── app-services/                 # 공통 비즈니스 서비스
```

### 3.2 Analysis Module

#### 핵심 서비스
- **AiAnalyzerService**: AI 분석 요청의 진입점
    - Adapter Pattern으로 분석 유형별 로직 캡슐화
    - BullMQ FlowProducer로 비동기 처리
- **AiAnalyzerProcessor**: Queue Worker
    - `@OnQueueProcessor(PromptToGeminiCli, concurrency: 2)`: Gemini CLI 호출
    - `@OnQueueProcessor(RequestAnalysis)`: 자식 Job 결과 수집 후 Report 저장
- **AnalyzerService**: 투자자 점수 계산 (세력 설거지 위험도)

#### Adapter 구조
```typescript
interface BaseAnalysisAdapter<T> {
  collectData(target?: string): Promise<T>;
  transformToTitle(data?: T): string;
  transformToFlowChildJob(data?: T): FlowChildJob;
}

// 구현체
- StockAnalyzerAdapter: 종목 분석
- MarketAnalyzerAdapter: 시장 분석
- ExhaustionTraceAnalyzerAdapter: 고갈 추적 분석
```

#### 처리 흐름
```
1. Adapter 선택 (Factory Pattern)
2. 데이터 수집 (종목, 투자자, 뉴스 등)
3. FlowProducer Job 생성
   ├─ 부모: RequestAnalysis
   └─ 자식 × 3: PromptToGeminiCli (병렬)
4. Gemini CLI 호출 (concurrency: 2)
5. 결과 수집 및 AiAnalysisReport 저장
```

### 3.3 Korea Investment Collector Module

#### 역할
WebSocket을 통한 실시간 체결가 수집 (Event-Driven Architecture)

#### 핵심 서비스
- **KoreaInvestmentCollectorSocket**: WebSocket 통신 관리
    - `subscribe(stockCode)`: Queue Job 등록
    - `send(payload)`: 메시지 전송
    - `subscribeStockMap`: 구독 중인 종목 관리

- **KoreaInvestmentCollectorProcessor**: Queue Worker
    - `@OnQueueProcessor(SubscribeStock, concurrency: 1)`
    - WebSocket 토큰 획득 → 구독 메시지 전송 (H0UNCNT0, H0UNPGM0)
    - 200ms 간격 메시지 전송

- **KoreaInvestmentCollectorListener**: Event 구독/발행
    - `@OnEvent(MessageReceivedFromKoreaInvestment)`: WebSocket 메시지 수신
    - Pipe Transform 후 `MessagePublishedToGateway` 이벤트 발행
    - Gateway가 WebSocket 클라이언트에게 브로드캐스트

### 3.4 Repositories Module

#### 전체 Repository 목록 (13개 도메인)

**Core Repositories**:
- StockModule, StockInvestorModule, NewsModule, AiAnalysisReportModule

**Account Repositories**:
- AccountModule, AccountStockGroupModule, FavoriteStockModule

**Market Data Repositories**:
- MarketIndexModule, DomesticIndexModule, TradingVolumeRankModule, MostViewedStockModule

**Auxiliary Repositories**:
- KeywordModule, ThemeModule, KoreaInvestmentCalendarModule

#### TypeORM 설정
- **Naming**: SnakeNamingStrategy (camelCase → snake_case)
- **Timezone**: Z (UTC)
- **Auto Load**: true
- **Decimal**: true

### 3.5 Crawlers Module

#### 크롤러 목록 (5개)

| 크롤러 | 역할 | Cron |
|--------|------|------|
| **StockCrawler** | 종목 가격 및 투자자 정보 | 주중 09:00-15:00 매시간 |
| **StockRankCrawler** | HTS Top View, 거래량 순위 | 주중 특정 시간 |
| **NewsCrawler** | 뉴스 데이터 (Strategy Pattern) | 스케줄 설정됨 |
| **KoreaInvestmentCalendarCrawler** | 영업일 정보 | - |
| **KoreaInvestmentAccountCrawler** | 계정 잔고 | - |
| **KoreaInvestmentIndexCrawler** | 시장 지수 (KOSPI/KOSDAQ) | - |

#### 특징
- BullMQ Job Flow로 복잡한 작업 분해
- Transformer Pattern으로 DTO 변환
- Strategy Pattern으로 뉴스 크롤링 전략 캡슐화

### 3.6 Korea Investment Request API Module

#### 역할
한국투자증권 API Rate Limiting (2개 계정 Queue 관리)

#### 구조
```
korea-investment-request-api/
├── korea-investment-main-request-api/       # 메인 계정
└── korea-investment-additional-request-api/ # 추가 계정
```

#### Rate Limiting 전략
- Main Queue: 초당 최대 2건 (실시간 조회 우선)
- Additional Queue: 초당 최대 10건 (배치 크롤링 우선)

---

## 4. 공통 Module 분석

### 4.1 Korea Investment Module

#### 구조
```
src/modules/korea-investment/
├── korea-investment-quotation-client/   # REST API 클라이언트
├── korea-investment-web-socket/         # WebSocket Factory
│   └── pipes/                           # 데이터 변환 파이프
└── korea-investment-helper/             # 토큰 관리
```

#### Korea Investment Quotation Client
- 30개 이상의 시세 관련 API 메서드
- 주요 API:
    - `inquirePrice()`: 주식 현재가
    - `inquireDailyPrice()`: 일자별 시세
    - `inquireInvestor()`: 투자자 동향
    - `inquireIndexPrice()`: 국내 업종 지수

#### WebSocket Factory
- Factory Pattern + Observer Pattern
- RxJS Subject로 반응형 메시지 스트리밍
- 이벤트 처리:
    - `PINGPONG`: 자동 pong 응답
    - `SUBSCRIBE SUCCESS`: 구독 확인
    - 바이너리 데이터: Pipe Transform

#### WebSocket Pipes
- **Base Pipe**: `KoreaInvestmentWebSocketPipe` (기본 파싱)
- **Specialized Pipes**:
    - `TradeStreamPipe`: H0UNCNT0 (국내주식 체결가)
    - `H0unasp0Pipe`: 실시간 호가
    - `H0unpgm0Pipe`: 프로그램 매매

#### Helper Service
- API 토큰 자동 관리 (Redis 캐싱)
- WebSocket 토큰 관리 (TTL: 24시간, Buffer: 1시간)
- 토큰 갱신 전략:
  ```typescript
  // Redis 캐시 확인 → 없으면 발급 → TTL 계산 → 캐싱 (만료 60초 전)
  ```

### 4.2 Gemini CLI Module

#### 구조
```
src/modules/gemini-cli/
├── gemini-cli.service.ts                # Gemini CLI 래퍼
└── gemini-cli-process-manager.service.ts # 프로세스 생명주기 관리
```

#### Gemini CLI Service
```typescript
requestPrompt(prompt: string, options?: GeminiCliOptions): Promise<string>
  → spawn('gemini', ['--model', model])
  → stdin: 프롬프트 전송
  → stdout: AI 응답 수집
  → close: 프로세스 정리
```

#### Process Manager
- 활성 Gemini 프로세스 추적 (Set)
- `onModuleDestroy()`: 모듈 종료 시 모든 프로세스 자동 정리
- 메모리 누수 방지

### 4.3 Naver Module

#### 구조
```
src/modules/naver/
└── naver-api/
    ├── naver-api-client.factory.ts  # Factory Pattern
    └── naver-api.client.ts          # API Client
```

#### Naver API Client Factory
- 3개 앱 키 로테이션 (search1, search2, search3)
- Rate Limit 회피 목적
- 각 요청마다 다른 앱 키 선택 가능

#### 뉴스 검색 API
```typescript
getNews({
  query: string,      // 검색어
  display: number,    // 결과 개수 (최대 100)
  start: number,      // 시작 위치
  sort: 'date' | 'sim' // 정렬 기준
})
```

### 4.4 Queue Module

#### 구조
```
src/modules/queue/
├── queue.module.ts       # Dynamic Module
├── queue.explorer.ts     # 자동 Worker 등록
└── queue.decorator.ts    # @OnQueueProcessor
```

#### Queue Explorer (자동 Worker 등록)
- Metadata Scanner로 `@OnQueueProcessor` 데코레이터 감지
- Reflection 기반 자동 Worker 생성
- `onModuleInit()`에서 모든 Worker 등록

#### Job Flow 처리
```typescript
// 부모 Job
@OnQueueProcessor('RequestAnalysis')
async processAnalysis(job: Job) {
  const childResults = await job.getProgress();
  // 결과 종합
}

// 자식 Job (병렬)
@OnQueueProcessor('PromptToGeminiCli', { concurrency: 3 })
async processPrompt(job: Job) {
  return await geminiCliService.requestPrompt(...);
}
```

### 4.5 Redis Module

#### 구조
```
src/modules/redis/
├── redis.service.ts          # Redis 서비스
└── cacheable.decorator.ts    # AOP 캐싱
```

#### Redis Service
```typescript
// 데이터 저장 (기본 TTL: 60초)
set(key, value, options?: { seconds: number })

// 데이터 조회
get(key)

// 기본값과 함께 조회
getOrDefaultValue<T>(key, defaultValue: T): Promise<T>

// 분산 락
lock(key, options?)
unLock(key)
```

#### Cacheable Decorator (AOP)
```typescript
@Cacheable({
  key: (stockCode: string) => `stock:${stockCode}`,
  ttl: 300, // 5분
})
async getStockInfo(stockCode: string) {
  // 캐시 미스 시 실행
}
```

### 4.6 Common 유틸리티

#### Decorators
- `PreventConcurrentExecution`: 동시 실행 방지 (로컬 메모리)

#### Domains
- `market.ts`: 시장 구분 코드 및 장 시간 판별
  ```typescript
  getMarketDivCodeByDate(date?: Date): MarketDivCode
    // KRX 09:00-15:30
    // NXT 08:00-09:00, 15:30-16:00
  ```

#### Swagger
- `swagger.ts`: API 문서 자동 생성 설정

#### Utils
- `date.ts`: 날짜 포맷 변환
- `sleep.ts`: 비동기 딜레이
- `unique-values.ts`: 배열 중복 제거

---

## 5. Script 분석

### 5.1 전체 데이터 처리 흐름

```
refresh-stock-codes (전체 새로고침)
    ↓
1. download-stock-files (다운로드)
   - 한국투자증권 서버에서 .mst.zip 파일 다운로드
   - scripts/temp/ 디렉토리에 압축 해제
    ↓
2. convert-korea-investment-code (파싱)
   ├─ sector-code-parse (지수 코드)
   ├─ stock-code-parse (종목 코드)
   └─ theme-parse (테마)
   - CP949 인코딩 파싱 → JSON 변환 (src/assets/)
    ↓
3. stock-code-migration (DB 저장)
   - Stock 테이블 truncate
   - JSON → MySQL 저장 (KOSPI, KOSDAQ, Next)
    ↓
4. theme-migration (테마 저장)
   - Theme, ThemeStock 테이블 truncate
   - 테마 데이터 → MySQL 저장
```

### 5.2 다운로드 스크립트 (`scripts/download-stock-files/`)

#### 다운로드 파일 목록
| 파일 | 용도 |
|------|------|
| `idxcode.mst.zip` | 국내 지수 코드 |
| `kospi_code.mst.zip` | KOSPI 종목 |
| `kosdaq_code.mst.zip` | KOSDAQ 종목 |
| `nxt_kospi_code.mst.zip` | KOSPI Next |
| `nxt_kosdaq_code.mst.zip` | KOSDAQ Next |
| `theme_code.mst.zip` | 테마 정보 |
| `nasmst.cod.zip` | 나스닥 종목 |
| `nysmst.cod.zip` | NYSE 종목 |
| `amsmst.cod.zip` | AMEX 종목 |

#### 구현
```typescript
class StockDownloader {
  async download(url, fileName)
    // axios arraybuffer → scripts/temp/*.zip

  unzip(fileName)
    // AdmZip → scripts/temp/*.mst
}
```

### 5.3 파싱 스크립트

#### 공통 Parser Pattern
```typescript
class Parser {
  parse(filePath: string): Array<any> {
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'cp949'); // CP949 디코딩
    return content.split('\n').map(line => this.parseLine(line));
  }

  parseLine(line: string): Array<string> {
    // 파일 형식별로 다르게 구현
  }
}
```

#### Sector Code Parse (지수 코드)
- 파일: `idxcode.mst`
- 구조: `[shortCode(5자)][name(43자)]`
- 출력: `src/assets/idxcode.json`

#### Stock Code Parse (종목 코드)
- 파일: `kospi_code.mst`, `kosdaq_code.mst`, `nxt_*.mst`
- 구조: `[shortCode(9자)][code(12자)][name(가변)][suffix(228자)]`
- 출력: `src/assets/kospi_code.json`, `kosdaq_code.json` 등

#### Theme Parse (테마)
- 파일: `theme_code.mst`
- 구조: `[themeCode(3자)][themeName(가변)][stockCode(10자)]`
- 출력: `src/assets/theme_code.json`
- 특징: 1:N 관계 (하나의 테마에 여러 종목)

#### Overseas Index Parse (해외 지수)
- 파일: `frgn_code.mst` (수동 배치 필요)
- 구조: `[구분코드(1)][심볼(10)][영문명][한글명][메타데이터(14자)]`
- 출력: `src/assets/overseas/frgn_code.json`
- 주의: `refresh-stock-codes` 플로우에 미포함

### 5.4 마이그레이션 스크립트 (`src/migrations/`)

#### 공통 인터페이스
```typescript
interface IMigrator {
  init(): Promise<void>;   // NestJS 컨텍스트 초기화
  up(): Promise<void>;     // 마이그레이션 실행
  down(): Promise<void>;   // 롤백 (미구현)
  close(): Promise<void>;  // 종료
}
```

#### Stock Code Migration
```typescript
async up() {
  await this.truncate();           // Stock 테이블 전체 삭제
  await this.migrationKospi();     // KOSPI 종목 저장
  await this.migrationKosdaq();    // KOSDAQ 종목 저장
  await this.migrationNextTrade(); // Next 플래그 업데이트
}
```

- 배치 처리: 20개씩 chunk + Promise.all
- Upsert 방식: `INSERT ... ON DUPLICATE KEY UPDATE`

#### Theme Migration
```typescript
async up() {
  await this.migration();         // Theme 테이블 저장
  await this.migrationThemeStock(); // ThemeStock 매핑 저장
}
```

- Theme: `uniqBy(themeCode)` 중복 제거
- ThemeStock: 유효한 종목 코드만 필터링

#### Index Migration
```typescript
async up() {
  await this.truncate();   // DomesticIndex 전체 삭제
  await this.migration();  // idxcode.json → DB 저장
}
```

### 5.5 실행 명령어

```bash
# 전체 새로고침
npm run refresh-stock-codes

# 개별 실행
npm run download-stock-files
npm run convert-korea-investment-code
npm run stock-code-migration
npm run domestic-idx-migration
npm run theme-migration
```

### 5.6 주의사항

1. **CP949 인코딩 필수**: 모든 .mst 파일은 CP949 인코딩
2. **실행 순서 중요**: Stock → Theme (의존성)
3. **테이블 truncate**: 기존 데이터 전체 삭제
4. **에러 처리 부족**: catch 구문 없음 (개선 필요)
5. **해외 종목**: 별도 플로우 (수동 실행)

---

## 6. 아키텍처 및 설계 패턴

### 6.1 핵심 설계 패턴

#### 1. Adapter Pattern (AI 분석)
```typescript
interface BaseAnalysisAdapter<T> {
  collectData(target?: string): Promise<T>;
  transformToTitle(data?: T): string;
  transformToFlowChildJob(data?: T): FlowChildJob;
}

// Factory로 런타임 선택
const adapter = adapterFactory.create(reportType);
```

**사용처**: AiAnalyzerService (종목/시장/고갈 분석)

#### 2. Event-Driven Architecture
```typescript
// 발행
EventEmitter.emit(MessageReceivedFromKoreaInvestment, data);

// 구독
@OnEvent(MessageReceivedFromKoreaInvestment)
handleMessage(data) { ... }
```

**사용처**: KoreaInvestmentCollectorModule (WebSocket → Gateway)

#### 3. Job Flow Pattern (BullMQ)
```typescript
FlowProducer.add({
  name: 'ParentJob',
  children: [
    { name: 'ChildJob1', data: {...} },
    { name: 'ChildJob2', data: {...} }
  ]
});
```

**사용처**: AI 분석, 크롤러 (복잡한 작업 분해)

#### 4. Repository Pattern
```typescript
@Injectable()
class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>
  ) {}
}
```

**사용처**: 모든 데이터 접근 계층

#### 5. Factory Pattern
```typescript
// Naver API Client Factory
const client = naverApiClientFactory.create(NaverAppName.SEARCH1);

// Korea Investment WebSocket Factory
const { webSocket, onMessageObservable } = factory.create();
```

**사용처**: Naver, Korea Investment, Adapter

#### 6. Strategy Pattern
```typescript
const strategy = newsCrawlerFactory.create(job);
const results = await strategy.run(job);
```

**사용처**: NewsCrawler (크롤링 전략)

#### 7. Pipe Pattern
```typescript
// Base Pipe → Specialized Pipe
KoreaInvestmentWebSocketPipe → TradeStreamPipe → H0uncnt0Data
```

**사용처**: WebSocket 데이터 변환

#### 8. AOP (Aspect-Oriented Programming)
```typescript
@Cacheable({ key: (id) => `stock:${id}`, ttl: 300 })
async getStock(id) { ... }
```

**사용처**: Redis 캐싱

#### 9. Middleware Pattern
```typescript
StockLoaderMiddleware: 공통 데이터 사전 로드
```

#### 10. Guard Pattern
```typescript
ExistingStockGuard: 요청 전 검증
```

### 6.2 모듈 간 의존성

```
App Module
├─ Analysis Module
│  ├─ GeminiCliModule (외부)
│  ├─ NaverApiModule (외부)
│  ├─ QueueModule (외부)
│  └─ RepositoryModule
│
├─ Korea Investment Collector Module
│  ├─ QueueModule (외부)
│  ├─ RedisModule (외부)
│  ├─ KoreaInvestmentWebSocketModule (외부)
│  └─ StockModule (Repository)
│
├─ Crawler Module
│  ├─ QueueModule (외부)
│  ├─ KoreaInvestmentQuotationClient (외부)
│  ├─ NaverApiModule (외부)
│  └─ RepositoryModule
│
└─ Repository Module (독립)
   └─ TypeOrmModule (외부)
```

### 6.3 레이어 구조

```
┌────────────────────────────────────────┐
│         Presentation Layer              │
│  Controllers (13개), Gateways (1개)     │
└────────────────┬───────────────────────┘
                 │
┌────────────────┴───────────────────────┐
│          Service Layer                  │
│  비즈니스 로직, Adapter, Processor      │
└────────────────┬───────────────────────┘
                 │
┌────────────────┴───────────────────────┐
│         Repository Layer                │
│  TypeORM Repository (15+)               │
└────────────────┬───────────────────────┘
                 │
┌────────────────┴───────────────────────┐
│         Infrastructure Layer            │
│  MySQL, Redis, BullMQ, WebSocket        │
└────────────────────────────────────────┘
```

---

## 7. 핵심 데이터 흐름

### 7.1 종목 검색
```
GET /v1/stocks/domestics
  → StockController.getStocks()
  → StockService.getStocks()
  → Repository.find()
  → MySQL 조회
  → JSON 응답
```

### 7.2 AI 분석 요청
```
POST /v1/analysis/reports/Stock/005930
  ↓
1. AnalysisController.requestAIAnalysis()
  ↓
2. AiAnalyzerService.requestAnalysis()
   ├─ StockAnalyzerAdapter.collectData('005930')
   │  ├─ Stock 정보 (DB)
   │  ├─ 투자자 정보 (Korea Investment API)
   │  ├─ 뉴스 정보 (DB + Naver API)
   │  └─ 이슈 데이터 종합
   └─ FlowProducer.add() - BullMQ Job 생성
      ├─ RequestAnalysis (부모)
      └─ PromptToGeminiCli × 3 (자식, 병렬)
         ├─ 종목 이슈 분석
         ├─ 뉴스 분석
         └─ 세력 설계 분석
  ↓
3. HTTP 202 Accepted (즉시 반환)
  ↓
4. Background Processing (Queue Worker)
   ├─ AiAnalyzerProcessor.promptToGeminiCli() [concurrency: 2]
   │  └─ GeminiCliService.requestPrompt() → Gemini CLI 호출
   └─ AiAnalyzerProcessor.requestAnalysis()
      ├─ 자식 Job 결과 수집
      └─ AiAnalysisReportService.addReport()
```

### 7.3 실시간 체결가
```
POST /v1/stocks/005930/subscribe
  ↓
1. StockController.subscribe()
  ↓
2. KoreaInvestmentCollectorSocket.subscribe()
   └─ Queue Job 등록 (SubscribeStock)
  ↓
3. KoreaInvestmentCollectorProcessor.processSubscribeStock()
   ├─ WebSocket 토큰 획득
   └─ 구독 메시지 전송 (H0UNCNT0, H0UNPGM0)
  ↓
4. HTTP 204 No Content
  ↓
5. Korea Investment Server → 실시간 체결가 브로드캐스트
  ↓
6. KoreaInvestmentWsFactory (수신)
   ├─ 바이너리 데이터 파싱
   ├─ Pipe Transform (tradeId별)
   └─ TransformResult 발행
  ↓
7. KoreaInvestmentCollectorListener
   ├─ @OnEvent(MessageReceivedFromKoreaInvestment)
   ├─ Pipe.transform() (데이터 변환)
   └─ EventEmitter.emit(MessagePublishedToGateway)
  ↓
8. KoreaInvestmentBeGateway
   └─ WebSocket 클라이언트에게 'realtime-data' 브로드캐스트
```

### 7.4 뉴스 크롤링
```
@Cron('0 9-15 * * 1-5')
  ↓
1. NewsCrawlerScheduler
   └─ FlowProducer.add(RequestCrawlingNews)
  ↓
2. NewsCrawlerProcessor.processNewsCrawling()
   ├─ NewsCrawlerFactory.create(job) → Strategy 선택
   │  ├─ StockNewsStrategy
   │  └─ KeywordNewsStrategy
   └─ Strategy.run(job)
      ├─ Naver API 호출
      └─ NewsService.upsert() (배치 50개씩)
```

### 7.5 종목 순위 크롤링
```
@Cron('0 9-15 * * 1-5')
  ↓
1. StockRankCrawlerScheduler
   └─ FlowProducer.add(RequestHtsTopViews)
  ↓
2. StockRankCrawlerProcessor.processRequestHtsTopViews()
   ├─ 한국투자증권 API 호출 (HTS Top View)
   └─ FlowProducer.add(RequestPopulatedHtsTopView)
      └─ 자식 Job: 복수 종목 가격 조회
  ↓
3. StockRankCrawlerProcessor.processRequestPopulatedHtsTopView()
   ├─ 자식 Job 결과 수집 (가격 정보)
   ├─ MostViewedStockTransformer.transform()
   └─ MostViewedStockService.upsert()
```

---

## 부록: 주요 파일 및 디렉토리

### 프로젝트 루트
```
korea-investment/
├── src/
│   ├── app/
│   │   ├── app.module.ts                    # 루트 모듈
│   │   ├── configuration.ts                 # 환경 설정
│   │   ├── controllers/                     # REST API (13개)
│   │   ├── gateways/                        # WebSocket Gateway
│   │   ├── common/                          # Guards, Middleware, Exceptions
│   │   └── modules/                         # 비즈니스 로직
│   │       ├── analysis/                    # AI 분석
│   │       ├── korea-investment-collector/  # 실시간 수집
│   │       ├── repositories/                # 데이터 접근
│   │       ├── crawlers/                    # 배치 크롤러
│   │       └── korea-investment-request-api/ # Rate Limiting
│   ├── modules/                             # 기반 기술
│   │   ├── korea-investment/                # 한국투자증권 API
│   │   ├── gemini-cli/                      # Gemini CLI
│   │   ├── naver/                           # Naver API
│   │   ├── queue/                           # BullMQ
│   │   └── redis/                           # Redis
│   ├── common/                              # 공용 유틸리티
│   ├── assets/                              # JSON 데이터
│   └── migrations/                          # DB 마이그레이션
├── scripts/                                 # 데이터 동기화
│   ├── download-stock-files/
│   ├── sector-code-parse/
│   ├── stock-code-parse/
│   ├── theme-parse/
│   └── overseas-index-code-parse/
├── .env                                     # 환경 변수 (src/app/env/.env)
├── package.json                             # 의존성 및 스크립트
└── tsconfig.json                            # TypeScript 설정
```

### 환경 변수
```
# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=
MYSQL_DATABASE=korea_investment

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Korea Investment API
KI_API_KEY=your_key
KI_SECRET_KEY=your_secret

# Naver API (3개 앱 키)
NAVER_APP_SEARCH1_ID=
NAVER_APP_SEARCH1_SECRET=
NAVER_APP_SEARCH2_ID=
NAVER_APP_SEARCH2_SECRET=
NAVER_APP_SEARCH3_ID=
NAVER_APP_SEARCH3_SECRET=

# Google Gemini
GOOGLE_API_KEY=your_key

# Server
PORT=3100
NODE_ENV=development
```
