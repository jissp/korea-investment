# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# 필수 사항
- Never switch to Plan mode unless I explicitly request it. Always prioritize Act mode for direct implementation.

---

## 개요

**Korea Investment**: 한국투자증권 API와 Google Gemini를 활용한 실시간 주식 분석 및 정보 제공 시스템

- **Framework**: NestJS 11.x (TypeScript)
- **Database**: MySQL (TypeORM with SnakeNamingStrategy)
- **Cache/Queue**: Redis + BullMQ
- **WebSocket**: Socket.io (실시간 체결가 데이터)
- **AI**: Google Gemini CLI (종목/시장 분석)
- **News**: Google News RSS, Naver API 통합
- **Authentication**: JWT 기반 인증
- **Port**: 3100

---

## 자주 사용하는 명령어

### 개발 서버 실행

```bash
# Watch 모드 (개발)
npm run start:dev

# 일반 시작
npm start

# 프로덕션 모드
npm run start:prod
```

### 테스트

```bash
# 모든 테스트 실행
npm run test

# Watch 모드로 테스트
npm test:watch

# 테스트 커버리지
npm run test:cov

# 특정 파일 테스트
npm run test -- src/app/modules/repositories/__tests__/stock.service.spec.ts

# 특정 테스트 실행
npm run test -- --testNamePattern="StockService"

# E2E 테스트
npm run test:e2e
```

### 종목 코드 동기화

```bash
# 전체 새로고침 (KOSPI, KOSDAQ, 테마)
npm run refresh-stock-codes

# 개별 실행
npm run download-stock-files         # 파일 다운로드
npm run convert-korea-investment-code # 코드 변환
npm run stock-code-migration         # DB에 저장
npm run domestic-idx-migration       # 지수 마이그레이션
npm run theme-migration              # 테마 마이그레이션
```

### 빌드 및 린팅

```bash
# 빌드
npm run build

# 린팅 (ESLint 체크)
npm run lint

# 린팅 자동 수정
npm run lint:fix
```

---

## 환경 설정

### 필수 환경 변수

`.env` 파일 위치: `src/app/env/.env`

**Database (MySQL)** - 필수
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=
MYSQL_DATABASE=korea_investment
```

**Redis** - 필수
```
REDIS_HOST=localhost
REDIS_PORT=6379
```

**외부 API** - 필수
```
# 한국투자증권 API
KI_API_KEY=your_key
KI_SECRET_KEY=your_secret

# Naver API (3개 앱 키 로테이션)
NAVER_APP_SEARCH1_ID=
NAVER_APP_SEARCH1_SECRET=
NAVER_APP_SEARCH2_ID=
NAVER_APP_SEARCH2_SECRET=
NAVER_APP_SEARCH3_ID=
NAVER_APP_SEARCH3_SECRET=

# Google Gemini
GOOGLE_API_KEY=your_key
```

**JWT 인증** - 필수
```
JWT_SECRET=your_secret_key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

**기본 설정** - 선택
```
PORT=3100                  # 기본값: 3100
NODE_ENV=development       # 기본값: development
```

자세한 설정은 `src/app/configuration.ts`에서 확인하세요.

---

## 아키텍처 개요

### 핵심 데이터 흐름 (3가지 시나리오)

#### 1️⃣ 종목 검색

```
GET /v1/stocks/domestics
├─ StockController.getStocks()
├─ StockService.getStocks() → Repository.find()
└─ MySQL 조회 → JSON 응답
```

#### 2️⃣ AI 분석 요청 (메인 기능)

```
POST /v1/analysis/reports/Stock/005930
│
├─ AnalysisController.requestAIAnalysis()
│
├─ AiAnalyzerService.requestAnalysis()
│  └─ 1. StockAnalyzerAdapter.collectData()
│     ├─ Stock 정보 (DB)
│     ├─ 투자자 정보 (Korea Investment API)
│     ├─ 뉴스 정보 (DB + Naver API)
│     └─ 이슈 데이터 종합
│
├─ 2. FlowProducer.add() - BullMQ Job 생성
│  └─ RequestAnalysis (부모 Job)
│      └─ 3개의 PromptToGeminiCli (병렬 자식 Job)
│          ├─ Job 1: 종목 이슈 및 정책 분석
│          ├─ Job 2: 최근 뉴스 정보 분석
│          └─ Job 3: 세력 설계 분석
│
└─ 3. Queue 처리 (Worker)
   ├─ AiAnalyzerProcessor.promptToGeminiCli() [concurrency: 3]
   │  └─ Gemini CLI로 프롬프트 전달 → JSON 응답
   └─ AiAnalyzerProcessor.requestAnalysis()
      ├─ 모든 자식 Job 결과 수집
      ├─ AiAnalysisReport 저장
      └─ 202 Accepted 반환
```

