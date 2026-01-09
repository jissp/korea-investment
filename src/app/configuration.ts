export interface IConfiguration {
    database: {
        host: string;
        database: string;
        userName: string;
        password: string;
        port: string;
    };
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
        app: {
            search1: {
                host: string;
                key: string;
                secret: string;
            };
            search2: {
                host: string;
                key: string;
                secret: string;
            };
            search3: {
                host: string;
                key: string;
                secret: string;
            };
        };
        api: {
            host: string;
            key: string;
            secret: string;
        };
    };
    gemini: {
        model: string;
    };
}

export default (): IConfiguration => ({
    database: {
        host: getEnv('DATABASE_HOST'),
        database: getEnv('DATABASE_DATABASE'),
        userName: getEnv('DATABASE_USERNAME'),
        password: getEnv('DATABASE_PASSWORD'),
        port: getEnv('DATABASE_PORT'),
    },
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
        app: {
            search1: {
                host: getEnv('NAVER_APP_HOST'),
                key: getEnv('NAVER_APP_CLIENT_ID'),
                secret: getEnv('NAVER_APP_CLIENT_SECRET'),
            },
            search2: {
                host: getEnv('NAVER_APP_HOST'),
                key: getEnv('NAVER_APP_SEARCH_2_CLIENT_ID'),
                secret: getEnv('NAVER_APP_SEARCH_2_CLIENT_SECRET'),
            },
            search3: {
                host: getEnv('NAVER_APP_HOST'),
                key: getEnv('NAVER_APP_SEARCH_3_CLIENT_ID'),
                secret: getEnv('NAVER_APP_SEARCH_3_CLIENT_SECRET'),
            },
        },
    },
    gemini: {
        model: getEnv('GEMINI_CLI_MODEL'),
    },
});

function getEnv(key: string): string {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return process.env[key];
}
