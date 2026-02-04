# Korea Investment 프로젝트 구조 분석 리포트

**분석 일시**: 2026년 2월 4일 21:18:08
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
HTTP Request
    ↓
1. NestJS Platform (Express/Fastify)
    ↓
2. Global Pipes (ValidationPipe)
    - DTO 자동 검증 (class-validator)
    - 타입 변환 (transform: true)
    ↓
3. Guards (@UseGuards 적용 시)
    - ExistingStockGuard: 종목 코드 검증
    ↓
4. Controller Method Execution
    - @Param, @Query, @Body 파라미터 추출
    ↓
5. Service Layer
    - 비즈니스 로직 처리
    - Repository/외부 API 호출
    ↓
6. Repository Layer (TypeORM)
    - Query 빌드 및 MySQL 실행
    ↓
7. Response Transformation
    - Entity → DTO 변환
    ↓
Response Return
```

### 2.2 Guard 분석

#### ExistingStockGuard

**위치**: `src/app/common/guards/existing-stock.guard.ts`

**역할**: 종목 코드 검증
- stockCode 파라미터 존재 여부 확인
- DB에서 해당 종목 실제 존재 여부 확인
- 존재하지 않으면 `NotFoundException` 발생

**적용 범위**:
- `StockController`: 종목별 가격 조회, 구독/해제
- `StockInvestorController`: 투자자 정보 조회

**구현**:
```typescript
@Injectable()
export class ExistingStockGuard implements CanActivate {
    constructor(private readonly stockService: StockService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const stockCode = request.params.stockCode;

        if (!stockCode) return true;

        const exists = await this.stockService.existsStock(stockCode);
        if (!exists) {
            throw new NotFoundException(`Stock not found: ${stockCode}`);
        }
        return true;
    }
}
```

### 2.3 Controller 분석

프로젝트에는 총 **13개의 REST API Controller**가 존재합니다:

| Controller | 경로 | 주요 기능 |
|-----------|------|----------|
| **MarketController** | `/v1/market` | 시장 정보 조회 |
| **MarketIndexController** | `/v1/market/indices` | 지수 정보 조회 |
| **AccountController** | `/v1/accounts` | 계정 관리 |
| **AccountStockController** | `/v1/accounts/:accountId/stocks` | 계정별 종목 관리 |
| **FavoriteStockController** | `/v1/favorites` | 관심 종목 관리 |
| **StockController** | `/v1/stocks` | 종목 조회/검색/구독 |
| **StockInvestorController** | `/v1/stocks/:stockCode/investors` | 투자자 정보 |
| **KeywordController** | `/v1/keywords` | 키워드 관리 |
| **KeywordGroupController** | `/v1/keyword-groups` | 키워드 그룹 관리 |
| **ThemeController** | `/v1/themes` | 테마 조회 |
| **NewsController** | `/v1/news` | 뉴스 조회 |
| **LatestStockRankController** | `/v1/latest-stock-rank` | 종목 순위 조회 |
| **AnalysisController** | `/v1/analysis` | AI 분석 요청/조회 |

### 2.4 주요 엔드포인트 예시

#### 종목 검색
```
GET /v1/stocks/search/삼성전자

흐름:
1. StockController.searchStocks()
2. ValidationPipe (파라미터 검증)
3. StockService.getStocks({ name: '삼성전자' })
4. Repository.find({ name: Like('%삼성전자%') })
5. Response: { "data": [{ "code": "005930", "name": "삼성전자" }] }
```

#### 종목 구독 (Guard 적용)
```
POST /v1/stocks/005930/subscribe

흐름:
1. Router → StockController.subscribe()
2. ExistingStockGuard.canActivate()
   - StockService.existsStock('005930') → DB 조회
   - 존재하면 true 반환, 없으면 NotFoundException
3. ValidationPipe
4. KoreaInvestmentCollectorSocket.subscribe('005930')
   - BullMQ Job 생성
5. Response: 204 No Content
```

#### AI 분석 요청
```
POST /v1/analysis/reports/Stock/005930

