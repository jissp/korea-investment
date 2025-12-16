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
        }
    }
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
        }
    }
});

function getEnv(key: string): string {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return process.env[key] as string;
}
