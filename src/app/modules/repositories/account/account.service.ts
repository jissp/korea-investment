import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountInfoDto } from './account.types';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
    ) {}

    /**
     * 특정 계좌 정보를 조회합니다.
     */
    public async getAccount(accountId: string) {
        return this.accountRepository.findOneBy({
            accountId,
        });
    }

    /**
     * 모든 계좌 정보를 조회합니다.
     */
    public async getAccounts() {
        return this.accountRepository.find();
    }

    /**
     * 계좌의 자산 정보를 업데이트합니다.
     */
    public async updateAccount(
        accountId: string,
        accountInfoDto: AccountInfoDto,
    ) {
        const result = await this.accountRepository.update(
            {
                accountId,
            },
            accountInfoDto,
        );

        return result.affected! > 0;
    }
}
