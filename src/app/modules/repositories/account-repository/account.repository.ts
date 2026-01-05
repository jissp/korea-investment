import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { getRedisKey, RedisService } from '@modules/redis';
import {
    AccountInfo,
    AccountStock,
    AccountStockByGroup,
    AccountStockGroup,
    KoreaInvestmentAccountKey,
} from './account-repository.types';

@Injectable()
export class AccountRepository {
    private readonly logger = new Logger(AccountRepository.name);

    constructor(private readonly redisService: RedisService) {}

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
     * @param accountNumber
     * @param accountStockItems
     */
    public async setAccountStocks(
        accountNumber: string,
        accountStockItems: AccountStock[],
    ) {
        return this.redisService.set(
            this.getAccountStocksKey(accountNumber),
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
     * 계좌 정보의 Redis Key를 반환합니다.
     * @param account
     * @private
     */
    private getAccountInfoKey(account: string) {
        return getRedisKey(KoreaInvestmentAccountKey.AccountInfo, account);
    }

    /**
     * 계정별 보유 종목의 Redis Key를 반환합니다.
     * @param accountNumber
     * @private
     */
    private getAccountStocksKey(accountNumber: string) {
        return getRedisKey(
            KoreaInvestmentAccountKey.AccountStocks,
            accountNumber,
        );
    }

    /**
     * 계정별 관심 종목 그룹 목록의 Redis 키를 반환합니다.
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
