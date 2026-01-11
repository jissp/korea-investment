import { In, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toDateYmdByDate } from '@common/utils';
import {
    DOMESTIC_INDEX_CODES,
    MarketType,
    OVERSEAS_GOVERNMENT_BOND_CODES,
    OVERSEAS_INDEX_CODES,
} from '@app/common/types';
import { MarketIndexDto } from './market-index.types';
import { MarketIndex } from './market-index.entity';

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

    /**
     * 국내 증시 - 금일 주가 정보를 조회합니다.
     */
    public async getTodayDomesticIndices() {
        try {
            const codes = DOMESTIC_INDEX_CODES.map(({ code }) => code);

            return this.marketIndexRepository.findBy({
                marketType: MarketType.Domestic,
                date: toDateYmdByDate({
                    separator: '-',
                }),
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
            date: toDateYmdByDate({
                separator: '-',
            }),
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
            date: toDateYmdByDate({
                separator: '-',
            }),
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
    public async upsert(marketIndexDto: MarketIndexDto | MarketIndexDto[]) {
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
