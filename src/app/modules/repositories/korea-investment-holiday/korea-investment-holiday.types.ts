import { KoreaInvestmentHoliday } from './korea-investment-holiday.entity';

export type KoreaInvestmentHolidayDto = Omit<
    KoreaInvestmentHoliday,
    'id' | 'createdAt' | 'updatedAt'
>;
