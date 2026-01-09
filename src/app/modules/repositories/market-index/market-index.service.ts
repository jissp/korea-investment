import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MarketIndex } from '@app/modules/repositories/market-index/market-index.entity';
import { MarketIndexDto } from '@app/modules/repositories/market-index/market-index.types';
import { MarketType } from '@app/common/types';
import { toDateYmdByDate } from '@common/utils';
import {
    DOMESTIC_INDEX_CODES,
    OVERSEAS_GOVERNMENT_BOND_CODES,
    OVERSEAS_INDEX_CODES,
} from '@app/modules/crawlers/korea-investment-index-crawler/korea-investment-index-crawler.types';

@Injectable()
export class MarketIndexService {
    private readonly logger = new Logger(MarketIndexService.name);

    constructor(
        @InjectRepository(MarketIndex)
        private readonly marketIndexRepository: Repository<MarketIndex>,
    ) {}

    /**
     * 기업의 주가 정보가 존재하는지 확인합니다.
     * @param date
     * @param code
     */
    public async exists(date: string, code: string) {
        return this.marketIndexRepository.existsBy({
            date,
            code,
        });
    }

    // /**
    //  * 마켓의 주가 정보를 조회합니다.
    //  * @param query
    //  */
    // public async findBy(query: FindOptionsWhere<MarketIndex>) {
    //     return this.marketIndexRepository.findBy(query);
    // }

    /**
     * 국내 증시 - 금일 주가 정보를 조회합니다.
     */
    public async getTodayDomesticIndices() {
        try {
            const codes = DOMESTIC_INDEX_CODES.map(({ code }) => code);

            return this.marketIndexRepository.findBy({
                marketType: MarketType.Domestic,
                date: toDateYmdByDate(),
                code: In(codes),
            });
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 해외 증시 - 금일 주가 정보를 조회합니다.
     */
    public async getTodayOverseasIndices() {
        const codes = OVERSEAS_INDEX_CODES.map(({ code }) => code);

        return this.marketIndexRepository.findBy({
            marketType: MarketType.Overseas,
            date: toDateYmdByDate(),
            code: In(codes),
        });
    }

    /**
     * 해외 채권 - 금일 주가 정보를 조회합니다.
     */
    public async getTodayGovernmentBonds() {
        const codes = OVERSEAS_GOVERNMENT_BOND_CODES.map(({ code }) => code);

        return this.marketIndexRepository.findBy({
            marketType: MarketType.Overseas,
            date: toDateYmdByDate(),
            code: In(codes),
        });
    }

    /**
     * 기업의 주가 정보를 조회합니다.
     * @param date
     * @param code
     */
    public async findOne({ date, code }: { date: string; code: string }) {
        return this.marketIndexRepository.findOneBy({
            date,
            code,
        });
    }

    /**
     * 기업의 주가 정보를 업데이트합니다.
     * @param marketIndexDto
     */
    public async upsert(marketIndexDto: MarketIndexDto) {
        return this.marketIndexRepository
            .createQueryBuilder()
            .insert()
            .into(MarketIndex)
            .values(marketIndexDto)
            .orUpdate(
                ['value', 'change_value', 'change_value_rate'],
                ['code', 'date'],
            )
            .updateEntity(false)
            .execute();
    }
}