**주요 어댑터** (`src/app/modules/ai-analyzer/analyzers/`):
- `StockAnalyzerAdapter`: 종목 분석 (데이터 수집 + 프롬프트 생성)
- `MarketAnalyzerAdapter`: 시장/뉴스 분석
- `ExhaustionTraceAnalyzerAdapter`: 고갈 추적 분석

#### 3️⃣ 실시간 주식 체결가 (WebSocket)

```
POST /v1/stocks/005930/subscribe
├─ StockController.subscribe()
├─ KoreaInvestmentCollectorSocket.subscribe() → Queue Job
├─ KoreaInvestmentCollectorProcessor
│  ├─ 한국투자증권 WebSocket 토큰 획득
│  └─ 구독 메시지 전송 (H0UNCNT0, H0STCNT0 등)
│
├─ Korea Investment Server → 실시간 체결가 브로드캐스트
│
├─ KoreaInvestmentWsFactory (수신)
│  ├─ 바이너리 데이터 파싱
│  ├─ Pipe Transform (tradeId별)
│  └─ TransformResult 발행
│
├─ KoreaInvestmentCollectorListener
│  └─ MessagePublishedToGateway 이벤트
│
└─ KoreaInvestmentBeGateway
   └─ WebSocket 클라이언트에게 'realtime-data' 브로드캐스트
```

#### 4️⃣ Google News RSS 수집 및 카테고리별 뉴스 조회

```
POST /v1/news/categories/{category} (카테고리별 뉴스 조회)
├─ NewsController.getNewsByCategory()
├─ NewsService.getNewsByCategory()
│  ├─ 1. GoogleRssService 또는 NaverApiService로 뉴스 수집
│  ├─ 2. RssReaderService로 XML 파싱
│  ├─ 3. XmlParserService로 RSS 피드 변환
│  └─ 4. StockNews 테이블에 저장
│
└─ GET /v1/news/search
   ├─ NewsController.searchNews()
   └─ 키워드 기반 뉴스 검색 (Redis 캐싱)
```

**주요 모듈** (`src/modules/`):
- `google-rss/`: Google News RSS 피드 수집
- `rss-reader/`: RSS 피드 파싱
- `xml-parser/`: XML → 구조화된 데이터 변환
- `naver/`: Naver News API 클라이언트

#### 5️⃣ JWT 인증 플로우

```
POST /v1/auth/login
├─ AuthController.login()
├─ AuthService.login()
│  ├─ 사용자 검증 (Account 테이블)
│  ├─ JWT Token 생성
│  └─ Refresh Token Redis에 저장
│
└─ JSON 응답: { accessToken, refreshToken, expiresIn }

GET /v1/protected-route (with Authorization header)
├─ JwtGuard 검증
│  ├─ Authorization: Bearer <accessToken> 파싱
│  ├─ JWT 토큰 검증
│  └─ req.user에 사용자 정보 주입
├─ Controller 로직 실행
└─ 200 응답
```

**주요 모듈** (`src/app/modules/auth/`):
- `AuthService`: JWT 토큰 생성 및 검증
- `JwtGuard`: 요청 인증 가드
- `RefreshTokenStrategy`: Refresh Token 재발급 전략

### 모듈 구조

