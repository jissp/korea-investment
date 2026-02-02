import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaInvestmentCalendar } from './korea-investment-calendar.entity';
import { KoreaInvestmentCalendarService } from './korea-investment-calendar.service';

const entities = [KoreaInvestmentCalendar];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [KoreaInvestmentCalendarService],
    exports: [
        TypeOrmModule.forFeature(entities),
        KoreaInvestmentCalendarService,
    ],
})
export class KoreaInvestmentCalendarModule {}
