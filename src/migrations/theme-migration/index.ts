import * as dotenv from 'dotenv';
import { chunk, keyBy, uniqBy } from 'lodash';
import { Repository } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    getRepositoryToken,
    TypeOrmModule,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { YN } from '@app/common/types/market.types';
import {
    Theme,
    ThemeDto,
    ThemeModule,
    ThemeStock,
    ThemeStockDto,
} from '@app/modules/repositories/theme';
import configuration, { IConfiguration } from '@app/configuration';
import * as ThemeCodeJson from '@assets/theme_code.json';
import * as KospiCodeJson from '@assets/kospi_code.json';
import * as KosdaqCodeJson from '@assets/kosdaq_code.json';
import { IMigrator } from '../common/migrator.interface';

type ITheme = {
    themeCode: string;
    themeName: string;
    stockCode: string;
};
type StockCode = {
    shortCode: string;
    code: string;
    name: string;
};

const themeList: ITheme[] = ThemeCodeJson as unknown as ITheme[];
const kospiCodes: StockCode[] = KospiCodeJson as unknown as StockCode[];
const kosdaqCodes: StockCode[] = KosdaqCodeJson as unknown as StockCode[];

const stockCodes: StockCode[] = [...kospiCodes, ...kosdaqCodes];
const stockMap = keyBy(stockCodes, 'shortCode');

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
        ThemeModule,
    ],
})
class StockCodeMigrationModule {}

export class Migrator implements IMigrator {
    private app?: INestApplicationContext;
    private repository: Repository<Theme>;
    private themeStockRepository: Repository<ThemeStock>;

    public async init() {
        dotenv.config({
            path: `src/app/env/.env`,
        });

        this.app = await NestFactory.createApplicationContext(
            StockCodeMigrationModule,
        );
        this.repository = this.app.get<Repository<Theme>>(
            getRepositoryToken(Theme),
        );
        this.themeStockRepository = this.app.get<Repository<ThemeStock>>(
            getRepositoryToken(ThemeStock),
        );
    }

    async up(): Promise<void> {
        await this.migration();
        await this.migrationThemeStock();
    }

    private async migration() {
        await this.truncate();
        const uniqThemeList = uniqBy(themeList, (theme) => theme.themeCode);
        const chunks = chunk(uniqThemeList, 20);
        for (const chunk of chunks) {
            await Promise.all(
                chunk.map((theme) => {
                    return this.upsertTheme({
                        code: theme.themeCode,
                        name: theme.themeName,
                        isFavorite: YN.N,
                    });
                }),
            );
        }
    }

    private async migrationThemeStock() {
        await this.truncateThemeStock();

        const filteredTheme = themeList.filter(
            (theme) => !!this.getStock(theme.stockCode),
        );
        const themeStockDtoList = filteredTheme.map(
            ({ themeCode, stockCode }): ThemeStockDto => {
                return {
                    themeCode,
                    stockCode,
                    stockName: this.getStock(stockCode).name,
                };
            },
        );

        const chunks = chunk(themeStockDtoList, 20);
        for (const chunk of chunks) {
            await Promise.all(
                chunk.map((dto) => {
                    return this.upsertThemeStock(dto);
                }, this),
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
        if (this.app) {
            await this.app.close();
        }
    }

    /**
     * @private
     */
    private async truncate() {
        return this.repository.clear();
    }

    /**
     * @private
     */
    private async truncateThemeStock() {
        return this.themeStockRepository.clear();
    }

    /**
     * @param dto
     * @private
     */
    private async upsertTheme(dto: ThemeDto) {
        const entity = this.repository.create(dto);

        return this.repository.insert(entity);
    }

    /**
     * @param dto
     * @private
     */
    private async upsertThemeStock(dto: ThemeStockDto) {
        const entity = this.themeStockRepository.create(dto);

        return this.themeStockRepository.insert(entity);
    }

    /**
     * @param stockCode
     * @private
     */
    private getStock(stockCode: string) {
        return stockMap[stockCode];
    }
}

// npx ts-node -r tsconfig-paths/register src/migrations/theme-migration/index.ts test

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
