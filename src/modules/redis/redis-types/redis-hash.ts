import { Cluster } from 'ioredis';
import { Logger } from '@nestjs/common';
import { Nullable } from '@common/types';

export class RedisHash<T = string> {
    private readonly logger: Logger = new Logger(RedisHash.name);

    constructor(
        private readonly redis: Cluster,
        private readonly key: string,
    ) {}

    /**
     * Hash에서 필드 데이터를 조회합니다.
     * @param field
     * @param options
     */
    public async get(
        field: string,
        options?: {
            isParse: boolean;
        },
    ): Promise<Nullable<T>> {
        const item = await this.redis.hget(this.key, field);
        if (!item) {
            return null;
        }

        if (!options?.isParse) {
            return item as T;
        }

        try {
            return JSON.parse(item) as T;
        } catch {
            return null;
        }
    }

    /**
     * Hash에서 여러 필드 데이터를 조회합니다.
     * @param fields
     */
    public async mget(fields: string[]): Promise<Nullable<string>[]> {
        return this.redis.hmget(this.key, ...fields);
    }

    /**
     * Hash의 모든 필드 데이터를 조회합니다.
     * @returns []
     */
    public async list(): Promise<string[]> {
        return this.redis.hvals(this.key);
    }

    /**
     * Hash에 데이터를 추가합니다.
     * @param field
     * @param value
     */
    public async add(field: string, value: string) {
        try {
            await this.redis.hset(this.key, field, value);

            return true;
        } catch (error) {
            this.logger.error(error);

            return false;
        }
    }

    /**
     * Hash에서 데이터를 제거합니다.
     * @param field
     */
    public async remove(field: string) {
        try {
            await this.redis.hdel(this.key, field);

            return true;
        } catch (error) {
            this.logger.error(error);

            return false;
        }
    }

    /**
     * Hash에 데이터가 존재하는지 확인합니다.
     * @param field
     * @returns boolean
     */
    public async exists(field: string) {
        return this.redis.hexists(this.key, field);
    }

    /**
     * Hash의 데이터 개수를 반환합니다.
     * @returns number
     */
    public async count() {
        return this.redis.hlen(this.key);
    }
}
