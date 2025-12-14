import { WorkerOptions } from 'bullmq';

export const QueueMetadataKey = 'QueueMetadataKey';
export type QueueMetadataValue = {
    queueName: string[];
    workerOptions?: WorkerOptions;
};

export enum QueueProvider {
    BullOptions = 'BullOptions',
}
