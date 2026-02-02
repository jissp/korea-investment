import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { toDateYmdByDate } from '@common/utils';
import { KoreaInvestmentCalendarService } from '@app/modules/repositories/korea-investment-calendar';
import { GetMarketCalendarResponse } from './dto';

@Controller('v1/markets')
export class MarketController {
    private readonly logger = new Logger(MarketController.name);

    constructor(
        private readonly holidayService: KoreaInvestmentCalendarService,
    ) {}

    @ApiOperation({
        summary: '오늘 마켓 시장 정보 조회',
    })
    @ApiOkResponse({
        type: GetMarketCalendarResponse,
    })
    @Get()
    public async getTodayHoliday(): Promise<GetMarketCalendarResponse> {
        const holiday = await this.holidayService.getByDate(
            toDateYmdByDate({
                separator: '-',
            }),
        );

        return {
            data: holiday,
        };
    }
}
