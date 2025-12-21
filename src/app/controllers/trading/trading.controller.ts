import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('v1/trading')
export class TradingController {
    constructor() {}

    @ApiOperation({
        summary: 'Trading operations',
        description: 'API endpoints for trading operations',
    })
    @Get('accounts')
    public getTradingAccount() {

    }
}
