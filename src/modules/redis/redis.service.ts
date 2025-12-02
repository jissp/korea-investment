import { Inject, Injectable } from '@nestjs/common';
import { Cluster } from 'ioredis';
import {
    RedisConnection,
    RedisExpireType,
    RedisKeySetOptions,
    RedisNullString,
    RedisSetType,
} from '@modules/redis/redis.types';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class RedisService {
    private defaultExpiredSeconds = 60;

    constructor(@Inject(RedisConnection) private readonly redis: Cluster) {}

    /**
     * 데이터를 레디스에 저장한다.
     * @param key
     * @param value
     * @param options
     */
    public async set(
        key: string,
        value: string | number | null,
        options?: RedisKeySetOptions,
    ) {
        return this.setEx(key, value, options);
    }

    /**
     * 레디스에 저장된 데이터를 가져온다.
     * @param key
     */
    public async get(key: string) {
        const data = await this.redis.get(key);

        return data === RedisNullString ? null : data;
    }

    /**
     * 레디스에 저장된 데이터를 삭제한다.
     * @param key
     */
    public async del(key: string) {
        return this.redis.del(key);
    }

    /**
     * 특정 키에 대해서 Lock을 설정한다.
     * @param key
     * @param options
     */
    public async lock(key: string, options?: RedisKeySetOptions) {
        return this.setNx(key, 'L', options);
    }

    /**
     * Lock걸린 Key를 삭제한다.
     * @param key
     */
    public async unLock(key: string) {
        return this.redis.del(`{LOCK}:${key}`);
    }

    /**
     * Set key to hold the string value and set key to timeout after a given number of seconds.
     * @param key
     * @param value
     * @param options
     * @private
     */
    private async setEx(
        key: string,
        value: string | number | null,
        options?: RedisKeySetOptions,
    ) {
        const result = await this.redis.set(
            key,
            isNil(value) ? RedisNullString : value,
            RedisExpireType.EX,
            this.getOptionExpiredSeconds(options?.seconds),
        );

        return result === 'OK';
    }

    /**
     * Set key to hold string value if key does not exist.
     * @param key
     * @param value
     * @param options
     * @private
     */
    private async setNx(
        key: string,
        value: string | number,
        options?: RedisKeySetOptions,
    ) {
        const result = await this.redis.set(
            `{LOCK}:${key}`,
            value,
            RedisExpireType.EX,
            this.getOptionExpiredSeconds(options?.seconds),
            RedisSetType.NX,
        );

        return result === 'OK';
    }

    /**
     * 옵션의 expire 시간을 가져온다. (미설정 시 기본 Expire 시간을 사용)
     * @param seconds
     * @private
     */
    private getOptionExpiredSeconds(seconds?: number) {
        return seconds ?? this.defaultExpiredSeconds;
    }
}
