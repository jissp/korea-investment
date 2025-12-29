export interface IConfiguration {
    koreaInvestment: {
        user: {
            id: string;
        };
        api: {
            host: string;
            key: string;
            secret: string;
        };
        webSocket: {
            host: string;
        };
    };
    stockPlus: {
        api: {
            host: string;
        };
    };
    redis: {
        mode?: 'cluster' | 'single';
        host: string;
        port: string;
    };
    naver: {
        api: {
            host: string;
            key: string;
            secret: string;
        };
    };
    google: {
        ai: {
            key: string;
        };
    };
}

export default (): IConfiguration => ({
    koreaInvestment: {
        user: {
            id: getEnv('KOREA_INVESTMENT_USER_ID'),
        },
        api: {
            host: getEnv('KOREA_INVESTMENT_HOST'),
            key: getEnv('KOREA_INVESTMENT_APP_KEY'),
            secret: getEnv('KOREA_INVESTMENT_APP_SECRET'),
        },
        webSocket: {
            host: getEnv('KOREA_INVESTMENT_WEBSOCKET_HOST'),
        },
    },
    stockPlus: {
        api: {
            host: getEnv('STOCK_PLUS_HOST'),
        },
    },
    redis: {
        mode: getEnv('REDIS_MODE') === 'cluster' ? 'cluster' : 'single',
        host: getEnv('REDIS_HOST'),
        port: getEnv('REDIS_PORT'),
    },
    naver: {
        api: {
            host: getEnv('NAVER_APP_HOST'),
            key: getEnv('NAVER_APP_CLIENT_ID'),
            secret: getEnv('NAVER_APP_CLIENT_SECRET'),
        },
    },
    google: {
        ai: {
            key: getEnv('GOOGLE_AI_API_KEY'),
        },
    },
});

function getEnv(key: string): string {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return process.env[key] as string;
}