흐름:
1. AnalysisController.requestAIAnalysis()
2. AiAnalyzerService.requestAnalysis()
   - StockAnalyzerAdapter.collectData('005930')
   - FlowProducer.add() → BullMQ Job 생성
3. Response: 204 No Content (즉시 반환)

[백그라운드]
4. Worker: PromptToGeminiCli (3개 병렬 실행)
5. Worker: RequestAnalysis (결과 취합)
6. AiAnalysisReportService.addReport() → DB 저장
```

### 2.5 특징

1. **Middleware 미사용**: 전역 ValidationPipe로 충분히 대체
2. **단일 Guard**: `ExistingStockGuard`로 종목 검증 통일
3. **명확한 계층 구조**: Controller → Service → Repository
4. **비동기 처리**: 긴 작업은 BullMQ Queue로 분리
5. **TypeORM 활용**: Repository Pattern으로 DB 접근 추상화

---

## 3. APP Module 분석

### 3.1 전체 모듈 구조

```
src/app/modules/
├── analysis/                          # AI 분석 및 점수 계산
│   ├── ai-analyzer/                   # Google Gemini 기반 AI 분석
│   └── analyzer/                      # 투자자 점수 계산
├── app-services/                      # 애플리케이션 서비스 레이어
│   ├── news-service/                  # 뉴스 통합 서비스
│   └── stock-investor/                # 종목 투자자 정보 서비스
├── crawlers/                          # 스케줄 기반 데이터 크롤러
│   ├── korea-investment-crawler/      # 한국투자증권 API 크롤러
│   ├── news-crawler/                  # 뉴스 크롤러
│   ├── stock-crawler/                 # 종목 정보 크롤러
│   └── stock-rank-crawler/            # 종목 순위 크롤러
├── korea-investment-collector/        # 실시간 데이터 수집
├── korea-investment-request-api/      # API Rate Limiting
└── repositories/                      # 데이터 접근 계층 (13개 도메인)
```

### 3.2 주요 모듈 상세 분석

#### 3.2.1 ai-analyzer (AI 분석 모듈)

**역할**: Google Gemini CLI를 활용한 종목/시장 AI 분석 및 보고서 생성

**핵심 구조**:
```
ai-analyzer/
├── ai-analyzer.service.ts             # 진입점 (API 요청 → Queue Job 생성)
├── ai-analyzer.processor.ts           # Queue 처리 (Gemini CLI 호출)
├── ai-analyzer-adapter.factory.ts     # Adapter 패턴 팩토리
└── analyzers/
    ├── stock-analyzer/                # 종목 분석 (3개 병렬 프롬프트)
    ├── market-analyzer/               # 시장 분석
    └── exhaustion-trace-analyzer/     # 고갈 분석
```

**데이터 흐름**:
```
API Request → AiAnalyzerService
    ↓
1. Adapter.collectData() - 데이터 수집
   ├─ Stock 정보 (DB)
   ├─ 투자자 정보 (Korea Investment API)
   ├─ 뉴스 정보 (DB + Naver API)
   └─ 이슈 데이터 종합
    ↓
2. FlowProducer.add() - BullMQ Job 생성
   └─ RequestAnalysis (부모)
       └─ PromptToGeminiCli (3개 자식, concurrency: 3)
    ↓
3. AiAnalyzerProcessor (Worker)
   ├─ processPromptToGeminiCli() - 각 프롬프트 처리
   └─ processRequestAnalysis() - 결과 수집 및 저장
```

**핵심 패턴**:
- **Adapter Pattern**: 분석 유형별 데이터 수집 로직 캡슐화
- **Transformer Pattern**: 데이터 → 프롬프트 문자열 변환
- **Job Flow Pattern**: 부모-자식 Job 구조로 병렬 처리

#### 3.2.2 korea-investment-collector (실시간 데이터 수집)

**역할**: 한국투자증권 WebSocket을 통한 실시간 주식 체결가 데이터 수집 및 브로드캐스트

**핵심 구조**:
```
korea-investment-collector/
├── korea-investment-collector.socket.ts    # WebSocket 연결 관리
├── korea-investment-collector.processor.ts # 구독 요청 처리
└── korea-investment-collector.listener.ts  # 이벤트 리스너
```

**데이터 흐름**:
```
API Request (POST /v1/stocks/005930/subscribe)
    ↓