```
src/
├── app/
│   ├── app.module.ts                 # 루트 모듈
│   ├── configuration.ts              # 환경 설정 (ConfigModule)
│   ├── controllers/                  # REST API (15+ 컨트롤러)
│   ├── gateways/
│   │   └── korea-investment-be.gateway.ts  # WebSocket Gateway
│   └── modules/
│       ├── analysis/                 # AI 분석
│       │   ├── ai-analyzer/          ⭐ AI 분석 (Adapter, Processor, Service)
│       │   │   └── analyzers/
│       │   │       ├── stock-analyzer/          # 종목 분석
│       │   │       ├── market-analyzer/         # 시장 분석
│       │   │       └── exhaustion-trace-analyzer/ # 고갈 분석
│       │   └── analyzer/             # 분석 통합 로직
│       ├── auth/                     ⭐ JWT 인증 (AuthService, Guards, Strategies)
│       ├── app-services/             # 비즈니스 서비스
│       │   ├── news-service/         # 뉴스 관련 서비스
│       │   └── stock-investor/       # 투자자 정보 서비스
│       ├── korea-investment-collector/ ⭐ 실시간 수집 (Socket, Listener, Processor)
│       ├── korea-investment-request-api/ # 한국투자증권 Rate Limiting 관리
│       ├── crawlers/                 # 스케줄 크롤러 (@Cron)
│       │   ├── stock-crawler/        # 종목 정보 크롤링
│       │   ├── stock-rank-crawler/   # 순위 정보 크롤링
│       │   ├── news-crawler/         # 뉴스 크롤링
│       │   └── korea-investment-crawler/ # 한국투자증권 API 크롤링
│       └── repositories/             # Data Access Layer (18+ 저장소)
├── modules/
│   ├── korea-investment/             # 한국투자증권 API 클라이언트
│   │   ├── korea-investment-quotation-client/
│   │   └── korea-investment-web-socket/
│   ├── gemini-cli/                   # Google Gemini CLI 래퍼
│   ├── google-rss/                   ⭐ Google News RSS 수집
│   ├── rss-reader/                   ⭐ RSS 피드 파싱
│   ├── xml-parser/                   ⭐ XML → 데이터 변환
│   ├── naver/                        # Naver News API
│   ├── queue/                        # BullMQ 관리
│   ├── redis/                        # Redis 서비스 (캐시, 락)
│   ├── slack/                        # Slack 통합 (알림 등)
│   ├── logger/                       # 로깅 서비스
│   ├── mcp-server/                   # MCP 서버 (LLM 통합)
│   ├── metadata-scanner/             # 메타데이터 스캐닝
│   └── stock-plus/                   # 주식 정보 확장
└── common/                           # 공용 유틸리티, Guard, Transformer
```

---

## 핵심 패턴 및 설계

### 1️⃣ Adapter Pattern (AI 분석)

**목적**: 분석 유형별 다른 데이터 수집 로직 캡슐화

```typescript
// src/app/modules/ai-analyzer/ai-analyzer-adapter.factory.ts
interface IAnalysisAdapter {
  collectData(reportTarget: string): Promise<CollectedData>;
  buildPrompt(data: CollectedData, investor: string): string;
}

// 구현
- StockAnalyzerAdapter (종목 분석)
- MarketAnalyzerAdapter (시장 분석)
- ExhaustionTraceAnalyzerAdapter (고갈 추적)
```

**사용**:
```typescript
const adapter = this.adapterFactory.create(reportType);
const data = await adapter.collectData(reportTarget);
```

### 2️⃣ Job Flow + Queue Processing (BullMQ)

**목적**: 긴 작업(Gemini CLI 호출)을 비동기로 병렬 처리

```typescript
// 부모 Job: RequestAnalysis
// 자식 Job: PromptToGeminiCli (3개, concurrency: 3)

FlowProducer.add({
  name: RequestAnalysis,
  data: analysisData,
  children: [
    { name: PromptToGeminiCli, data: prompt1 },
    { name: PromptToGeminiCli, data: prompt2 },
    { name: PromptToGeminiCli, data: prompt3 },
  ],
});

// 처리
@OnQueueProcessor(PromptToGeminiCli, concurrency: 3)
async processPrompt(job: Job<PromptToGeminiCliBody>) {
  return await this.geminiCliService.requestSyncPrompt(...);
}

@OnQueueProcessor(RequestAnalysis)
async processAnalysis(job: Job<RequestAnalysisBody>) {
  const results = await job.getProgress(); // 자식 결과 수집
  await this.reportService.addReport(results);
}
```

### 3️⃣ Event-Driven Architecture (EventEmitter2)

**목적**: 느슨한 결합, 모듈 간 통신

