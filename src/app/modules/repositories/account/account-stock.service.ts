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
     * 모든 보유 종목을 조회합니다.
     */
    public async getAllAccountStocks() {
        return this.accountStockRepository.find();
    }

    /**
     * 특정 종목의 보유 수량을 조회합니다.
     */
    public async getAccountStock(stockCode: string) {
        return this.accountStockRepository.findOneBy({
            stockCode,
        });
    }

    /**
     * 계좌의 자산 정보를 업데이트합니다.
     */
    public async upsert(accountStockDto: AccountStockDto | AccountStockDto[]) {
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
                ['type', 'stock_code'],
            )
            .updateEntity(false)
            .execute();
    }
}
