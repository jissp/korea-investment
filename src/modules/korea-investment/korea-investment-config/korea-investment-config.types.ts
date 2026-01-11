import { IConfiguration } from '@app/configuration';

export enum KoreaInvestmentConfigProvider {
    AppConfig = 'APP_CONFIG',
}

export type KoreaInvestmentConfig = IConfiguration['koreaInvestment'];
