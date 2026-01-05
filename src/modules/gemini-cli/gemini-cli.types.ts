import { IConfiguration } from '@app/configuration';

export type GeminiCliOptions = IConfiguration['gemini'];

export enum GeminiCliProvider {
    GeminiCliConfig = 'GEMINI_CLI_CONFIG',
}

export interface RequestCallbackEvent<T> {
    eventName: string;
    eventData: T;
}
export interface CallbackEvent<T> {
    eventData: T;
    prompt: GeminiCliResponse;
}

export interface GeminiCliResponse {
    session_id: string;
    response: string;
    status: any;
}