KoreaInvestmentCollectorSocket.subscribe() → Queue Job
    ↓
Processor.processSubscribeStock()
    ├─ WebSocket 토큰 획득
    ├─ 구독 메시지 생성 (H0UNCNT0/H0STCNT0)
    └─ socket.send(subscribeMessage)
    ↓
Korea Investment Server → 실시간 체결가 브로드캐스트
    ↓
KoreaInvestmentWsFactory.onMessageObservable (수신)
    ├─ 바이너리 데이터 파싱 (61개 필드)
    └─ TransformResult 발행
    ↓
EventEmitter.emit(MessageReceivedFromKoreaInvestment)
    ↓
Listener.handleReceiveMessage()
    ├─ Pipe Transform (tradeId별 변환)
    └─ EventEmitter.emit(MessagePublishedToGateway)
    ↓
KoreaInvestmentBeGateway (Socket.io)
    └─ 'realtime-data' 브로드캐스트
```

**핵심 패턴**:
- **Event-Driven Architecture**: EventEmitter2를 통한 느슨한 결합
- **Observer Pattern**: RxJS Observable로 메시지 스트림 처리
- **Pipe Pattern**: tradeId별 데이터 변환 파이프라인

#### 3.2.3 crawlers (스케줄 크롤러)

**역할**: Cron 기반 주기적 데이터 수집 및 DB 동기화

**주요 크롤러**:

| 크롤러 | 스케줄 | 대상 |
|-------|--------|------|
| **korea-investment-account-crawler** | 매일 09:00 | 계좌 정보, 보유 종목 |
| **korea-investment-index-crawler** | 30초마다 | 국내/해외 지수 |
| **news-crawler** | 1분/30초마다 | 일반/한투 뉴스 |
| **stock-crawler** | 주기적 | 투자자 정보, 종목 가격 |
| **stock-rank-crawler** | 시간대별 | 거래량 순위 |

**스케줄 예시**:
```typescript
// news-crawler
@Cron('*/1 * * * *')  // 1분마다
async handleCrawlingNews() { ... }

@Cron('*/30 * * * * *')  // 30초마다
async handleCrawlingNewsForKoreaInvestment() { ... }

// korea-investment-index-crawler
@Cron('*/30 * * * * *')  // 30초마다
async handleCrawlingDomesticIndexes() { ... }
```

**핵심 패턴**:
- **Schedule Pattern**: `@Cron` 데코레이터로 주기 실행
- **Queue Pattern**: 긴 작업은 BullMQ로 처리
- **Flow Pattern**: 부모-자식 Job 구조
- **Concurrency Control**: `@PreventConcurrentExecution` 데코레이터

#### 3.2.4 repositories (데이터 접근 계층)

**역할**: TypeORM 기반 데이터베이스 접근 계층

**13개 도메인 모듈**:
```
repositories/
├── account/                           # 사용자 계정
├── account-stock-group/               # 계좌 종목 그룹
├── ai-analysis-report/                # AI 분석 결과
├── domestic-index/                    # 국내 지수
├── favorite-stock/                    # 즐겨찾기 종목
├── keyword/                           # 키워드
├── korea-investment-calendar/         # 증권사 일정
├── market-index/                      # 시장 지수
├── most-viewed-stock/                 # 조회수 높은 종목
├── news/                              # 뉴스 (News, StockNews, KeywordNews)
├── stock/                             # 종목
├── stock-investor/                    # 종목 투자자 정보
├── theme/                             # 테마
└── trading-volume-rank/               # 거래량 순위
```

**구조**:
```
{domain}/
├── {domain}.entity.ts                 # TypeORM Entity
├── {domain}.service.ts                # 비즈니스 로직 + DB 접근
└── {domain}.module.ts                 # NestJS Module
```

**핵심 Entity 예시**:
```typescript
// stock.entity.ts
@Entity()
export class Stock {
    @PrimaryColumn()
    code: string;               // 종목 코드

