import { Cluster } from 'ioredis';
import { Logger } from '@nestjs/common';

/**
 * Redis Set을 사용하여 데이터를 관리합니다.
 * @see https://redis.io/topics/data-types#sets
 */
export class RedisSet {
    private readonly logger: Logger = new Logger(RedisSet.name);

    constructor(
        private readonly redis: Cluster,
        private readonly key: string,
    ) {}

    /**
     * Set 목록을 조회합니다.
     */
    public async list(): Promise<string[]> {
        return this.redis.smembers(this.key);
    }

    /**
     * Set에 데이터를 추가합니다.
     * @param value
     */
    public async add(...value: string[]) {
        if (!value.length) {
            return true;
        }

        try {
            await this.redis.sadd(this.key, value);

            return true;
        } catch (error) {
            this.logger.error(error);

            return false;
        }
    }

    /**
     * Set에서 데이터를 제거합니다.
     * @param value
     */
    public async remove(...value: string[]) {
        if (!value.length) {
            return true;
        }

        try {
            await this.redis.srem(this.key, value);

            return true;
        } catch (error) {
            this.logger.error(error);

            return false;
        }
    }

    /**
     * Set에 데이터가 존재하는지 확인합니다.
     * @param value
     * @returns boolean
     */
    public async exists(value: string) {
        const result = await this.redis.sismember(this.key, value);

        return result > 0;
    }

    /**
     * Set의 데이터 개수를 반환합니다.
     * @returns number
     */
    public async count() {
        return this.redis.scard(this.key);
    }

    /**
     */
    public async clear() {
        return this.redis.del(this.key);
    }
}
