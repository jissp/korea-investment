import { Nullable } from '@common/types';

export interface IConfiguration {
    koreaInvestment: {
        api: {
            host: string;
            key: string;
            secret: string;
        };
        webSocket: {
            host: string;
        };
    };
    redis: {
        mode?: 'cluster' | 'single';
        host: string;
        port: string;
    };
}

export default (): IConfiguration => ({
    koreaInvestment: {
        api: {
            host: getEnv('KOREA_INVESTMENT_HOST'),
            key: getEnv('KOREA_INVESTMENT_APP_KEY'),
            secret: getEnv('KOREA_INVESTMENT_APP_SECRET'),
        },
        webSocket: {
            host: getEnv('KOREA_INVESTMENT_WEBSOCKET_HOST'),
        },
    },
    redis: {
        mode: getEnv('REDIS_MODE') === 'cluster' ? 'cluster' : 'single',
        host: getEnv('REDIS_HOST'),
        port: getEnv('REDIS_PORT'),
    },
});

function getEnv(key: string): string {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return process.env[key] as string;
}