    @Column()
    shortCode: string;          // 단축 코드

    @Column()
    name: string;               // 종목명

    @Column()
    marketType: MarketType;     // KOSPI/KOSDAQ
}

// ai-analysis-report.entity.ts
@Entity()
export class AiAnalysisReport {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reportType: ReportType;     // Stock/Market/ExhaustionTrace

    @Column()
    reportTarget: string;       // 종목코드 또는 지수명

    @Column('longtext')
    content: string;            // AI 생성 내용
}
```

### 3.3 모듈 간 의존성 관계

```
┌─────────────────────────────────────────┐
│  Controllers / Gateways (API Layer)     │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  App Services                           │  ← 비즈니스 로직 조합
│  - stock-investor                       │
│  - news-service                         │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  Analysis Modules                       │  ← AI 분석 / 점수 계산
│  - ai-analyzer                          │
│  - analyzer                             │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  Crawlers                               │  ← 스케줄 데이터 수집
│  - korea-investment-crawler             │
│  - news-crawler                         │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  Repositories                           │  ← 데이터 접근 계층
│  (13 Domain Modules)                    │
└───────────────┬─────────────────────────┘
                ↓
           MySQL Database
```

---

## 4. 공통 Module 분석

### 4.1 korea-investment (한국투자증권 API 클라이언트)

**역할**: 한국투자증권 OpenAPI와의 모든 통신 담당 (REST + WebSocket)

**하위 모듈**:

#### 4.1.1 korea-investment-quotation-client
**역할**: 시세 조회 (현재가, 일별 시세, 투자자 동향 등)

**주요 API**:
```typescript
inquirePrice()                    // 주식 현재가
inquireDailyPrice()              // 일별 시세
inquireInvestor()                // 투자자 동향
inquireIndexPrice()              // 국내업종 현재지수
inquireNewsTitle()               // 시황/공시 조회
```

#### 4.1.2 korea-investment-rank-client
**역할**: 순위 정보 (거래량, 등락률, 공매도 등)

#### 4.1.3 korea-investment-oauth-client
**역할**: OAuth 인증 (REST API 토큰, WebSocket 토큰)

**주요 API**:
```typescript
getToken()              // REST API 액세스 토큰 발급
revokeToken()           // 토큰 폐기
getWebSocketToken()     // WebSocket 접속키 발급
```

#### 4.1.4 korea-investment-web-socket
**역할**: 실시간 체결가 스트리밍

**핵심 클래스**:
- `KoreaInvestmentWsFactory`: WebSocket 연결 생성 및 RxJS Subject 관리
- **메시지 처리**: 바이너리 데이터 수신 → JSON 판별 → 파이프 변환 → Observable 방출

**데이터 변환 파이프**:
- `TradeStreamPipe`: 실시간 체결가 (H0UNCNT0) - 61개 필드 파싱
- `H0unasp0Pipe`: 실시간 호가
- `H0unpgm0Pipe`: 예상 체결가

#### 4.1.5 korea-investment-helper
**역할**: 토큰 관리, 요청 공통 처리, 헤더 생성

**토큰 캐싱 전략**:
- REST API 토큰: 만료 60초 전까지 Redis 캐싱
- WebSocket 토큰: 23시간 캐싱 (24시간 - 1시간 버퍼)
- Redis Key: `korea-investment:token:{credentialType}`

### 4.2 gemini-cli (Google Gemini CLI 래퍼)

**역할**: Google Gemini CLI를 Node.js 환경에서 실행하고 JSON 결과 파싱

**핵심 서비스**:
```typescript
class GeminiCliService {
  async requestSyncPrompt(
    prompt: string,
    options?: { model?: string }
  ): Promise<GeminiCliResult> {
    // spawn('gemini', ['--model', model, '--output-format', 'json'])
    // stdin으로 프롬프트 전달
    // stdout 수집 → JSON 파싱
  }
}
```

**프로세스 관리**:
- `GeminiCliProcessManagerService`: 활성 프로세스 추적 및 종료 시 정리
- `OnModuleDestroy`에서 모든 프로세스에 SIGTERM 전송

### 4.3 naver (Naver API 클라이언트)

**역할**: Naver 검색 API를 통한 뉴스 수집. **3개 앱 키 로테이션**으로 Rate Limit 우회

**핵심 클래스**:
```typescript
class NaverApiClient {
  async getNews(params: NaverApiNewsParams): Promise<NaverApiNewsResponse> {
    // query, display, start, sort 파라미터
  }
}

