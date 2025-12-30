import { Cluster } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { RedisConnection } from './redis.types';
import { RedisHash, RedisSet, RedisZset } from './redis-types';

@Injectable()
export class RedisHelper {
    constructor(@Inject(RedisConnection) private readonly redis: Cluster) {}

    /**
     * @param key
     */
    public createSet(...key: string[]) {
        return new RedisSet(this.redis, key.join(':'));
    }

    /**
     * @param key
     */
    public createZSet<T = string>(...key: string[]) {
        return new RedisZset<T>(this.redis, key.join(':'));
    }

    /**
     * @param key
     */
    public createHash<T = string>(...key: string[]) {
        return new RedisHash<T>(this.redis, key.join(':'));
    }
}
