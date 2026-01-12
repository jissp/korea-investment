import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStockGroupDto } from './account-stock-group.types';
import { AccountStockGroup } from './entities';

@Injectable()
export class AccountStockGroupService {
    constructor(
        @InjectRepository(AccountStockGroup)
        private readonly repository: Repository<AccountStockGroup>,
    ) {}

    /**
     * @param dto
     */
    public async upsert(dto: AccountStockGroupDto | AccountStockGroupDto[]) {
        return this.repository
            .createQueryBuilder()
            .insert()
            .into(AccountStockGroup)
            .values(dto)
            .orUpdate(['name'], ['code'])
            .updateEntity(false)
            .execute();
    }

    /**
     * 모든 관심 그룹을 조회합니다.
     */
    public async getAll() {
        return this.repository.find();
    }

    /**
     * @param code
     */
    public async findOneByCode(code: string) {
        return this.repository.findOneBy({
            code,
        });
    }

    /**
     * @param name
     */
    public async findOneByName(name: string) {
        return this.repository.findOneBy({
            name,
        });
    }

    public async truncate() {
        return this.repository.clear();
    }
}