class NaverApiClientFactory {
  create(appName: NaverAppName): NaverApiClient {
    // 'search1' | 'search2' | 'search3'
    // 각 앱마다 다른 Client ID/Secret 사용
  }
}
```

**로테이션 전략**:
```
NAVER_APP_SEARCH1_ID + SECRET
NAVER_APP_SEARCH2_ID + SECRET
NAVER_APP_SEARCH3_ID + SECRET
```

### 4.4 queue (BullMQ 관리)

**역할**: BullMQ 기반 비동기 작업 큐 시스템을 NestJS에 통합

**주요 기능**:

#### QueueModule
```typescript
// 루트 모듈 등록 (Redis 연결)
QueueModule.forRootAsync()

// 큐 타입 등록
QueueModule.forFeature({
  queueTypes: ['RequestAnalysis'],
  flowTypes: ['PromptToGeminiCli'],
  jobOptions: { attempts: 3 }
})
```

#### @OnQueueProcessor 데코레이터
```typescript
@OnQueueProcessor('RequestAnalysis', { concurrency: 3 })
async processJob(job: Job<RequestAnalysisBody>) {
  // 작업 처리
}
```

#### QueueExplorer (자동 탐색)
- 애플리케이션 시작 시 `@OnQueueProcessor` 데코레이터가 붙은 메서드 자동 탐색
- 워커 등록 및 시작

#### FlowProducer (부모-자식 Job)
```typescript
await flowProducer.add({
  name: 'RequestAnalysis',
  data: { target: '005930' },
  children: [
    { name: 'PromptToGeminiCli', data: { prompt: '...' } },
    { name: 'PromptToGeminiCli', data: { prompt: '...' } },
    { name: 'PromptToGeminiCli', data: { prompt: '...' } },
  ]
});
```

### 4.5 redis (Redis 서비스)

**역할**: Redis Cluster 기반 캐싱 및 분산 락

**핵심 API**:
```typescript
class RedisService {
  set(key: string, value: any, options?: { seconds?: number })
  get(key: string): Promise<string | null>
  getOrDefaultValue<T>(key: string, defaultValue: T): Promise<T>
  del(key: string)
  lock(key: string, options?: { seconds?: number })
  unLock(key: string)
}
```

**@Cacheable 데코레이터 (AOP)**:
```typescript
@Cacheable({
  key: (param) => `cache-key-${param}`,
  ttl: 300  // 5분
})
async expensiveOperation(param: string) {
  // 첫 호출: 실제 로직 실행 + Redis 저장
  // 이후 호출: Redis에서 반환
}
```

### 4.6 외부 시스템 통합 방식 요약

| 모듈 | 통신 방식 | 인증 | 특징 |
|------|----------|------|------|
| **korea-investment** | REST + WebSocket | OAuth 2.0 | Token 캐싱, 자동 갱신, 바이너리 파싱 |
| **gemini-cli** | CLI Process (spawn) | API Key | stdout/stdin 스트림, JSON 파싱 |
| **naver** | REST (Axios) | Client ID/Secret | 3개 앱 키 로테이션 |
| **redis** | ioredis Cluster | 없음 | Cluster 모드, 분산 락, TTL 관리 |
| **queue** | BullMQ (Redis) | 없음 | FlowProducer, 병렬 처리, 재시도 |

---

## 5. Script 분석

### 5.1 데이터 파이프라인 개요

**목적**: 한국투자증권의 종목 코드 데이터를 자동으로 동기화

**구조**: ETL Pipeline (Extract → Transform → Load)

### 5.2 전체 흐름도

```
npm run refresh-stock-codes
    ↓
