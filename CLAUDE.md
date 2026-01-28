# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

**Korea Investment**: 한국투자증권 API와 Google Gemini를 활용한 실시간 주식 분석 및 정보 제공 시스템

- **Framework**: NestJS 11.x (TypeScript)
- **Database**: MySQL (TypeORM with SnakeNamingStrategy)
- **Cache/Queue**: Redis + BullMQ
- **WebSocket**: Socket.io (실시간 체결가 데이터)
- **AI**: Google Gemini CLI (종목/시장 분석)
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

### 빌드

```bash
npm run build
```

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

### 모듈 구조

```
src/
├── app/
│   ├── app.module.ts                 # 루트 모듈
│   ├── configuration.ts              # 환경 설정 (ConfigModule)
│   ├── controllers/                  # REST API (13개 컨트롤러)
│   ├── gateways/
│   │   └── korea-investment-be.gateway.ts  # WebSocket Gateway
│   └── modules/
│       ├── ai-analyzer/              ⭐ AI 분석 (Adapter, Processor, Service)
│       │   └── analyzers/
│       │       ├── stock-analyzer/          # 종목 분석
│       │       ├── market-analyzer/         # 시장 분석
│       │       └── exhaustion-trace-analyzer/ # 고갈 분석
│       ├── korea-investment-collector/ ⭐ 실시간 수집 (Socket, Listener, Processor)
│       ├── crawlers/                  # 스케줄 크롤러 (@Cron)
│       └── repositories/              # Data Access Layer (15+ 저장소)
├── modules/
│   ├── korea-investment/              # 한국투자증권 API 클라이언트
│   │   ├── korea-investment-quotation-client/
│   │   ├── korea-investment-web-socket/
│   │   └── korea-investment-web-socket/pipes/ # 데이터 변환 파이프
│   ├── gemini-cli/                    # Google Gemini CLI 래퍼
│   ├── naver/                         # Naver 뉴스 API
│   ├── queue/                         # BullMQ 관리
│   └── redis/                         # Redis 서비스 (캐시, 락)
└── common/                            # 공용 유틸리티, Guard, Transformer
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

---

## 데이터베이스

### 주요 Entity

- `Stock`: 종목 (code, shortCode, name, marketType 등)
- `StockDailyInvestor`: 일일 투자자 정보
- `AiAnalysisReport`: AI 분석 결과 (title, content, reportType)
- `News`: 뉴스 기본 정보
- `StockNews`: 종목-뉴스 매핑
- `Account`, `AccountStock`: 사용자 계정
- `Keyword`, `KeywordNews`: 키워드 분석

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

## 성능 최적화 포인트

1. **BullMQ concurrency**: Gemini 호출은 3 (병렬 처리)
2. **Redis TTL**: 캐시 만료 시간 조정
3. **DB 인덱스**: StockCode (shortCode), StockNews (stock_id)
4. **API Rate Limiting**: 한국투자증권 API 요청 조절
5. **WebSocket 브로드캐스트**: 클라이언트 수 모니터링

---

## 참고 자료

- [NestJS 공식 문서](https://docs.nestjs.com)
- [TypeORM 문서](https://typeorm.io)
- [BullMQ 문서](https://docs.bullmq.io)
- 한국투자증권 API 문서 (내부)
- Google Gemini API 문서

# 필수 사항
- Never switch to Plan mode unless I explicitly request it. Always prioritize Act mode for direct implementation.