import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaInvestmentHoliday } from './korea-investment-holiday.entity';
import { KoreaInvestmentHolidayService } from './korea-investment-holiday.service';

const entities = [KoreaInvestmentHoliday];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [KoreaInvestmentHolidayService],
    exports: [
        TypeOrmModule.forFeature(entities),
        KoreaInvestmentHolidayService,
    ],
})
export class KoreaInvestmentHolidayModule {}
