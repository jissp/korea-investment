import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteStockDto, FavoriteType } from './favorite-stock.types';
import { FavoriteStock } from './favorite-stock.entity';

@Injectable()
export class FavoriteStockService {
    constructor(
        @InjectRepository(FavoriteStock)
        private readonly favoriteStockRepository: Repository<FavoriteStock>,
    ) {}

    /**
     * 즐겨찾기에 추가된 모든 종목들을 조회합니다.
     */
    public async findAll() {
        return this.favoriteStockRepository.find();
    }

    /**
     * 즐겨찾기 유형에 맞는 종목들을 조회합니다.
     * @param type
     */
    public async findByType(type: FavoriteType) {
        return this.favoriteStockRepository.findBy({
            type,
        });
    }

    /**
     * 종목 코드를 조회합니다.
     * @param stockCode
     * @param type
     */
    public async findOneByCode({
        type,
        stockCode,
    }: {
        type: FavoriteType;
        stockCode: string;
    }) {
        return this.favoriteStockRepository.findOneBy({
            stockCode,
            type,
        });
    }

    /**
     * 종목 코드가 이미 존재하는지 확인합니다.
     * @param id
     */
    public async exists(id: number) {
        return this.favoriteStockRepository.existsBy({
            id,
        });
    }

    /**
     * 종목 코드가 이미 존재하는지 확인합니다.
     * @param stockCode
     * @param type
     */
    public async existsByCode({
        type,
        stockCode,
    }: {
        type: FavoriteType;
        stockCode: string;
    }) {
        return this.favoriteStockRepository.existsBy({
            stockCode,
            type,
        });
    }

    /**
     * 즐겨찾기에 종목을 추가합니다.
     * @param favoriteStock
     */
    public async upsert(favoriteStock: FavoriteStockDto) {
        return this.favoriteStockRepository
            .createQueryBuilder()
            .insert()
            .into(FavoriteStock)
            .values(favoriteStock)
            .orUpdate(['stock_code'], ['type', 'stock_code'])
            .updateEntity(false)
            .execute();
    }

    /**
     * 즐겨찾기에 추가된 종목을 수정합니다.
     * @param favoriteStock
     */
    public async update(favoriteStock: FavoriteStock) {
        return this.favoriteStockRepository.update(
            {
                id: favoriteStock.id,
            },
            favoriteStock,
        );
    }

    /**
     * 즐겨찾기에 등록된 종목을 삭제합니다.
     * @param id
     */
    public async delete(id: number) {
        const exists = await this.exists(id);
        if (!exists) {
            throw new Error('존재하지 않는 즐겨찾기 종목입니다.');
        }

        return this.favoriteStockRepository.delete(id);
    }

    /**
     * 즐겨찾기에 등록된 종목을 삭제합니다.
     * @param type
     * @param stockCode
     */
    public async deleteByStockCode({
        type,
        stockCode,
    }: {
        type: FavoriteType;
        stockCode: string;
    }) {
        const exists = await this.existsByCode({ type, stockCode });
        if (!exists) {
            throw new Error('존재하지 않는 즐겨찾기 종목입니다.');
        }

        return this.favoriteStockRepository.delete(stockCode);
    }
}