```typescript
// 발행
this.eventEmitter.emit(
  KoreaInvestmentCollectorEventType.MessagePublishedToGateway,
  message
);

// 구독
@OnEvent(KoreaInvestmentCollectorEventType.MessagePublishedToGateway)
handleMessage(message: TransformResult) { ... }

// Wildcard 지원
@OnEvent('.*')
handleAll(message: any) { ... }
```

### 4️⃣ Transformer Pattern (데이터 변환)

**목적**: 복잡한 데이터 변환 로직을 재사용 가능하게 분리

```typescript
// 위치: src/app/modules/ai-analyzer/common/transformers/
// - investor-prompt.transformer.ts
// - news-prompt.transformer.ts
// - stock-issue-prompt.transformer.ts

transform(inputData): string {
  return formatPromptTemplate(inputData);
}
```

### 5️⃣ Repository Pattern (Data Access)

모든 데이터 접근은 Repository를 통해:
```typescript
// 예: StockRepository
class StockRepository extends Repository<Stock> {
  findByCode(code: string): Promise<Stock>;
  findDomesticStocks(): Promise<Stock[]>;
}

// 서비스에서 사용
@Inject(StockRepository)
private readonly stockRepository: StockRepository;
```

---

## 외부 API 통합

### 한국투자증권 API

**WebSocket** (실시간 체결가):
```typescript
// 연결
KoreaInvestmentWsFactory.create(config) → WebSocket 연결

// 메시지 구독 (H0UNCNT0: 일반시장, H0STCNT0: 나스닥)
KoreaInvestmentCollectorSocket.subscribe(stockCode)

// 데이터 변환
pipes/trade-stream.pipe.ts (바이너리 → TransformResult)
```

**REST API** (투자자 정보, 지수 등):
```typescript
KoreaInvestmentQuotationClient
├─ inquireDailyPrice()         # 일일 가격
├─ inquireInvestor()           # 투자자 정보
└─ inquireInvestorByEstimate() # 투자자 추정가

KoreaInvestmentRankClientModule
└─ 순위 관련 조회
```

**주의**: 한국투자증권 API 호출은 `KoreaInvestmentRequestApiModule`을 통해 Rate Limiting 처리됨.

### Naver API (뉴스 검색)

```typescript
NaverApiClientFactory.create(NaverAppName.SEARCH)
  .getNews({
    query: string,
    start: number,
    display: number,
    sort: 'date'
  })

// 3개 앱 키 로테이션 (naver.app.search1/2/3)
```

### Google Gemini CLI

```typescript
GeminiCliService.requestSyncPrompt(
  prompt: string,
  options?: { model: string }
)
// spawn('gemini', ['--model', model, '--output-format', 'json'])
// 결과: JSON 문자열 반환
```

### Google News RSS

```typescript
GoogleRssService.fetchNews(query: string)
  // Google News RSS 피드 URL로부터 뉴스 수집
  // RssReaderService로 XML 파싱
  // XmlParserService로 구조화된 데이터로 변환

RssReaderService.parseRssFeed(feedUrl: string)
  // RSS XML → 피드 객체로 변환

XmlParserService.parse(xmlContent: string)
  // 원본 XML → 정규화된 데이터 구조
```

### JWT 인증

```typescript
// 토큰 발급
AuthService.login(username: string, password: string)
  // JWT Access Token (만료: 15분)
  // Refresh Token (Redis 저장, 만료: 7일)

// 토큰 검증 (가드)
@UseGuards(JwtGuard)
@Get('/protected')
async protectedRoute(@Req() req) {
  const user = req.user; // JWT Payload
}

// 토큰 갱신
AuthService.refreshAccessToken(refreshToken: string)
  // 새로운 Access Token 발급
```

---

## 데이터베이스

### 주요 Entity

- `Stock`: 종목 (code, shortCode, name, marketType 등)
- `StockDailyInvestor`: 일일 투자자 정보
- `AiAnalysisReport`: AI 분석 결과 (title, content, reportType, reportTarget)
- `News`: 뉴스 기본 정보 (title, description, link, pubDate, source)
- `StockNews`: 종목-뉴스 매핑 (stock_id, news_id)
- `Account`: 사용자 계정 (username, password_hash, email, role)
- `AccountStock`: 사용자 관심 종목 (account_id, stock_id)
- `Keyword`: 검색 키워드 (keyword, category)
- `KeywordNews`: 키워드-뉴스 매핑 (keyword_id, news_id)
- `NewsCategory`: 뉴스 카테고리 (name, description) - 최신 추가

