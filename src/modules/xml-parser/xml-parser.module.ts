import { XMLParser } from 'fast-xml-parser';
import { Module } from '@nestjs/common';
import { XmlParserProvider } from './xml-parser.types';
import { XmlParserService } from './xml-parser.service';

@Module({
    providers: [
        {
            provide: XmlParserProvider.Parser,
            useValue: new XMLParser({
                ignoreAttributes: false,
                parseTagValue: true,
            }),
        },
        XmlParserService,
    ],
    exports: [XmlParserService],
})
export class XmlParserModule {}
