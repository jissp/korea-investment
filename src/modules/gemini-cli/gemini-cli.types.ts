import { IConfiguration } from '@app/configuration';

export type GeminiCliOptions = IConfiguration['gemini'];

export enum GeminiCliModel {
    Gemini3Flash = 'gemini-3-flash-preview',
    Gemini3Pro = 'gemini-3-pro-preview',
}

export enum GeminiCliProvider {
    GeminiCliConfig = 'GEMINI_CLI_CONFIG',
}

export interface RequestCallbackEvent<T> {
    eventName: string;
    eventData: T;
}
export interface CallbackEvent<T> {
    eventData: T;
    prompt: GeminiCliResult;
}

export interface GeminiCliResult {
    session_id: string;
    response: string;
    status: any;
}