### 마이그레이션

```bash
npm run stock-code-migration    # Stock 테이블 초기화 + JSON 데이터 로드
npm run domestic-idx-migration  # 국내 지수 마이그레이션
npm run theme-migration         # 테마 마이그레이션
```

**구현**: `src/migrations/*/index.ts` (IMigrator 인터페이스)

### TypeORM 설정

- **Naming**: SnakeNamingStrategy (camelCase → snake_case)
- **Timezone**: Z (UTC)
- **AutoLoad**: true (자동 entity 로드)
- **Decimal**: true (금액 데이터)

---

## Redis & 캐싱

### RedisService 사용

```typescript
@Inject(RedisService)
private readonly redisService: RedisService;

// 저장 (기본 TTL: 60초)
await this.redisService.set('key', value, { seconds: 300 });

// 조회
const data = await this.redisService.get('key');

// 기본값과 함께 조회
const data = await this.redisService.getOrDefaultValue('key', defaultVal);

// 분산 락
const lock = await this.redisService.lock('resource-key');
try { /* 작업 */ }
finally { await this.redisService.unLock('resource-key'); }
```

---

## WebSocket Gateway

### 클라이언트 연결

```
ws://localhost:3100/ws
```

### 이벤트

**수신**:
- `realtime-data`: 실시간 체결가 (자동 브로드캐스트)

**송신** (클라이언트 → 서버):
- `message`: 커스텀 메시지

---

## 테스트 작성 팁

### 테스트 구조

```typescript
// src/app/modules/repositories/__tests__/stock.service.spec.ts

describe('StockService', () => {
  let service: StockService;
  let repository: Repository<Stock>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StockService,
        { provide: getRepositoryToken(Stock), useValue: mockRepository },
      ],
    }).compile();
    service = module.get(StockService);
  });

  it('should find stock by code', async () => {
    const result = await service.getStock('005930');
    expect(result).toBeDefined();
  });
});
```

### 모킹

```typescript
// Repository 모킹
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

// 서비스 모킹
const mockService = {
  requestAnalysis: jest.fn().mockResolvedValue({ id: 1 }),
};
```

---

## 개발 시 주의사항

### 1. Queue Job 추가 시

- **FlowProducer** 사용 (부모-자식 Job 구조)
- **@OnQueueProcessor** 데코레이터로 처리 로직 등록
- **concurrency** 설정 (동시 실행 수)
- **QueueExplorer**가 자동으로 감지 (등록 불필요)

### 2. 외부 API 호출 시

- **KoreaInvestmentRequestApiModule** 를 통해 Rate Limiting 처리
- **Naver API**: 3개 앱 키 자동 로테이션
- **Gemini CLI**: 에러 로깅 및 타임아웃 처리

### 3. Repository 추가 시

- `src/app/modules/repositories/` 에 추가
- `RepositoryModule` 에 import/export
- TypeORM `Repository<Entity>` 상속

### 4. Event Emit 시

- `KoreaInvestmentCollectorEventType` enum 참조
- Wildcard 지원 (`@OnEvent('.*')`)
- 모듈 간 느슨한 결합 유지

### 5. Transformer 추가 시

- 위치: `src/app/modules/ai-analyzer/common/transformers/` 또는 `analyzers/*/transformers/`
- 책임: 데이터 입력 → 프롬프트 문자열
- 재사용성 고려

### 6. 새 모듈 추가 시

- `src/app/modules/` 에 모듈 디렉토리 생성
- `app.module.ts`에 import 등록
- `@Module()` 데코레이터에 providers, imports, exports 명시

### 7. 에러 처리

- Global Exception Filter (`src/common/filters/`) 사용
- 표준 에러 응답 포맷 준수:
  ```json
  {
    "statusCode": 400,
    "message": "에러 메시지",
    "error": "오류 타입"
  }
  ```
- HTTP Guard를 이용한 인증 에러 처리

### 8. JWT 인증 추가 시