1. download-stock-files
   - 9개 ZIP 파일 다운로드
   - scripts/temp/ 압축 해제
    ↓
2. convert-korea-investment-code (3개 병렬)
   ├─ sector-code-parse   → idxcode.json
   ├─ stock-code-parse    → kospi/kosdaq JSON (4개)
   └─ theme-parse         → theme_code.json
    ↓
3. stock-code-migration
   - Stock 테이블 TRUNCATE
   - KOSPI/KOSDAQ INSERT (병렬 20개씩)
    ↓
4. theme-migration
   - Theme, ThemeStock 테이블 TRUNCATE
   - 테마 정보 INSERT (병렬 20개씩)
```

### 5.3 스크립트 상세

#### 5.3.1 다운로드 스크립트

**실행**: `npm run download-stock-files`

**다운로드 대상**:
```typescript
[
  'idxcode.mst.zip',           // 국내 지수
  'kospi_code.mst.zip',        // KOSPI 종목
  'kosdaq_code.mst.zip',       // KOSDAQ 종목
  'nxt_kospi_code.mst.zip',    // Next KOSPI
  'nxt_kosdaq_code.mst.zip',   // Next KOSDAQ
  'theme_code.mst.zip',        // 테마 코드
  // 나스닥, NYSE, AMEX (현재 미사용)
]
```

**출력**: `scripts/temp/*.mst` (CP949 인코딩 바이너리)

#### 5.3.2 변환 스크립트

**실행**: `npm run convert-korea-investment-code`

**종목 코드 파싱** (`stock-code-parse/`):
```typescript
// 파싱 로직
parse(filePath) {
  // 1. CP949 디코딩
  const content = iconv.decode(buffer, 'cp949');

  // 2. 라인별 파싱
  return content.split('\n').map(line => {
    return [
      line.slice(0, 9).trim(),    // shortCode (A005930)
      line.slice(9, 21).trim(),   // code (KR7005930003)
      line.slice(21).trim(),      // name (삼성전자)
    ];
  });
}
```

**출력**:
- `src/assets/kospi_code.json` (약 800개)
- `src/assets/kosdaq_code.json` (약 1,500개)
- `src/assets/nxt_kospi_code.json`
- `src/assets/nxt_kosdaq_code.json`
- `src/assets/idxcode.json` (지수)
- `src/assets/theme_code.json` (약 10,000개 매핑)

#### 5.3.3 마이그레이션 스크립트

**공통 인터페이스**:
```typescript
interface IMigrator {
  init(): Promise<void>;    // NestJS Context 생성
  up(): Promise<void>;      // 마이그레이션 실행
  down(): Promise<void>;    // 롤백
  test(): Promise<void>;    // 테스트
  close(): Promise<void>;   // DB 연결 종료
}
```

**종목 코드 마이그레이션**:
```bash
npm run stock-code-migration

# 처리 흐름
1. Stock 테이블 TRUNCATE
2. KOSPI 종목 INSERT (병렬 20개씩)
3. KOSDAQ 종목 INSERT (병렬 20개씩)
4. Next거래소 플래그 UPDATE
```

**UPSERT 전략**:
```typescript
.insert()
.into(Stock)
.values(stockDto)
.orUpdate(['name'], ['short_code'])  // shortCode 기준 중복 시 name 업데이트
.execute();
```

**테마 마이그레이션**:
```bash
npm run theme-migration

# 처리 흐름
1. Theme 테이블 TRUNCATE + INSERT
2. ThemeStock 매핑 테이블 TRUNCATE
3. 유효한 종목만 필터링 (stockMap 존재 여부)
4. 테마-종목 매핑 INSERT (병렬 20개씩)
```

### 5.4 스크립트 간 의존성

| 스크립트 | 입력 | 출력 | 후속 스크립트 |
|---------|------|------|-------------|
| `download-stock-files` | 외부 URL | `scripts/temp/*.mst` | 모든 파싱 스크립트 |
| `stock-code-parse` | `kospi_code.mst` 등 | `kospi_code.json` 등 | `stock-code-migration`, `theme-migration` |
| `theme-parse` | `theme_code.mst` | `theme_code.json` | `theme-migration` |
| `stock-code-migration` | JSON 파일들 | Stock 테이블 | - |
| `theme-migration` | JSON 파일들 | Theme, ThemeStock 테이블 | - |

### 5.5 실행 시점 및 목적

**전체 동기화 (권장)**:
```bash
npm run refresh-stock-codes
```
- 초기 데이터베이스 설정 시
- 신규 상장/폐지 종목 반영 (분기별 또는 월별)
- 테마 정보 업데이트 필요 시

**소요 시간**: 약 1~3분

**결과**:
- Stock: 약 2,300개 종목
- Theme: 약 300개 테마
- ThemeStock: 약 10,000개 매핑
- DomesticIndex: 약 200개 지수

### 5.6 주요 특징

1. **ETL Pipeline 패턴**: Extract → Transform → Load
2. **Adapter Pattern**: 파일 타입별 파서 구현
3. **Chunk Processing**: 20개씩 병렬 처리로 성능 최적화
4. **UPSERT 전략**: 멱등성 보장 (재실행 안전)
5. **NestJS Context 활용**: DI 컨테이너로 Repository 주입

---

## 6. 아키텍처 및 설계 패턴

### 6.1 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
│  - 13개 REST API Controllers                                    │
│  - WebSocket Gateway (Socket.io)                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│  - App Services (stock-investor, news-service)                  │
│  - Analysis Modules (ai-analyzer, analyzer)                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Domain Layer                              │
│  - 13개 Repository Modules (Stock, News, Account 등)            │
│  - Entity Definitions                                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                         │
│  - Korea Investment Module (REST + WebSocket)                   │
│  - Gemini CLI Module                                            │
│  - Naver API Module                                             │
│  - Queue Module (BullMQ)                                        │
│  - Redis Module                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 적용된 디자인 패턴

#### 1. Layered Architecture
- Controller → Service → Repository 계층 분리
- 각 계층의 책임 명확히 구분

#### 2. Repository Pattern
- TypeORM Repository를 통한 데이터 접근 추상화
- Entity 중심 설계

#### 3. Adapter Pattern
- AI 분석: `StockAnalyzerAdapter`, `MarketAnalyzerAdapter`
- 분석 유형별 데이터 수집 로직 캡슐화

#### 4. Factory Pattern
- `NaverApiClientFactory`: 앱 키별 클라이언트 생성
- `KoreaInvestmentWsFactory`: WebSocket 인스턴스 생성
- `AiAnalyzerAdapterFactory`: 분석 어댑터 생성

#### 5. Transformer Pattern
- 데이터 → 프롬프트 문자열 변환
- WebSocket 바이너리 → 타입 안전 객체 변환

#### 6. Observer Pattern
- RxJS Subject를 통한 WebSocket 메시지 스트리밍
- EventEmitter2를 통한 이벤트 전파

#### 7. Event-Driven Architecture
- EventEmitter2로 모듈 간 느슨한 결합
- WebSocket 메시지 전파 (Collector → Gateway)

#### 8. Queue Pattern (BullMQ)
- 긴 작업의 비동기 처리
- FlowProducer로 부모-자식 Job 구조
- Concurrency 제어

#### 9. Decorator Pattern
- `@OnQueueProcessor`: 워커 등록
- `@Cacheable`: 메서드 캐싱
- `@UseGuards`: Guard 적용

#### 10. Strategy Pattern
- 3개 Naver 앱 키 로테이션
- 한국투자증권 REST/WebSocket 통신 전략 분리

### 6.3 핵심 설계 원칙

#### 관심사 분리 (Separation of Concerns)
- Repositories: 데이터 접근만
- Services: 비즈니스 로직
- Processors: 큐 작업 처리
- Adapters: 데이터 수집 및 변환
- Transformers: 데이터 포맷 변환

#### 의존성 역전 (Dependency Inversion)
- 인터페이스 기반 설계 (`BaseAnalysisAdapter`, `Transformer`)
- Factory 패턴으로 구현체 주입
- NestJS DI 컨테이너 활용

#### 단일 책임 원칙 (Single Responsibility)
- 각 Processor는 하나의 Queue 타입만 처리
- 각 Service는 하나의 도메인만 담당
- 각 Adapter는 하나의 분석 유형만 처리

#### 느슨한 결합 (Loose Coupling)
- Event-Driven Architecture (EventEmitter2)
- Queue 기반 비동기 처리
- 모듈 간 인터페이스 통신

---

## 7. 핵심 데이터 흐름

### 7.1 실시간 주식 체결가 스트리밍

```
클라이언트: POST /v1/stocks/005930/subscribe
    ↓
StockController → KoreaInvestmentCollectorSocket
    ↓
BullMQ Job 생성 (Subscribe)
    ↓
Processor: WebSocket 토큰 획득 + 구독 메시지 전송
    ↓
Korea Investment Server → 실시간 체결가 브로드캐스트
    ↓
WebSocket Factory: 바이너리 수신 (61개 필드)
    ↓
Pipe Transform: H0uncnt0Data 객체 생성
    ↓
EventEmitter: MessageReceivedFromKoreaInvestment
    ↓
Listener: handleReceiveMessage
    ↓
EventEmitter: MessagePublishedToGateway
    ↓
Socket.io Gateway: 'realtime-data' 브로드캐스트
    ↓
클라이언트: WebSocket으로 실시간 데이터 수신
```

### 7.2 AI 종목 분석 요청

```
클라이언트: POST /v1/analysis/reports/Stock/005930
    ↓
AnalysisController → AiAnalyzerService
    ↓
1. StockAnalyzerAdapter.collectData()
   ├─ Stock 정보 조회 (DB)
   ├─ 투자자 정보 수집 (Korea Investment API)
   └─ 뉴스 정보 수집 (Naver API)
    ↓
2. FlowProducer: 부모 Job + 3개 자식 Job 생성
   └─ RequestAnalysis (부모)
       ├─ PromptToGeminiCli (종목 이슈)
       ├─ PromptToGeminiCli (뉴스 분석)
       └─ PromptToGeminiCli (세력 설계)
    ↓
클라이언트: 204 No Content (즉시 반환)
    ↓
[백그라운드]
3. Worker: PromptToGeminiCli (병렬 3개)
   └─ Gemini CLI 호출 → JSON 응답
    ↓
4. Worker: RequestAnalysis (부모 Job)
   ├─ 자식 Job 결과 수집
   └─ AiAnalysisReportService.addReport()
    ↓
DB: ai_analysis_report 테이블에 저장
    ↓
클라이언트: GET /v1/analysis/reports/Stock/005930
    ↓
저장된 분석 결과 반환
```

### 7.3 뉴스 크롤링 및 저장

```
Cron Scheduler: */1 * * * * (1분마다)
    ↓
