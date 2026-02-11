import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RssReaderModule } from '@modules/rss-reader';
import { GoogleRssConfig, GoogleRssProvider } from './google-rss.types';
import { GoogleRssService } from './google-rss.service';

@Module({
    imports: [ConfigModule, RssReaderModule],
    providers: [
        {
            provide: GoogleRssProvider.Config,
            inject: [ConfigService],
            useFactory: (configService: ConfigService): GoogleRssConfig => {
                const config = configService.get<GoogleRssConfig>('rss.google');
                if (!config) {
                    throw new Error('Google RSS configuration is missing');
                }

                return config;
            },
        },
        GoogleRssService,
    ],
    exports: [GoogleRssService],
})
export class GoogleRssModule {}