- `AuthService` 구현: 토큰 발급 및 검증
- `JwtGuard` 적용: `@UseGuards(JwtGuard)` 데코레이터로 라우트 보호
- JWT 전략 등록: `JwtStrategy` 클래스로 JWT 검증 로직 정의
- Refresh Token: Redis에 저장하여 토큰 갱신 지원
- 환경변수: `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION` 설정

### 9. 뉴스 관련 모듈 추가 시

- `google-rss/`: Google News RSS 피드 수집
- `rss-reader/`: RSS XML 파싱
- `xml-parser/`: 구조화된 데이터로 변환
- `NewsService`: 뉴스 조회 로직 통합
- 카테고리별 조회: `NewsCategory` entity로 관리
- 캐싱: Redis로 뉴스 데이터 캐싱 (TTL: 1시간)

---

## 트러블슈팅

### Redis 연결 오류

```bash
# Redis 연결 확인
redis-cli ping

# 설정 확인
cat src/app/env/.env | grep REDIS
```

### Queue 작업 안 됨

1. `QueueExplorer` 로그 확인
2. Redis 접속 확인
3. `@OnQueueProcessor` 데코레이터 확인
4. Job 데이터 타입 확인 (serializable)

### Gemini CLI 에러

```bash
# Gemini CLI 설치 확인
gemini --version

# 모델 목록
gemini models list

# 프롬프트 테스트
echo "test" | gemini --model gemini-2.0-flash --output-format json
```

### 한국투자증권 WebSocket 연결 실패

1. 토큰 유효성 확인
2. 방화벽/네트워크 확인
3. `KoreaInvestmentCollectorProcessor` 로그 확인
4. 구독 메시지 포맷 확인 (H0UNCNT0 vs H0STCNT0)

---

## 모듈 구조 가이드

### `src/app/modules/` vs `src/modules/`

**`src/app/modules/`** - 비즈니스 로직
- `ai-analyzer/`: AI 분석 관련
- `korea-investment-collector/`: 한국투자증권 실시간 수집
- `repositories/`: 데이터 접근 계층
- `crawlers/`: 스케줄 크롤러

**`src/modules/`** - 기반 기술 / 외부 통합
- `korea-investment/`: 한국투자증권 API 클라이언트
- `gemini-cli/`: Google Gemini CLI 래퍼
- `google-rss/`: Google News RSS 수집
- `rss-reader/`: RSS 피드 파싱
- `xml-parser/`: XML 데이터 변환
- `naver/`: Naver API 클라이언트
- `queue/`: BullMQ 큐 관리
- `redis/`: Redis 서비스
- `slack/`: Slack 통합
- `logger/`: 로깅
- `mcp-server/`: MCP 서버
- `metadata-scanner/`: 메타데이터 스캐닝
- `stock-plus/`: 주식 정보 확장

### 모듈 등록 순서

1. **기반 모듈** (`src/modules/**`) → 다른 모듈에서 의존
   - `LoggerModule`, `QueueModule`, `RedisModule`
   - `KoreaInvestmentModule`, `GeminiCliModule`, `NaverModule`
   - `GoogleRssModule`, `RssReaderModule`, `XmlParserModule`
   - `SlackModule`, `McpServerModule`, `MetadataScannerModule`, `StockPlusModule`
2. **저장소 모듈** (`RepositoryModule`) → 서비스에서 사용
3. **인증 모듈** (`AuthModule`) → 라우트 보호
4. **비즈니스 모듈** (`src/app/modules/**`) → 최상위 비즈니스 로직
   - `AnalysisModule`, `AppServiceModule`, `KoreaInvestmentCollectorModule`
   - `KoreaInvestmentRequestApiModule`, `CrawlersModule`
5. **게이트웨이/컨트롤러** → 모든 서비스 준비 후 마지막

> **QueueExplorer 자동 감지**: `@OnQueueProcessor()` 데코레이터가 붙은 메서드는 자동으로 감지되며, 명시적 등록이 불필요합니다. BullMQ 큐 매니저가 런타임에 감지합니다.

---

## 성능 최적화 포인트

1. **BullMQ concurrency**: Gemini 호출은 3 (병렬 처리)
2. **Redis TTL**: 캐시 만료 시간 조정 (기본값: 60초)
3. **DB 인덱스**: StockCode (shortCode), StockNews (stock_id)
   - 종목 검색, 뉴스 조회 성능 개선
