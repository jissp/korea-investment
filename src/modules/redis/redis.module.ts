import * as Redis from 'ioredis';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IConfiguration } from '@app/configuration';
import { RedisAsyncConfig, RedisConfig, RedisConnection } from './redis.types';
import { RedisService } from './redis.service';

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
            imports: [ConfigModule, ...(options.imports ?? [])],
            module: RedisModule,
            providers: [...providers, RedisService],
            exports: [RedisConnection, RedisService],
        };
    }

    static forFeature(): DynamicModule {
        return {
            module: RedisModule,
            imports: [RedisModule],
            providers: [RedisService],
            exports: [RedisService],
        };
    }
}
