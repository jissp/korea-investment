import { AxiosInstance } from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { XmlParserModule } from '@modules/xml-parser';
import { RssReaderProvider, RssReaderService } from '@modules/rss-reader';

const mockUrl = 'https://news.google.com/rss/search?q=tech';

/**
 * 기본 RSS Item 타입
 */
interface RssItem {
    guid: string;
    title: string;
    link?: string;
    pubDate?: string;
}

describe('RssReaderService', () => {
    let service: RssReaderService;
    let mockAxios: Partial<AxiosInstance>;
    let mockGet: jest.Mock;

    beforeEach(async () => {
        mockGet = jest.fn();
        mockAxios = {
            get: mockGet,
        };

        const module: TestingModule = await Test.createTestingModule({
            imports: [XmlParserModule],
            providers: [
                {
                    provide: RssReaderProvider.HttpClient,
                    useValue: mockAxios,
                },
                RssReaderService,
            ],
        }).compile();

        service = module.get<RssReaderService>(RssReaderService);
    });

    describe('readFeed()', () => {
        it('여러개의 Item을 가진 RSS 피드를 성공적으로 파싱', async () => {
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

            mockGet.mockResolvedValue({ data: mockXmlResponse });

            const result = await service.readFeed<RssItem>(mockUrl);

            expect(result).toHaveLength(2);
            expect(result[0].guid).toBe('item1-guid');
            expect(result[1].title).toBe('Tech News 2');
        });

        it('한개의 Item을 가진 RSS 피드를 성공적으로 파싱', async () => {
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

            mockGet.mockResolvedValue({ data: singleItemXml });

            const result = await service.readFeed<RssItem>(mockUrl);

            expect(result).toHaveLength(1);
            expect(result[0].guid).toBe('single-guid');
        });

        it('Item이 없는 빈 RSS 피드를 성공적으로 파싱', async () => {
            const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
    </channel>
</rss>`;

            mockGet.mockResolvedValue({ data: emptyXml });

            const result = await service.readFeed<RssItem>(mockUrl);

            expect(result.length).toBe(0);
        });

        it('Axios 에러가 발생하면 에러를 던진다.', async () => {
            const networkError = new Error('Network error: Connection timeout');

            mockGet.mockRejectedValue(networkError);

            await expect(service.readFeed<RssItem>(mockUrl)).rejects.toThrow(
                'Network error: Connection timeout',
            );
        });
    });
});
