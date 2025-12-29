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
    AccountStockByGroup,
    AccountStockGroup,
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
            throw new InternalServerErrorException(error);
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
            this.getAccountStocksKey(account),
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
            this.getAccountStocksKey(account),
        );
        if (!result) {
            return [];
        }

        try {
            return JSON.parse(result) as AccountStock[];
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    /**
     * 관심 종목 그룹 목록을 저장합니다.
     * @param userId
     * @param accountStockItems
     */
    public async setAccountStockGroups(
        userId: string,
        accountStockItems: AccountStockGroup[],
    ) {
        return this.redisService.set(
            this.getAccountStockGroupsKey(userId),
            JSON.stringify(accountStockItems),
            {
                seconds: 3600,
            },
        );
    }

    /**
     * 관심 종목 그룹 목록을 조회합니다.
     * @param userId
     */
    public async getAccountStockGroups(
        userId: string,
    ): Promise<AccountStockGroup[]> {
        const result = await this.redisService.get(
            this.getAccountStockGroupsKey(userId),
        );
        if (!result) {
            return [];
        }

        try {
            return JSON.parse(result) as AccountStockGroup[];
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    /**
     * 그룹별 관심 종목 목록을 저장합니다.
     * @param groupName
     * @param accountStockItems
     */
    public async setAccountStocksByGroup(
        groupName: string,
        accountStockItems: AccountStockByGroup[],
    ) {
        return this.redisService.set(
            this.getAccountStocksByGroupKey(groupName),
            JSON.stringify(accountStockItems),
            {
                seconds: 3600,
            },
        );
    }

    /**
     * 그룹별 관심 종목 목록을 조회합니다.
     * @param groupName
     */
    public async getAccountStocksByGroup(
        groupName: string,
    ): Promise<AccountStockByGroup[]> {
        const result = await this.redisService.get(
            this.getAccountStocksByGroupKey(groupName),
        );
        if (!result) {
            return [];
        }

        try {
            return JSON.parse(result) as AccountStockByGroup[];
        } catch (error) {
            throw new InternalServerErrorException(error);
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
    private getAccountStocksKey(account: string) {
        return getRedisKey(KoreaInvestmentAccountKey.AccountStocks, account);
    }

    /**
     * @param userId
     * @private
     */
    private getAccountStockGroupsKey(userId: string) {
        return getRedisKey(
            KoreaInvestmentAccountKey.AccountStockGroups,
            userId,
        );
    }

    /**
     * 그룹별 관심 종목 목록의 Redis 키를 반환합니다.
     * @private
     * @param groupName
     */
    private getAccountStocksByGroupKey(groupName: string) {
        return getRedisKey(
            KoreaInvestmentAccountKey.AccountStocksByGroup,
            groupName,
        );
    }
}
