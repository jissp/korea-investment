import axios from 'axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfiguration } from '@app/configuration';
import { StockPlusClient } from './stock-plus.client';

type StockPlusConfigs = IConfiguration['stockPlus'];

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
                    throw new Error('stockPlus configs not found');
                }

                return axios.create({
                    baseURL: configs.api.host as string,
                });
            },
        },
        StockPlusClient,
    ],
    exports: [StockPlusClient],
})
export class StockPlusModule {}
