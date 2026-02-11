import { Test, TestingModule } from '@nestjs/testing';
import { XmlParserModule, XmlParserService } from '@modules/xml-parser';

/**
 * 기본 RSS Item 타입
 */
interface RssItem {
    guid: string;
    title: string;
    link?: string;
    pubDate?: string;
}

/**
 * RSS 파싱 결과 구조
 */
interface RssFeed {
    rss: {
        channel: {
            item: RssItem | RssItem[];
        };
    };
}

describe('XmlParserService', () => {
    let service: XmlParserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [XmlParserModule],
        }).compile();

        service = module.get<XmlParserService>(XmlParserService);
    });

    function ensureArray(item: RssItem | RssItem[]): RssItem[] {
        return Array.isArray(item) ? item : [item];
    }

    describe('parse()', () => {
        it('여러개의 Item을 가진 RSS 피드를 성공적으로 파싱', () => {
            const mockXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <item>
            <guid>item1-guid</guid>
            <title>Tech News 1</title>
            <link>https://example.com/news1</link>
            <pubDate>Mon, 10 Feb 2025 10:00:00 GMT</pubDate>
        </item>
        <item>
            <guid>item2-guid</guid>
            <title>Tech News 2</title>
            <link>https://example.com/news2</link>
            <pubDate>Sun, 09 Feb 2025 15:00:00 GMT</pubDate>
        </item>
    </channel>
</rss>`;

            const result = service.parse<RssFeed>(mockXmlResponse);

            expect(result).toBeDefined();

            const { item } = result.rss.channel;
            const items = ensureArray(item);

            expect(items.length).toBe(2);
        });

        it('한개의 Item을 가진 RSS 피드를 성공적으로 파싱', () => {
            const singleItemXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <item>
            <guid>single-guid</guid>
            <title>Single News</title>
            <link>https://example.com/single</link>
        </item>
    </channel>
</rss>`;

            const result = service.parse<RssFeed>(singleItemXml);
            expect(result).toBeDefined();

            const { item } = result.rss.channel;
            const items = ensureArray(item);

            expect(items.length).toBe(1);
        });

        it('Item이 없는 빈 RSS 피드를 성공적으로 파싱', () => {
            const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
    </channel>
</rss>`;

            const result = service.parse<RssFeed>(emptyXml);
            expect(result).toBeDefined();

            const { item } = result.rss.channel;
            expect(item).toBeUndefined();
        });

        it('잘못된 XML 구조인 경우 파싱을 시도한다.', () => {
            const invalidXml = 'This is not XML at all!';

            expect(() => {
                service.parse(invalidXml);
            }).not.toThrow();
        });
    });
});
