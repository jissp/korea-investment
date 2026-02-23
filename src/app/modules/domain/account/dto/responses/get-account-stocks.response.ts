import { ApiProperty } from '@nestjs/swagger';
import { AccountStockGroupStock } from '@app/modules/repositories/account-stock-group';

export class GetAccountStocksResponse {
    @ApiProperty({
        type: AccountStockGroupStock,
        isArray: true,
    })
    data: AccountStockGroupStock[];
}
