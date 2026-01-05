import { DefaultJobOptions } from 'bullmq';

export const DEFAULT_JOB_OPTIONS: DefaultJobOptions = {
    removeOnComplete: true,
    removeOnFail: {
        count: 10,
    },
};

export function getDefaultJobOptions() {
    return DEFAULT_JOB_OPTIONS;
}
