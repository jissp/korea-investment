import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AccountStockGroupService } from '@app/modules/repositories/account-stock-group';
import { GetAccountStockGroupsResponse } from '../dto';

@Injectable()
export class GetAccountStockGroupsUseCase implements BaseUseCase<
    void,
    GetAccountStockGroupsResponse
> {
    constructor(
        private readonly accountStockGroupService: AccountStockGroupService,
    ) {}

    async execute(): Promise<GetAccountStockGroupsResponse> {
        const accountGroups = await this.accountStockGroupService.getAll();

        return {
            data: accountGroups,
        };
    }
}
