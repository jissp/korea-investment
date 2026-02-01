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
     * 특정 요일의 국내휴장일을 조회합니다.
     * @param date
     */
    public async getByDate(date: string) {
        return this.repository.findOneBy({ date });
    }

    /**
     * 국내휴장일 데이터를 추가합니다.
     * @param dto
     */
    public async insert(dto: KoreaInvestmentHolidayDto) {
        return this.repository.insert(dto);
    }

    /**
     * 최근 영업일을 조회합니다.
     * @param date
     * @param isImportToday
     */
    public async getLatestBusinessDayByDate({
        date,
        isImportToday = true,
    }: {
        date: string;
        isImportToday?: boolean;
    }) {
        return this.repository.findOne({
            where: {
                date: isImportToday ? LessThanOrEqual(date) : LessThan(date),
                isOpen: YN.Y,
            },
            order: {
                date: 'DESC',
            },
        });
    }
}
