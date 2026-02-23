import { Module } from '@nestjs/common';
import { RepositoryModule } from '@app/modules/repositories';
import { AuthModule } from '@app/modules/auth';
import {
    GetAccountStockGroupsUseCase,
    GetAccountStocksByGroupUseCase,
    GetAccountStocksUseCase,
    GetAccountUseCase,
} from './use-cases';
import { AccountController } from './account.controller';
import { AccountStockController } from './account-stock.controller';

@Module({
    imports: [RepositoryModule, AuthModule],
    providers: [
        GetAccountUseCase,
        GetAccountStocksUseCase,
        GetAccountStockGroupsUseCase,
        GetAccountStocksByGroupUseCase,
    ],
    controllers: [AccountController, AccountStockController],
    exports: [
        GetAccountUseCase,
        GetAccountStocksUseCase,
        GetAccountStockGroupsUseCase,
        GetAccountStocksByGroupUseCase,
    ],
})
export class AccountModule {}
