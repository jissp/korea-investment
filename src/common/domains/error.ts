import { AxiosError } from 'axios';

/**
 * @param error
 */
export function normalizeError(error: unknown): Error {
    if (error instanceof AxiosError) {
        return new Error(error.message);
    }

    if (error instanceof Error) {
        return error;
    }

    return new Error('Unknown error');
}
