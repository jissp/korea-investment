import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { IConfiguration } from '@app/configuration';

export const RedisConfig = Symbol('RedisConfig');
export const RedisConnection = Symbol('RedisConnection');

export const RedisNullString = '__NULL__';

export type RedisConfig = IConfiguration['redis'];

export interface RedisAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
    /**
     * Type (class name) of provider (instance to be registered and injected).
     */
    useClass?: Type<IConfiguration['redis']>;

    /**
     * Factory function that returns an instance of the provider to be injected.
     */
    useFactory?: (
        ...args: any[]
    ) => Promise<IConfiguration['redis']> | IConfiguration['redis'];

    /**
     * Optional list of providers to be injected into the context of the Factory function.
     */
    inject?: FactoryProvider['inject'];
}

export enum RedisSetType {
    NX = 'NX', // Only set the key if it does not already exist.
    XX = 'XX', // Only set the key if it already exists.
}

export enum RedisExpireType {
    EX = 'EX', // seconds
    PX = 'PX', // milliseconds
}

export interface RedisKeySetOptions {
    seconds: number;
}
