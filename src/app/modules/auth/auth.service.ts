import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Nullable } from '@common/types';
import { IConfiguration } from '@app/configuration';
import { Account, AccountService } from '@app/modules/repositories/account';
import { AuthProvider, JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly accountService: AccountService,
        @Inject(AuthProvider.Config)
        private readonly jwtConfig: IConfiguration['jwt'],
    ) {}

    /**
     * JWT 발급
     * @param accountId
     */
    public async generateAccessToken(accountId: string) {
        const account =
            await this.accountService.getAccountByAccountId(accountId);
        if (!account) {
            throw new NotFoundException('Account not found');
        }

        const expiresIn = Number(this.jwtConfig.expiresIn);

        const jwtPayload: JwtPayload = {
            account: account.id,
            iat: new Date().getTime(),
        };

        return {
            accessToken: await this.jwtService.signAsync(jwtPayload),
            expiresIn,
        };
    }

    /**
     * JWT 검증
     * @param token
     */
    public async verify(token: string): Promise<JwtPayload> {
        const currentTimestamp = new Date().getTime();
        const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

        if (currentTimestamp > payload.exp!) {
            throw new BadRequestException('Token expired.');
        }

        return payload;
    }

    /**
     * Account 조회
     * @param id
     */
    public async getAccount(id: number): Promise<Nullable<Account>> {
        return this.accountService.getAccount(id);
    }
}
