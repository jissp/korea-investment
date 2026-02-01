import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { toDateYmdByDate } from '@common/utils';
import { KoreaInvestmentHolidayService } from '@app/modules/repositories/korea-investment-holiday';
import { GetMarketHolidayResponse } from './dto';

@Controller('v1/markets')
export class MarketController {
    private readonly logger = new Logger(MarketController.name);

    constructor(
        private readonly holidayService: KoreaInvestmentHolidayService,
    ) {}

    @ApiOperation({
        summary: '오늘 마켓 시장 정보 조회',
    })
    @ApiOkResponse({
        type: GetMarketHolidayResponse,
    })
    @Get()
    public async getTodayHoliday(): Promise<GetMarketHolidayResponse> {
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
