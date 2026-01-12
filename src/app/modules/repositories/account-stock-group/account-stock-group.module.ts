import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountStockGroup, AccountStockGroupStock } from './entities';
import { AccountStockGroupService } from './account-stock-group.service';
import { AccountStockGroupStockService } from './account-stock-group-stock.service';

const entities = [AccountStockGroup, AccountStockGroupStock];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [AccountStockGroupService, AccountStockGroupStockService],
    exports: [
        TypeOrmModule.forFeature(entities),
        AccountStockGroupService,
        AccountStockGroupStockService,
    ],
})
export class AccountStockGroupModule {}
