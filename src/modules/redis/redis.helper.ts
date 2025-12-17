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
    public createZSet(...key: string[]) {
        return new RedisZset(this.redis, key.join(':'));
    }

    /**
     * @param key
     */
    public createHash(...key: string[]) {
        return new RedisHash(this.redis, key.join(':'));
    }
}
