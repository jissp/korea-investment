import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AccountStockGroupStockDto,
    DeleteAccountStockGroupStockDto,
    UpdateAccountStockGroupStockDto,
} from './account-stock-group.types';
import { AccountStockGroup, AccountStockGroupStock } from './entities';

@Injectable()
export class AccountStockGroupStockService {
    constructor(
        @InjectRepository(AccountStockGroup)
        private readonly stockGroupRepository: Repository<AccountStockGroup>,
        @InjectRepository(AccountStockGroupStock)
        private readonly repository: Repository<AccountStockGroupStock>,
    ) {}

    /**
     * @param groupCode
     * @param stockCode
     */
    public async exists(groupCode: string, stockCode: string) {
        return this.repository.existsBy({ groupCode, stockCode });
    }

    /**
     * 모든 종목 정보를 조회합니다.
     */
    public async getAll() {
        //
        const raws = await this.repository
            .createQueryBuilder()
            .select('MIN(id) as id, stock_code')
            .groupBy('stock_code')
            .getRawMany<{
                id: number;
                stock_code: string;
            }>();

        return this.repository.findBy({
            id: In(raws.map((raw) => raw.id)),
        });
    }

    /**
     * 해당 그룹에 속한 모든 종목 정보를 조회합니다.
     * @param groupCode
     */
    public async getAllByGroupCode(groupCode: string) {
        return this.repository.findBy({
            groupCode,
        });
    }

    /**
     * @param dto
     */
    public async create(
        dto: AccountStockGroupStockDto | AccountStockGroupStockDto[],
    ) {
        const dtoList = Array.isArray(dto) ? dto : [dto];

        for (const dto of dtoList) {
            const isExists = await this.exists(dto.groupCode, dto.stockCode);
            if (isExists) {
                continue;
            }

            await this.repository.insert(dto);
        }
    }

    /**
     * @param dto
     */
    public async update(
        dto:
            | UpdateAccountStockGroupStockDto
            | UpdateAccountStockGroupStockDto[],
    ) {
        const dtoList = Array.isArray(dto) ? dto : [dto];

        return this.repository.manager.transaction(async (entityManager) => {
            for (const {
                stockCode,
                price,
                changePrice,
                changePriceRate,
                lowPrice,
                highPrice,
                tradingVolume,
            } of dtoList) {
                await entityManager.update(
                    AccountStockGroupStock,
                    {
                        stockCode,
                    },
                    {
                        price,
                        changePrice,
                        changePriceRate,
                        lowPrice,
                        highPrice,
                        tradingVolume,
                    },
                );
            }
        });
    }

    /**
     * @param dto
     */
    public async deleteByDto(
        dto:
            | DeleteAccountStockGroupStockDto
            | DeleteAccountStockGroupStockDto[],
    ) {
        const dtoList = Array.isArray(dto) ? dto : [dto];

        return this.repository.manager.transaction(async (entityManager) => {
            for (const { groupCode, stockCode } of dtoList) {
                await entityManager.delete(AccountStockGroupStock, {
                    groupCode,
                    stockCode,
                });
            }
        });
    }

    /**
     * @param groupCode
     */
    public async deleteByGroupCode(groupCode: string) {
        return this.repository.delete({
            groupCode,
        });
    }
}
