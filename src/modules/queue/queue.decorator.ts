import { WorkerOptions } from 'bullmq';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { QueueMetadataKey, QueueMetadataValue } from './queue.types';

/**
 * Bull Queue Processor 메서드에 붙이는 데코레이터입니다.
 * @param queueName
 * @param workerOptions
 * @constructor
 */
export function OnQueueProcessor(
    queueName: string | string[],
    workerOptions?: Partial<WorkerOptions>,
) {
    return applyDecorators(
        SetMetadata(QueueMetadataKey, {
            queueName: Array.isArray(queueName) ? queueName : [queueName],
            workerOptions,
        } as QueueMetadataValue),
    );
}
