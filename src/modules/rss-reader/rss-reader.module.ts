import axios from 'axios';
import { Module } from '@nestjs/common';
import { XmlParserModule } from '@modules/xml-parser';
import { RssReaderProvider } from './rss-reader.types';
import { RssReaderService } from './rss-reader.service';

@Module({
    imports: [XmlParserModule],
    providers: [
        {
            provide: RssReaderProvider.HttpClient,
            useFactory: () => {
                return axios.create({
                    timeout: 10000,
                });
            },
        },
        RssReaderService,
    ],
    exports: [RssReaderService],
})
export class RssReaderModule {}
