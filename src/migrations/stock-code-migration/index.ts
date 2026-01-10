import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { INestApplicationContext, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    getRepositoryToken,
    TypeOrmModule,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Stock, StockDto, StockModule } from '@app/modules/repositories/stock';
import configuration, { IConfiguration } from '@app/configuration';
import { IMigrator } from '../common/migrator.interface';
import * as KrxKosdaqCodeJson from '@assets/kosdaq_code.json';
import * as KrxKospiCodeJson from '@assets/kospi_code.json';
import * as NxtKosdaqCodeJson from '@assets/nxt_kosdaq_code.json';
import * as NxtKospiCodeJson from '@assets/nxt_kospi_code.json';
import { ExchangeType, MarketType } from '@app/common/types';

type StockCode = {
    shortCode: string;
    code: string;
    name: string;
};

const KrxKosdaqCodes: StockCode[] = KrxKosdaqCodeJson as unknown as StockCode[];
const KrxKospiCodes: StockCode[] = KrxKospiCodeJson as unknown as StockCode[];
const NxtKosdaqCodes: StockCode[] = NxtKosdaqCodeJson as unknown as StockCode[];
const NxtKospiCodes: StockCode[] = NxtKospiCodeJson as unknown as StockCode[];

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (
                configService: ConfigService,
            ): TypeOrmModuleOptions => {
                const config =
                    configService.get<IConfiguration['database']>('database');
                if (!config) {
                    throw new Error('Database configuration is missing');
                }

                return {
                    type: 'mysql',
                    timezone: 'Z',
                    host: config.host,
                    database: config.database,
                    username: config.userName,
                    password: config.password,
                    port: Number(config.port),
                    synchronize: false,
                    autoLoadEntities: true,
                    namingStrategy: new SnakeNamingStrategy(),
                    extra: {
                        decimalNumbers: true,
                    },
                };
            },
        }),
        StockModule,
    ],
})
class StockCodeMigrationModule {}

export class Migrator implements IMigrator {
    private app?: INestApplicationContext;
    private stockRepository: Repository<Stock>;

    public async init() {
        dotenv.config({
            path: `src/app/env/.env`,
        });

        this.app = await NestFactory.createApplicationContext(
            StockCodeMigrationModule,
        );
        this.stockRepository = this.app.get<Repository<Stock>>(
            getRepositoryToken(Stock),
        );
    }

    async up(): Promise<void> {
        await this.migrationKospi();
        await this.migrationKosdaq();

        // const kosdaqChunks = _.chunk(KrxKosdaqCodes, 20);
    }

    private async migrationKospi() {
        const chunks = _.chunk(KrxKospiCodes, 20);
        for (const chunk of chunks) {
            await Promise.all(
                chunk.map((stock) => {
                    console.log(stock.code, stock.name);

                    return this.upsertStock({
                        marketType: MarketType.Domestic,
                        exchangeType: ExchangeType.KOSPI,
                        code: stock.code,
                        shortCode: stock.shortCode,
                        name: stock.name,
                    });
                }),
            );
        }
    }

    private async migrationKosdaq() {
        const chunks = _.chunk(KrxKosdaqCodes, 20);
        for (const chunk of chunks) {
            await Promise.all(
                chunk.map((stock) => {
                    console.log(stock.code, stock.name);

                    return this.upsertStock({
                        marketType: MarketType.Domestic,
                        exchangeType: ExchangeType.KOSDAQ,
                        code: stock.code,
                        shortCode: stock.shortCode,
                        name: stock.name,
                    });
                }),
            );
        }
    }

    async down(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async test(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async close(): Promise<void> {
        return Promise.resolve(undefined);
    }

    /**
     * @param stockDto
     * @private
     */
    private async upsertStock(stockDto: StockDto) {
        return this.stockRepository
            .createQueryBuilder()
            .insert()
            .into(Stock)
            .values(stockDto)
            .orUpdate(['name'], ['short_code'])
            .updateEntity(false)
            .execute();
    }
}

// npx ts-node -r tsconfig-paths/register src/migrations/stock-code-migration/index.ts test

const [, , command] = process.argv;
const migrator = new Migrator();
migrator.init().then(async () => {
    console.log('init completed');

    if (command === 'up') {
        await migrator.up();
    } else if (command === 'down') {
        await migrator.down();
    } else if (command === 'test') {
        await migrator.test();
    }

    await migrator.close();
});
