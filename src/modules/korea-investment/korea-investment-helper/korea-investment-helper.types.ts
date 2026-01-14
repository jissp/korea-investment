import { AppCredential } from '@modules/korea-investment/common';

export enum KoreaInvestmentHelperProvider {
    Config = 'Config',
    Client = 'Client',
}

export interface KoreaInvestmentHelperConfig {
    host: string;
    websocketHost: string;
    credentialType: CredentialType;
    credential: AppCredential;
}

export enum CredentialType {
    Main = 'Main',
    Additional = 'Additional',
}
