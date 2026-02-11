import { XMLParser } from 'fast-xml-parser';
import { Inject, Injectable } from '@nestjs/common';
import { XmlParserProvider } from './xml-parser.types';

@Injectable()
export class XmlParserService {
    constructor(
        @Inject(XmlParserProvider.Parser)
        private readonly parser: XMLParser,
    ) {}

    /**
     * XML 문자열을 객체로 변환합니다.
     * @param xml XML 문자열
     * @returns 파싱된 객체
     */
    public parse<T = unknown>(xml: string): T {
        return this.parser.parse(xml) as T;
    }
}