NewsCrawlerSchedule.handleCrawlingNews()
    ↓
BullMQ Job 생성 (CrawlingNews)
    ↓
NewsCrawlerProcessor.processCrawlingNews()
    ↓
1. Naver API: 뉴스 검색 (display: 100)
    ↓
2. 중복 체크 (NewsService.findNewsByLink)
    ↓
3. 신규 뉴스만 필터링
    ↓
4. NewsService.addNews() → DB 저장
    ↓
5. StockNews 매핑 (종목별 뉴스 연결)
    ↓
DB: news, stock_news 테이블에 저장
```

### 7.4 종목 투자자 정보 조회

```
클라이언트: GET /v1/stocks/005930/investors
    ↓
StockInvestorController → StockInvestorService
    ↓
1. DB 조회: getListByStockCode()
    ↓
2. 데이터 검증
   - 오늘 데이터 있는지?
   - 합계가 0인지? (무효 데이터)
    ↓
3-A. 유효한 데이터 있으면 → 반환
    ↓
3-B. 무효하면
   ├─ Korea Investment API 호출 (inquireInvestor)
   ├─ DB 저장 (upsert)
   └─ 재조회 후 반환
```

**분석 완료일**: 2026년 2월 4일
**분석자**: Claude Code (project-analyzer agent)