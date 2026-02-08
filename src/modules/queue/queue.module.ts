import { Cluster } from 'ioredis';
import { DefaultJobOptions, Queue } from 'bullmq';
import { DynamicModule, Provider } from '@nestjs/common';
import {
    BullModule,
    getFlowProducerToken,
    getQueueToken,
} from '@nestjs/bullmq';
import { MetadataScannerModule } from '@modules/metadata-scanner';
import { RedisConnection } from '@modules/redis';
import { getDefaultJobOptions } from './domains';
import { QueueProvider } from './queue.types';
import { QueueExplorer } from './queue.explorer';

export class QueueModule {
    public static forRootAsync(): DynamicModule {
        return {
            module: QueueModule,
            imports: [
                MetadataScannerModule,
                BullModule.forRootAsync({
                    inject: [RedisConnection],
                    useFactory: (redis: Cluster) => {
                        return {
                            connection: redis,
                        };
                    },
                }),
            ],
            providers: [
                QueueExplorer,
                {
                    provide: QueueProvider.BullOptions,
                    inject: [RedisConnection],
                    useFactory: (redis: Cluster) => {
                        return {
                            connection: redis,
                        };
                    },
                },
            ],
        };
    }

    /**
     * @param queueTypes
     * @param flowTypes
     * @param jobOptions
     */
    public static forFeature({
        queueTypes = [],
        flowTypes = [],
        jobOptions,
    }: {
        queueTypes?: string[];
        flowTypes?: string[];
        jobOptions?: DefaultJobOptions;
    }): DynamicModule {
        if (!queueTypes?.length && !flowTypes?.length) {
            return {
                module: QueueModule,
                imports: [],
                exports: [],
            };
        }

        const assignedJobOptions = Object.assign(
            {},
            getDefaultJobOptions(),
            jobOptions,
        );

        const registerQueues = BullModule.registerQueue(
            ...this.createQueueConfigurations(queueTypes, assignedJobOptions),
        );
        const registerFlowProducers = BullModule.registerFlowProducer(
            ...this.createFlowConfigurations(flowTypes),
        );

        return {
            module: QueueModule,
            imports: [registerQueues, registerFlowProducers],
            exports: [registerQueues, registerFlowProducers],
        };
    }

    /**
     * @param queueTypes
     */
    public static getQueueProviders(queueTypes: string[]): Provider[] {
        if (!queueTypes.length) {
            return [];
        }

        return queueTypes.map((queueType) => ({
            provide: queueType,
            inject: [getQueueToken(queueType)],
            useFactory: (queue: Queue) => queue,
        }));
    }

    /**
     * @param flowTypes
     */
    public static getFlowProviders(flowTypes: string[]): Provider[] {
        if (!flowTypes.length) {
            return [];
        }

        return flowTypes.map((flowType) => ({
            provide: flowType,
            inject: [getFlowProducerToken(flowType)],
            useFactory: (queue: Queue) => queue,
        }));
    }

    /**
     * @param queueTypes
     * @param jobOptions
     * @private
     */
    private static createQueueConfigurations(
        queueTypes: string[],
        jobOptions: DefaultJobOptions,
    ) {
        return queueTypes.map((queueType) => {
            return {
                name: queueType,
                defaultJobOptions: jobOptions,
            };
        });
    }

    /**
     * @param flowTypes
     * @private
     */
    private static createFlowConfigurations(flowTypes: string[]) {
        return flowTypes.map((flowType) => {
            return {
                name: flowType,
            };
        });
    }
}
