import * as Redis from 'ioredis';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IConfiguration } from '@app/configuration';
import { RedisAsyncConfig, RedisConfig, RedisConnection } from './redis.types';
import { RedisService } from './redis.service';
import { RedisHelper } from '@modules/redis/redis.helper';

@Module({})
export class RedisModule {
    static async forRootAsync(
        options: RedisAsyncConfig,
    ): Promise<DynamicModule> {
        const providers: Provider[] = [];

        if (options.useFactory) {
            providers.push({
                provide: RedisConfig,
                useFactory: options.useFactory,
                inject: options.inject || [],
            });
        }

        providers.push(
            ...[
                {
                    inject: [RedisConfig],
                    provide: RedisConnection,
                    useFactory: (config: IConfiguration['redis']) => {
                        const clientInfo = {
                            host: config.host,
                            port: Number(config.port),
                            maxRetriesPerRequest: null,
                        };

                        return config.mode === 'cluster'
                            ? new Redis.Cluster([clientInfo], {
                                  enableReadyCheck: false,
                              })
                            : new Redis.Redis(clientInfo);
                    },
                },
            ],
        );

        return {
            global: true,
            module: RedisModule,
            imports: [ConfigModule, ...(options.imports ?? [])],
            providers: [...providers, RedisHelper, RedisService],
            exports: [RedisConnection, RedisHelper, RedisService],
        };
    }

    static forFeature(): DynamicModule {
        return {
            module: RedisModule,
            imports: [RedisModule],
            providers: [RedisHelper, RedisService],
            exports: [RedisHelper, RedisService],
        };
    }
}
