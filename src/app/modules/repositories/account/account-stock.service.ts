import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStockDto } from './account.types';
import { AccountStock } from './entities/account-stock.entity';

@Injectable()
export class AccountStockService {
    constructor(
        @InjectRepository(AccountStock)
        private readonly accountStockRepository: Repository<AccountStock>,
    ) {}

    /**
     * 계좌의 보유 종목을 조회합니다.
     * @param accountId
     */
    public async getAccountStocks(accountId: string) {
        return this.accountStockRepository.find({
            where: {
                accountId,
            },
        });
    }

    /**
     * 계좌의 자산 정보를 업데이트합니다.
     */
    public async upsertAccountStock(accountStockDto: AccountStockDto) {
        return this.accountStockRepository
            .createQueryBuilder()
            .insert()
            .into(AccountStock)
            .values(accountStockDto)
            .orUpdate(
                [
                    'stock_name',
                    'price',
                    'quantity',
                    'pchs_amt',
                    'pchs_avg_pric',
                    'evlu_amt',
                ],
                ['accountId', 'stock_code'],
            )
            .updateEntity(false)
            .execute();
    }
}
