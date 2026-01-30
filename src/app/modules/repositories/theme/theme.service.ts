import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { YN } from '@app/common/types/market.types';
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
     * 테마 코드로 테마를 조회합니다.
     * @param code
     * @private
     */
    private async getThemeByCode(code: string) {
        return this.repository.findOneBy({ code });
    }

    /**
     * 테마 목록을 조회합니다.
     */
    public async getThemes(): Promise<Theme[]> {
        return this.repository.find({
            order: {
                code: 'DESC',
            },
        });
    }

    /**
     * 즐겨찾기한 테마 목록을 조회합니다.
     */
    public async getFavoriteThemes(): Promise<Theme[]> {
        return this.repository.find({
            where: {
                isFavorite: YN.Y,
            },
            order: {
                code: 'DESC',
            },
        });
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
     * 테마가 존재하는지 확인합니다.
     */
    public async existsThemeByCode(code: string): Promise<boolean> {
        return this.repository.existsBy({
            code,
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

    /**
     * 테마의 즐겨찾기 여부를 수정합니다.
     * @throws NotFoundException
     * @param code
     * @param isFavorite
     */
    public async updateThemeFavorite(
        code: string,
        isFavorite: boolean,
    ): Promise<void> {
        const theme = await this.getThemeByCode(code);
        if (!theme) {
            throw new NotFoundException('존재하지 않는 테마입니다.');
        }

        await this.repository.update(
            { code },
            { isFavorite: isFavorite ? YN.Y : YN.N },
        );
    }
}
