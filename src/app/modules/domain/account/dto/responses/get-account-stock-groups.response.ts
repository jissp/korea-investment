import { ApiProperty } from '@nestjs/swagger';
import { AccountStockGroup } from '@app/modules/repositories/account-stock-group';

export class GetAccountStockGroupsResponse {
    @ApiProperty({
        type: AccountStockGroup,
        isArray: true,
    })
    data: AccountStockGroup[];
}
