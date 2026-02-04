import axios from 'axios';
import { Module, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StockPlusConfigs } from './stock-plus.types';
import { StockPlusClient } from './stock-plus.client';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'Client',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const configs =
                    configService.get<StockPlusConfigs>('stockPlus');
                if (!configs) {
                    throw new NotFoundException('stockPlus configs not found');
                }

                return axios.create({
                    baseURL: configs.api.host,
                    timeout: 5000,
                });
            },
        },
        StockPlusClient,
    ],
    exports: [StockPlusClient],
})
export class StockPlusModule {}
