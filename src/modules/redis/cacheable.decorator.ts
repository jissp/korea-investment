import {
    Aspect,
    createDecorator,
    LazyDecorator,
    WrapParams,
} from '@toss/nestjs-aop';
import { RedisService } from './redis.service';

const REDIS_CACHE_DECORATOR = Symbol.for('REDIS_CACHE_DECORATOR');

export interface BaseRedisCacheOptions {
    key: (...args: any) => string;
}

type CacheOptions = BaseRedisCacheOptions & {
    ttl?: number;
};

@Aspect(REDIS_CACHE_DECORATOR)
export class CacheableDecorator implements LazyDecorator<any, CacheOptions> {
    constructor(private readonly redisService: RedisService) {}

    wrap({ method, metadata: options }: WrapParams<any, CacheOptions>) {
        return async (...args: any) => {
            const key = options.key(...args);

            let cachedValue = await this.redisService.get(key);
            if (!cachedValue) {
                cachedValue = await method(...args);
                await this.redisService.set(key, cachedValue, {
                    seconds: options.ttl ?? 60,
                });
            }

            return cachedValue;
        };
    }
}

export const Cacheable = (options: CacheOptions) =>
    createDecorator(REDIS_CACHE_DECORATOR, options);
