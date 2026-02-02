import { LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { YN } from '@app/common/types';
import { KoreaInvestmentCalendar } from './korea-investment-calendar.entity';
import { KoreaInvestmentCalendarDto } from './korea-investment-calendar.types';

@Injectable()
export class KoreaInvestmentCalendarService {
    constructor(
        @InjectRepository(KoreaInvestmentCalendar)
        private readonly repository: Repository<KoreaInvestmentCalendar>,
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
    public async insert(dto: KoreaInvestmentCalendarDto) {
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
