import { ApiProperty } from '@nestjs/swagger';
import { Nullable } from '@common/types';
import { KoreaInvestmentCalendar } from '@app/modules/repositories/korea-investment-calendar';

export class GetMarketCalendarResponse {
    @ApiProperty({
        type: KoreaInvestmentCalendar,
        nullable: true,
    })
    data: Nullable<KoreaInvestmentCalendar>;
}
