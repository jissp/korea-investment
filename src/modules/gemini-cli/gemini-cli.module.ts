import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeminiCliOptions, GeminiCliProvider } from './gemini-cli.types';
import { GeminiCliProcessManagerService } from './gemini-cli-process-manager.service';
import { GeminiCliService } from './gemini-cli.service';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: GeminiCliProvider.GeminiCliConfig,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return configService.get<GeminiCliOptions>('gemini');
            },
        },
        GeminiCliProcessManagerService,
        GeminiCliService,
    ],
    exports: [GeminiCliService],
})
export class GeminiCliModule {}
