import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, AccountStock } from './entities';
import { AccountService } from './account.service';
import { AccountStockService } from './account-stock.service';

const entities = [Account, AccountStock];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [AccountService, AccountStockService],
    exports: [
        TypeOrmModule.forFeature(entities),
        AccountService,
        AccountStockService,
    ],
})
export class AccountModule {}
