import { ApiProperty } from '@nestjs/swagger';
import { Nullable } from '@common/types';
import { KoreaInvestmentHoliday } from '@app/modules/repositories/korea-investment-holiday';

export class GetMarketHolidayResponse {
    @ApiProperty({
        type: KoreaInvestmentHoliday,
        nullable: true,
    })
    data: Nullable<KoreaInvestmentHoliday>;
}