4. **API Rate Limiting**: 한국투자증권 API 요청 조절 (`KoreaInvestmentRequestApiModule` 통해 처리)
5. **WebSocket 브로드캐스트**: 클라이언트 수 모니터링
6. **DB 쿼리 최적화**:
   - `find()` 대신 `find({ select: ['id', 'code', 'name'] })` 사용으로 필요 컬럼만 로드
   - N+1 쿼리 방지: `leftJoinAndSelect` 또는 eager 로딩 활용
   - 타임존 설정: UTC (Z) 사용으로 일관성 유지

---

## 참고 자료

- [NestJS 공식 문서](https://docs.nestjs.com)
- [TypeORM 문서](https://typeorm.io)
- [BullMQ 문서](https://docs.bullmq.io)
- [NestJS JWT](https://docs.nestjs.com/security/authentication)
- [RSS 피드 명세](https://www.rssboard.org/)
- 한국투자증권 API 문서 (내부)
- Google Gemini API 문서

## 최근 추가된 기능 (2026-02-11)

### 1. Google News RSS 수집
- **모듈**: `google-rss/`, `rss-reader/`, `xml-parser/`
- **기능**: Google News RSS 피드 자동 수집 및 파싱
- **통합**: NewsService에 통합되어 뉴스 조회 API 제공

### 2. 카테고리별 뉴스 조회
- **엔드포인트**: `GET /v1/news/categories/{category}`
- **기능**: 카테고리별 뉴스 필터링 조회
- **캐싱**: Redis를 활용한 성능 최적화

### 3. JWT 인증
- **모듈**: `auth/`
- **기능**: JWT 기반 사용자 인증
- **보호**: `@UseGuards(JwtGuard)` 데코레이터로 라우트 보호
- **갱신**: Refresh Token으로 Access Token 자동 갱신

---

## 자주 마주치는 상황

### Queue 작업이 처리되지 않음

1. **Redis 연결 확인**: `redis-cli PING` → PONG 반환 확인
2. **Queue Job 이름 체크**: `@OnQueueProcessor(JobName)` 데코레이터 정확한지 확인
   - Job 이름이 FlowProducer에 등록된 이름과 정확히 일치해야 함
3. **Job 데이터 직렬화 가능 확인**: 순환 참조, Symbol 없는지 확인
4. **로그 확인**: `NestJS debug` 또는 `BullMQ explorer` 로그
5. **비동기 처리 확인**: `@OnQueueProcessor()` 메서드 반드시 `async` 함수여야 함

### Gemini CLI 응답이 JSON이 아님

- Gemini 모델 가용성 확인: `gemini models list`
- `--output-format json` 플래그 포함 확인
- 프롬프트가 valid JSON을 반환하도록 설계되었는지 확인
- 에러 로깅에서 stderr 내용 확인

### 한국투자증권 WebSocket 자주 끊김

- 토큰 만료 체크: 유효 기간 갱신 로직 확인
- 네트워크 연결 상태 모니터링
- 재연결 로직 구현 확인: `KoreaInvestmentCollectorProcessor`
- 구독 메시지 형식 재확인 (H0UNCNT0 vs H0STCNT0)

### JWT 토큰 검증 실패

- JWT_SECRET 환경변수 설정 확인
- 토큰 형식 확인: `Authorization: Bearer <token>`
- 토큰 만료 확인: `JWT_EXPIRATION` 설정값 검토
- 반드시 `JwtGuard`를 `@UseGuards(JwtGuard)` 데코레이터로 사용

### Google RSS / RSS Reader 파싱 오류

- XML 피드 URL 유효성 확인
- RssReaderService 로그 확인: 파싱 단계별 오류
- XmlParserService: 인코딩 문제 체크 (UTF-8)
- Google News RSS URL 형식: `https://news.google.com/rss?q={query}&hl=ko`

### 뉴스 크롤링 실패

- 네트워크 연결 확인 (외부 API 접근)
- NewsService 캐시 상태 확인: Redis TTL 만료
- 크롤링 스케줄 확인: `@Cron` 데코레이터 설정
- API Rate Limiting 확인: Naver API 일일 할당량