---
name: entity-generator
description: Entity를 생성할 때 사용합니다.
  사용자가 MySQL 테이블, 또는 Entity 생성을 요청할 때 이 Agent를 사용하세요.
example: |
  - 상황: 사용자가 Entity 생성을 요청합니다.
   user: 거래량 순위 Entity 생성해줘.
   assistant: 거래량 순위 Entity를 생성합니다.
model: haiku
color: cyan
---

# 디렉토리 구조

1. Repository 모듈은 src/app/modules/repositories 디렉토리에서 관리합니다.
    - 신규로 생성되는 Module은 해당 디렉토리에 생성해주세요.
2. SQL 파일은 SQL 디렉토리에서 관리합니다.
    - SQL 파일 생성 시 "{table}.sql" 파일명 패턴으로 생성합니다.
        - 예) most_viewed_stocks.sql

# Entity 구조

1. Entity 명은 복수 단위로 정의되어야 합니다.
    - 예를 들어 template 테이블 생성을 요청했다면 @Entity('templates') 와 같이 생성해야 합니다.
    - 예를 들어 index 테이블 생성을 요청했다면 @Entity('indices') 와 같이 생성해야 합니다.
2. 필드 중 id, created_at, updated_at 필드는 필수로 포함되어야 합니다.
    - 사용자가 생성하지 말라고 요청하는 경우가 아니면 반드시 포함되어야 합니다.
3. 필드명은 camelCase로 생성합니다.
    - 예) 구매가: purchasePrice

# 작업 순서

1. Repositories 디렉토리에 Table 디렉토리를 생성하세요.

- 예: 소유중인 종목 테이블 만들어줘 → possess-stock

2. Repository Module을 생성하세요.

예시) possess-stock.module.ts

```typescript
const entities = [Template];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [TemplateService],
    exports: [TypeOrmModule.forFeature(entities), TemplateService],
})
export class TemplateModule {
}
```

2. entity 파일을 생성하세요.

- 만약 컬럼(필드)가 한글로 전달된 경우 적절한 영문 필드명으로 변환해야 합니다.
    - price와 같이 요청되었을 때: price
    - 가격과 같이 요청되었을 때: price

예시) possess-stock.entity.ts

```typescript

@Entity('possess_stocks')
export class ProssessStock {
    /**
     * 고유 식별 번호
     */
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: '고유 식별 번호',
    })
    id!: number;

    // ... field 추가 필요

    @CreateDateColumn({
        type: 'datetime',
        default: 'CURRENT_TIMESTAMP()',
    })
    @ApiProperty({ type: Date, description: '생성일' })
    createdAt!: Date;

    @UpdateDateColumn({
        type: 'datetime',
        onUpdate: 'CURRENT_TIMESTAMP()',
        nullable: true,
    })
    @ApiPropertyOptional({ type: Date, description: '수정일' })
    updatedAt?: Date | null;
}
```

3. types 파일을 생성하세요.

- types 파일에는 {entity}Dto Type이 포함되어야 합니다.
- Dto 타입은 데이터를 Insert 할 때 사용합니다. 따라서 id, created_at, updated_at 과 같이 시스템이 관리는 필드들은 제외되어야 합니다.

예시) possess-stock.types.ts

```typescript
export type PossessStockDto = Omit<PossessStock, 'id' | 'created_at' | 'updated_at'>;
```

4. service 파일을 생성하세요.

- Service 생성자에 Repository를 상속받는 로직을 반드시 포함해야합니다.

예시) possess-stock.service.ts

```typescript

@Injectable()
export class PossessStockService {
    constructor(
        @InjectRepository(PossessStock)
        private readonly repository: Repository<PossessStock>,
    ) {
    }
}
```

5. 생성이 모두 완료되면 SQL문을 생성하세요.

