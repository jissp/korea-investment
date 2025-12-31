import { DefaultJobOptions } from 'bullmq';

export const DEFAULT_JOB_OPTIONS: DefaultJobOptions = {
    removeOnComplete: true,
    removeOnFail: {
        age: 86400,
        count: 100,
    },
};

export function getDefaultJobOptions() {
    return DEFAULT_JOB_OPTIONS;
}
