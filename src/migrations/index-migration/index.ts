import * as dotenv from 'dotenv';
import * as _ from 'lodash';
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
import configuration, { IConfiguration } from '@app/configuration';
import * as IdxCodeJson from '@assets/idxcode.json';
import { IMigrator } from '../common/migrator.interface';
import {
    DomesticIndex,
    DomesticIndexDto,
    DomesticIndexModule,
} from '@app/modules/repositories/domestic-index';

type Idx = {
    shortCode: string;
    code: string;
};

const idxList: Idx[] = IdxCodeJson as unknown as Idx[];

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
        DomesticIndexModule,
    ],
})
class StockCodeMigrationModule {}

export class Migrator implements IMigrator {
    private app?: INestApplicationContext;
    private repository: Repository<DomesticIndex>;

    public async init() {
        dotenv.config({
            path: `src/app/env/.env`,
        });

        this.app = await NestFactory.createApplicationContext(
            StockCodeMigrationModule,
        );
        this.repository = this.app.get<Repository<DomesticIndex>>(
            getRepositoryToken(DomesticIndex),
        );
    }

    async up(): Promise<void> {
        await this.truncate();
        await this.migration();
    }

    private async migration() {
        const chunks = _.chunk(idxList, 20);
        for (const chunk of chunks) {
            await Promise.all(
                chunk.map((idx) => {
                    return this.upsertStock({
                        code: idx.shortCode,
                        name: idx.code,
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
     * @param dto
     * @private
     */
    private async upsertStock(dto: DomesticIndexDto) {
        return this.repository
            .createQueryBuilder()
            .insert()
            .into(DomesticIndex)
            .values(dto)
            .orUpdate(['name'], ['code'])
            .updateEntity(false)
            .execute();
    }
}

// npx ts-node -r tsconfig-paths/register src/migrations/index-migration/index.ts test

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
