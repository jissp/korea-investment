import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {
    getRedisKey,
    RedisHelper,
    RedisService,
    RedisSet,
} from '@modules/redis';
import {
    AccountInfo,
    AccountStock,
    KoreaInvestmentAccountKey,
} from './korea-investment-account.types';

@Injectable()
export class KoreaInvestmentAccountService {
    private readonly accountSet: RedisSet;

    constructor(
        redisHelper: RedisHelper,
        private readonly redisService: RedisService,
    ) {
        this.accountSet = redisHelper.createSet(
            KoreaInvestmentAccountKey.Accounts,
        );
    }

    /**
     * 계좌 목록을 조회합니다.
     */
    public async getAccountNumbers() {
        return this.accountSet.list();
    }

    /**
     * 계좌 정보를 저장합니다.
     */
    public async setAccountInfo(accountNumber: string, info: AccountInfo) {
        return this.redisService.set(
            this.getAccountInfoKey(accountNumber),
            JSON.stringify(info),
            {
                seconds: 3600,
            },
        );
    }

    /**
     * 계좌 정보를 조회합니다.
     */
    public async getAccountInfo(accountNumber: string): Promise<AccountInfo> {
        const result = await this.redisService.get(
            this.getAccountInfoKey(accountNumber),
        );
        if (!result) {
            throw new NotFoundException('계좌 정보가 존재하지 않습니다.');
        }

        try {
            return JSON.parse(result) as AccountInfo;
        } catch (error) {
            throw new InternalServerErrorException('계좌 정보 변환 오류');
        }
    }

    /**
     * 계좌에 대한 주식 정보를 저장합니다.
     * @param account
     * @param accountStockItems
     */
    public async setAccountStocks(
        account: string,
        accountStockItems: AccountStock[],
    ) {
        return this.redisService.set(
            this.getAccountStockKey(account),
            JSON.stringify(accountStockItems),
            {
                seconds: 3600,
            },
        );
    }

    /**
     * 계좌에 대한 주식 정보를 조회합니다.
     * @param account
     */
    public async getAccountStocks(account: string): Promise<AccountStock[]> {
        const result = await this.redisService.get(
            this.getAccountStockKey(account),
        );
        if (!result) {
            return [];
        }

        try {
            return JSON.parse(result) as AccountStock[];
        } catch (error) {
            throw new InternalServerErrorException('계좌 주직 정보 변환 오류');
        }
    }

    /**
     * @param account
     * @private
     */
    private getAccountInfoKey(account: string) {
        return getRedisKey(KoreaInvestmentAccountKey.AccountInfo, account);
    }

    /**
     * @param account
     * @private
     */
    private getAccountStockKey(account: string) {
        return getRedisKey(KoreaInvestmentAccountKey.AccountStocks, account);
    }
}
