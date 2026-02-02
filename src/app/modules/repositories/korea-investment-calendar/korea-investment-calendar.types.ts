import { KoreaInvestmentCalendar } from './korea-investment-calendar.entity';

export type KoreaInvestmentCalendarDto = Omit<
    KoreaInvestmentCalendar,
    'id' | 'createdAt' | 'updatedAt'
>;
