import { LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { YN } from '@app/common';
import { KoreaInvestmentHoliday } from './korea-investment-holiday.entity';
import { KoreaInvestmentHolidayDto } from './korea-investment-holiday.types';

@Injectable()
export class KoreaInvestmentHolidayService {
    constructor(
        @InjectRepository(KoreaInvestmentHoliday)
        private readonly repository: Repository<KoreaInvestmentHoliday>,
    ) {}

    /**
     * 국내휴장일 데이터가 존재하는지 확인합니다.
     * @param date
     */
    public async exists(date: string) {
        return this.repository.existsBy({ date });
    }

    /**
     * 국내휴장일 데이터를 추가합니다.
     * @param dto
     */
    public async insert(dto: KoreaInvestmentHolidayDto) {
        return this.repository.insert(dto);
    }

    /**
     * 국내휴장일 데이터가 존재하는지 확인합니다.
     * @param date
     */
    public async getByDate(date: string) {
        return this.repository.findOneBy({ date });
    }

    /**
     * 최근 영업일을 조회합니다. (오늘 포함)
     * @param date
     */
    public async getLatestBusinessDayByDate(date: string) {
        return this.repository.findBy({
            date: LessThanOrEqual(date),
            isOpen: YN.Y,
        });
    }

    /**
     * 최근 영업일을 조회합니다. (오늘 미포함)
     * @param date
     */
    public async getLatestBusinessDayWithoutTodayByDate(date: string) {
        return this.repository.findBy({
            date: LessThan(date),
            isOpen: YN.Y,
        });
    }
}
