export enum AuthProvider {
    Config = 'Config',
}

export interface JwtPayload {
    account: number;
    iat?: number; // 발급 시간
    exp?: number; // 만료 시간
}
