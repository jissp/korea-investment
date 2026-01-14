import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Theme, ThemeStock } from './entities';

@Injectable()
export class ThemeService {
    constructor(
        @InjectRepository(Theme)
        private readonly repository: Repository<Theme>,
        @InjectRepository(ThemeStock)
        private readonly themeStockRepository: Repository<ThemeStock>,
    ) {}

    /**
     * 테마 목록을 조회합니다.
     */
    public async getThemes(): Promise<Theme[]> {
        return this.repository.find();
    }

    /**
     * 특정 종목이 포함된 테마 목록을 조회합니다.
     */
    public async getThemesByStockCode(stockCode: string): Promise<Theme[]> {
        const themeAlias = Theme.name;
        const themeStockAlias = ThemeStock.name;

        return this.repository
            .createQueryBuilder(themeAlias)
            .where(
                (qb) =>
                    `code IN ${qb
                        .subQuery()
                        .select(`${themeStockAlias}.theme_code`)
                        .from(ThemeStock, themeStockAlias)
                        .where(`${themeStockAlias}.stock_code = :stockCode`, {
                            stockCode,
                        })
                        .getQuery()}`,
            )
            .orderBy('code', 'DESC')
            .getMany();
    }

    /**
     * 특정 종목이 포함된 테마 목록을 조회합니다.
     */
    public async getThemeStocksByStockCode(
        stockCode: string,
    ): Promise<ThemeStock[]> {
        return this.themeStockRepository.findBy({
            stockCode,
        });
    }

    /**
     * 테마에 속한 종목들을 조회합니다.
     */
    public async getThemeStocksByThemeCode(
        themeCode: string,
    ): Promise<ThemeStock[]> {
        return this.themeStockRepository.find({
            where: {
                themeCode,
            },
            order: {
                stockName: 'ASC',
            },
        });
    }
}
