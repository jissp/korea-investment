import { Cluster } from 'ioredis';
import { Logger } from '@nestjs/common';

/**
 * Redis ZSet을 사용하여 데이터를 관리합니다.
 * @see https://redis.io/topics/data-types#sorted-sets
 */
export class RedisZset<T = string> {
    private readonly logger: Logger = new Logger(RedisZset.name);

    constructor(
        private readonly redis: Cluster,
        private readonly key: string,
    ) {}

    /**
     * ZSet에서 내림차순으로 데이터를 조회합니다.
     */
    public async list(
        limit: number = 100,
        options?: {
            isParse: boolean;
        },
    ): Promise<T[]> {
        const items = await this.redis.zrevrange(this.key, 0, limit - 1);

        if (!items) {
            return [];
        }

        if (!options?.isParse) {
            return items as T[];
        }

        try {
            return items.map((index) => JSON.parse(index) as T);
        } catch {
            return [];
        }
    }

    /**
     * ZSet에 데이터를 추가합니다.
     * @param value
     * @param score
     */
    public async add(value: string, score: number) {
        try {
            await this.redis.zadd(this.key, score, value);

            return true;
        } catch (error) {
            this.logger.error(error);

            return false;
        }
    }

    /**
     * ZSet에서 데이터를 제거합니다.
     * @param value
     */
    public async remove(value: string) {
        try {
            await this.redis.zrem(this.key, value);

            return true;
        } catch (error) {
            this.logger.error(error);

            return false;
        }
    }

    /**
     * ZSet에 데이터가 존재하는지 확인합니다.
     * @param value
     * @returns boolean
     */
    public async exists(value: string) {
        const result = await this.redis.zscore(this.key, value);

        return result !== null;
    }

    /**
     * ZSet의 데이터 개수를 반환합니다.
     * @returns number
     */
    public async count() {
        return this.redis.zcard(this.key);
    }

    /**
     * ZSet Key를 제거합니다.
     * @returns number
     */
    public async clear() {
        return this.redis.del(this.key);
    }
}
