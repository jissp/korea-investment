import { NotFoundException } from '@nestjs/common';

export interface IConfiguration {
    jwt: {
        secret: string;
        expiresIn: string;
    };
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
        additionalApi: {
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
    rss: {
        google: {
            business: string;
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
    slack?: {
        signingSecret: string;
        appToken: string;
        token: string;
        channel: {
            stock: string;
            geminiLog: string;
        };
    };
}

export default (): IConfiguration => ({
    jwt: {
        secret: getEnv('JWT_SECRET'),
        expiresIn: getEnv('JWT_EXPIRES_IN'),
    },
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
        additionalApi: {
            host: getEnv('KOREA_INVESTMENT_HOST'),
            key: getEnv('KOREA_INVESTMENT_ADDITIONAL_APP_KEY'),
            secret: getEnv('KOREA_INVESTMENT_ADDITIONAL_APP_SECRET'),
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
    rss: {
        google: {
            business: getEnv('GOOGLE_RSS_BUSINESS'),
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
    slack: {
        signingSecret: getEnv('SLACK_SIGNING_SECRET'),
        appToken: getEnv('SLACK_APP_TOKEN'),
        token: getEnv('SLACK_BOT_TOKEN'),
        channel: {
            stock: getEnv('SLACK_STOCK_CHANNEL_ID'),
            geminiLog: getEnv('SLACK_STOCK_GEMINI_LOG_CHANNEL_ID'),
        },
    },
});

function getEnv(key: string): string {
    if (!process.env[key]) {
        throw new NotFoundException(
            `Missing required environment variable: ${key}`,
        );
    }

    return process.env[key];
}
