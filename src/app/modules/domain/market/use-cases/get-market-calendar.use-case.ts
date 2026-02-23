import { Injectable } from '@nestjs/common';
import { toDateYmdByDate } from '@common/utils';
import { BaseUseCase } from '@app/common/types';
import { KoreaInvestmentCalendarService } from '@app/modules/repositories/korea-investment-calendar';
import { GetMarketCalendarResponse } from '../dto';

@Injectable()
export class GetMarketCalendarUseCase implements BaseUseCase<
    void,
    GetMarketCalendarResponse
> {
    constructor(
        private readonly calendarService: KoreaInvestmentCalendarService,
    ) {}

    async execute(): Promise<GetMarketCalendarResponse> {
        const businessDay = await this.calendarService.getByDate(
            toDateYmdByDate({
                separator: '-',
            }),
        );

        return {
            data: businessDay,
        };
    }
}
