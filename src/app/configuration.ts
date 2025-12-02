export interface IConfiguration {
    koreaInvestment: {
        host: string;
        key: string;
        secret: string;
    };
    redis: {
        mode?: 'cluster' | 'single';
        host: string;
        port: string | number;
    };
}

export default (): IConfiguration => ({
    koreaInvestment: {
        host: process.env['KOREA_INVESTMENT_HOST'] as string,
        key: process.env['KOREA_INVESTMENT_APP_KEY'] as string,
        secret: process.env['KOREA_INVESTMENT_APP_SECRET'] as string,
    },
    redis: {
        mode: process.env['REDIS_MODE'] as IConfiguration['redis']['mode'],
        host: process.env['REDIS_HOST'] as string,
        port: process.env['REDIS_PORT'] as string | number,
    },
});
