# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS application that integrates with Korea Investment & Securities API for stock trading, quotation services, and real-time market data via WebSocket. The application uses Redis for token caching and Socket.IO for WebSocket gateway functionality.

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Start in development mode (with watch)
npm run start:dev

# Start with environment file
npm run start

# Build the project
npm run build

# Run in production
npm run start:prod
```

### Testing
```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run e2e tests (uses jest-e2e.json config)
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Debug tests
npm run test:debug
```

### Code Quality
```bash
# Lint and auto-fix
npm run lint

# Format code with Prettier
npm run format
```

### Docker
```bash
# Start services (API + MySQL + Redis)
docker-compose up

# Build and start
docker-compose up --build

# Run only specific services
docker-compose up mysql redis
```

### Stock Code Parsing
The project includes TypeScript scripts to parse Korean stock and sector codes from `.mst` files:
```bash
# Parse all domestic codes (stock + sector) - outputs to src/assets/
npm run convert-korea-investment-code

# Parse overseas index codes - outputs to src/assets/
npm run convert-korea-investment-overseas-code

# Or run individually:
npx ts-node scripts/stock-code-parse/index.ts
npx ts-node scripts/sector-code-parse/index.ts
npx ts-node scripts/overseas-index-code-parse/index.ts
```
These scripts use `iconv-lite` to decode EUC-KR encoded `.mst` files and output JSON with shortCode, code, and name fields.

## Architecture

### Module Structure

The codebase follows NestJS modular architecture with clear separation of concerns:

1. **App Module** (`src/app/`): Root module that loads configuration and initializes global modules (Redis)

2. **Korea Investment Module** (`src/modules/korea-investment/`): Multi-module client library and business logic
   - **Common**: Base classes and shared types (`AppCredentials`, `KoreaInvestmentBaseHeader`, `MarketDivCode`, `CustomerType`)
   - **Config Module**: Manages API credentials (appkey, appsecret) and host configuration (API + WebSocket)
   - **OAuth Client**: Handles authentication tokens
     - REST API token: `/oauth2/tokenP` (TTL: dynamic based on response)
     - WebSocket token: `/oauth2/Approval` (TTL: 24 hours, cached for 23 hours)
     - Token revocation: `/oauth2/revokeP`
   - **Quotation Client**: Stock price and market data queries (inquirePrice, inquireCcnl, inquireIndexPrice)
   - **Rank Client**: Stock ranking and sorted list queries
   - **Helper Service**: Central request handler that:
     - Manages OAuth and WebSocket token lifecycle with Redis caching
     - Provides authenticated request wrapper (`buildHeaders()`, `request()`)
     - Methods: `getToken()`, `getWebSocketToken()`, `buildHeaders()`, `request()`
   - **WebSocket Module**: Real-time market data streaming (see WebSocket Architecture below)

3. **Redis Module** (`src/modules/redis/`): Global Redis connection management
   - Supports both single and cluster modes
   - Dynamic module pattern with `forRootAsync()` for app-level setup
   - `forFeature()` for feature module injection
   - Used primarily for OAuth token caching with TTL

4. **Repository Modules** (`src/app/modules/repositories/`): TypeORM entity modules
   - Each entity has its own module following a consistent structure (see Repository Structure below)
   - Examples: Stock, Account, News, Keyword, FavoriteStock, MarketIndex, StockDailyInvestor
   - Uses `SnakeNamingStrategy` for automatic snake_case column naming
   - `synchronize: false` - database schema is managed manually via SQL files

5. **Service Modules** (`src/app/modules/services/`): Business logic layer
   - NewsService, StockInvestorService, and other domain services
   - Coordinates between repositories and external API clients

6. **Queue Module** (`src/modules/queue/`): BullMQ-based job queue system
   - Used for background tasks and async processing

7. **Additional Integrations**:
   - **Naver API**: News search and keyword search functionality
   - **Gemini CLI**: AI-powered analysis integration
   - **Stock Plus API**: Additional stock data source
   - **Logger Module**: Centralized logging

### Configuration System

Configuration is centralized in `src/app/configuration.ts` with the following environment variables:

**Database (MySQL)**:
- `DATABASE_HOST`: MySQL server host
- `DATABASE_DATABASE`: Database name
- `DATABASE_USERNAME`: Database username
- `DATABASE_PASSWORD`: Database password
- `DATABASE_PORT`: Database port

**Korea Investment API**:
- `KOREA_INVESTMENT_HOST`: API base URL (REST API)
- `KOREA_INVESTMENT_WEBSOCKET_HOST`: WebSocket server URL (real-time data)
- `KOREA_INVESTMENT_APP_KEY`: API application key
- `KOREA_INVESTMENT_APP_SECRET`: API application secret
- `KOREA_INVESTMENT_USER_ID`: User ID for Korea Investment account

**Redis**:
- `REDIS_MODE`: 'cluster' or 'single'
- `REDIS_HOST`: Redis server host
- `REDIS_PORT`: Redis server port (as string, converted to number in code)

**Other Integrations**:
- `NAVER_APP_HOST`: Naver API host
- `NAVER_APP_CLIENT_ID`, `NAVER_APP_CLIENT_SECRET`: Naver API credentials (supports up to 3 search apps)
- `STOCK_PLUS_HOST`: Stock Plus API host
- `GEMINI_CLI_MODEL`: Gemini AI model name
- `PORT`: Application server port (default: 3100)

Environment files should be placed in `src/app/env/.env`

Configuration structure separates API and WebSocket hosts:
```typescript
{
  koreaInvestment: {
    api: { host, key, secret },
    webSocket: { host }
  }
}
```

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:
- `@app/*` → `src/app/*`
- `@assets/*` → `src/assets/*`
- `@common/*` → `src/common/*`
- `@modules/*` → `src/modules/*`

Always use these aliases for imports instead of relative paths.

### Token Management Pattern

The `KoreaInvestmentHelperService` implements a critical token caching pattern:
1. Check Redis for existing valid token
2. If not found or expired, request new token from OAuth API
3. Cache in Redis with TTL (`expires_in - 60` seconds for safety margin)
4. Return token for API requests

This pattern prevents rate limiting and reduces API calls.

### Client Architecture

Korea Investment clients follow a layered approach:
- **OAuth Client**: Direct API wrapper for authentication endpoints, uses Axios directly without token management
- **Quotation/Rank Clients**: Business-focused clients that use Helper Service for authenticated requests
- **Helper Service**: Middleware that:
  - Calls `buildHeaders()` with trade ID (e.g., 'FHPST01010000') to create headers with credentials and token
  - Uses `request()` method as a wrapper around Axios with automatic authentication
  - All authenticated endpoints should use Helper Service instead of direct Axios calls

### WebSocket Architecture

Real-time market data streaming is implemented using Socket.IO gateway as a bridge between clients and Korea Investment WebSocket server:

**Flow**: Client (Socket.IO) ↔ Gateway ↔ Korea Investment WS (native WebSocket)

**Key Components**:
1. **KoreaInvestmentBeGateway** (`korea-investment-be.gateway.ts`)
   - Socket.IO server exposed at `/ws` namespace
   - Handles client lifecycle: `handleConnection()`, `handleDisconnect()`
   - Message handlers: `@SubscribeMessage('subscribe')`, `@SubscribeMessage('unsubscribe')`
   - Manages single Korea Investment WebSocket connection shared by all clients
   - Automatically connects when first client connects, disconnects when last client leaves

2. **KoreaInvestmentWsFactory** (`korea-investment-ws.factory.ts`)
   - Factory pattern for creating Korea Investment WebSocket connections
   - Returns `{ webSocket, onMessageObservable }` with RxJS observable for message stream
   - Handles WebSocket events: `message`, `close`, `error`
   - Filters out control messages (PINGPONG, SUBSCRIBE SUCCESS)

3. **KoreaInvestmentWebSocketPipe** (`korea-investment-web-socket.pipe.ts`)
   - Parses raw WebSocket messages with format: `{encrypted}|{tradeId}|{length}|{data}`
   - Splits data by `^` delimiter and chunks by record count
   - Returns array of string arrays (raw field values)

4. **Data Type Pipes** (`pipes/*.pipe.ts`)
   - Type-specific transformers for each trade ID (e.g., H0STASP0, H0STCNT0)
   - Convert raw string arrays into typed objects with proper field names
   - Example: `H0stasp0Pipe` transforms 10-level bid/ask data

**Subscribe/Unsubscribe Pattern**:
```typescript
// Client emits
socket.emit('subscribe', { tr_id: 'H0STASP0', tr_key: '005930' });
socket.emit('unsubscribe', { tr_id: 'H0STASP0', tr_key: '005930' });

// Gateway builds message with approval_key and sends to Korea Investment WS
{
  header: { approval_key, tr_type: '1'/'0', custtype, content_type },
  body: { input: { tr_id, tr_key } }
}
```

**Message Flow**:
1. Korea Investment WS sends pipe-delimited message
2. Factory filters control messages, emits data via RxJS Observable
3. Gateway receives message through Observable subscription
4. Pipe transforms message to string[][] format
5. Gateway broadcasts to all Socket.IO clients via `server.emit('realtime-data', record)`

**Trade IDs** (defined in `types/*.types.ts`):
- `H0STASP0`: 주식호가 (Stock Bid/Ask - 10 levels)
- `H0STCNT0`: 주식체결 (Stock Execution)
- `H0NXASP0`: KOSDAQ 호가
- `H0NXCNT0`: KOSDAQ 체결
- `H0UNASP0`: 업종호가
- `H0UNCNT0`: 업종체결
- `HDFSASP0`: 해외선물옵션호가

### Repository Structure

All repositories follow a consistent pattern based on `.template/repository/`:

**Required Files**:
1. `{entity-name}.entity.ts`: TypeORM entity definition
   - Entity table names must be plural (e.g., `@Entity('templates')` not `@Entity('template')`)
   - Required fields: `id` (auto-generated), `createdAt`, `updatedAt`
   - Field names use camelCase in code, automatically converted to snake_case in database
   - Use minimal decorators - no index/unique definitions (managed in database)
   - Include Swagger decorators (`@ApiProperty`, `@ApiPropertyOptional`)

2. `{entity-name}.types.ts`: Type definitions
   - Define `{EntityName}Dto` as `Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>` for inserts
   - Used when creating new records without system-managed fields

3. `{entity-name}.service.ts`: Repository service with business logic
   - Inject TypeORM Repository via `@InjectRepository(Entity)`
   - Implement CRUD operations and custom queries

4. `{entity-name}.module.ts`: NestJS module definition
   - Export both `TypeOrmModule.forFeature([Entity])` and Service
   - Import in `AppModule` for global availability

**SQL Files**: Create corresponding SQL schema in `sql/` directory for manual database setup

### Migration System

The codebase includes a custom migration system (`src/migrations/`):
- Migrations implement `IMigrator` interface with methods: `init()`, `up()`, `down()`, `test()`, `close()`
- Used for data migration tasks (e.g., stock code migration from assets to database)
- Each migration is a self-contained module with its own logic

### Testing Structure

- Unit tests: `*.spec.ts` files (Jest, rootDir: `src`)
- E2E tests: `*.e2e-spec.ts` files (separate Jest config: `jest-e2e.json`, rootDir: `.`)
- E2E tests exist in feature modules (e.g., `korea-investment-oauth-client/tests/`)
- Jest config includes path alias mappings matching TypeScript configuration

### ESLint Configuration

Using flat config format (`eslint.config.mjs`):
- TypeScript ESLint with type-checked rules
- Prettier integration
- Notable rules:
  - `@typescript-eslint/no-explicit-any`: 'on' (strict)
  - `@typescript-eslint/no-floating-promises`: 'warn'
  - `@typescript-eslint/no-non-null-assertion`: 'off'

## Development Notes

- The project uses `dotenv-cli` to load environment files when starting the app (`npm run start`)
- For development with watch mode, environment variables must be loaded separately (`npm run start:dev` loads from system env or use `dotenv -e src/app/env/.env npm run start:dev`)
- MySQL and Redis are required for the application to run (use `docker-compose up` for local development)
  - MySQL: Port 3306, database: `korea-investment`, user: `nest`, password: `nest!@#`
  - Redis: Port 6379
  - SQL files in `sql/` directory are automatically executed on MySQL container initialization
- Stock code files are stored as JSON in `src/assets/` after parsing `.mst` files
- The codebase uses Korean comments in some places for API endpoint descriptions
- TypeORM `synchronize` is set to `false` - all schema changes must be done via SQL files, not automatic migration

**When adding new REST API endpoints**:
1. Define types in `*.types.ts` files
2. Create client method using `helper.request()` - token injection is automatic
3. Helper Service manages authentication headers via `buildHeaders(tradeId)`

**When adding new WebSocket data types**:
1. Define type interface in `types/{tr_id}.types.ts` (lowercase trade ID)
2. Create pipe in `pipes/{tr_id}.pipe.ts` extending `PipeTransform<string[], {Type}>`
3. Map string array indices to typed object fields in `transform()` method
4. Export from `pipes/index.ts` and `types/index.ts`
5. Trade IDs follow Korea Investment API naming (e.g., H0STASP0 for stock bid/ask)

**When creating new Entity/Repository modules**:
1. Use `.template/repository/` as the base structure
2. Follow the naming convention: entity name must be plural (e.g., `stocks`, `indices`)
3. Create entity in `src/app/modules/repositories/{entity-name}/`
4. Define entity with required fields: `id`, `createdAt`, `updatedAt`
5. Create corresponding DTO type excluding system-managed fields
6. Generate SQL schema file in `sql/` directory
7. Import and register module in `src/app/app.module.ts`
8. Korean field names should be translated to appropriate English camelCase names