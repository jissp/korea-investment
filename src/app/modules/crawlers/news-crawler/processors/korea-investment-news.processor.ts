import * as _ from 'lodash';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { OnQueueProcessor } from '@modules/queue';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import { FavoriteStockService } from '@app/modules/repositories/favorite-stock';
import { NewsService } from '@app/modules/repositories/news';
import { KoreaInvestmentNewsTransformer } from '../transformers/korea-investment-news.transformer';
import { NewsCrawlerQueueType } from '../news-crawler.types';
import {
    KoreaInvestmentNewsItem,
    RequestDomesticNewsTitleResponse,
} from '../news-crawler.interface';

const categoryMap: Record<
    string,
    { name: string; categories: Record<string, string> }
> = {
    F: {
        name: '거래소',
        categories: {
            '01': '수시공시',
            '02': '공정공시',
            '03': '시장조치',
            '05': '정기공시',
            '08': '지분공시',
            A1: '시장조치안내',
            A4: '투자유의사항',
        },
    },
    G: {
        name: '코스닥',
        categories: {
            '01': '수시공시',
            '02': '공정공시',
            '03': '시장조치',
            '05': '정기공시',
            '08': '지분공시',
            A1: '시장조치안내',
            A4: '투자유의사항',
        },
    },
    N: {
        name: '코넥스',
        categories: {
            '01': '수시공시',
            '02': '공정공시',
            '05': '정기공시',
            '08': '지분공시',
        },
    },
    H: { name: 'K-OTC', categories: { '0': '종합' } },
    '6': {
        name: '연합뉴스',
        categories: { '02': '경제', '03': '증권/금융', '04': '산업' },
    },
    '2': {
        name: '한경',
        categories: { '01': '증권', '04': '경제', '03': '부동산' },
    },
    A: {
        name: '매경',
        categories: {
            '01': '경제',
            '02': '금융',
            '03': '산업/기업',
            '05': '증권',
        },
    },
    '4': {
        name: '이데일리',
        categories: {
            S1: '주식시황',
            S2: '거래소',
            S3: '코스닥&장외',
            I1: 'IPO뉴스',
            B1: '채권시황',
        },
    },
    '5': {
        name: '머니투데이',
        categories: {
            A01: '주식',
            A02: '선물옵션',
            A05: '해외증시',
            B01: '경제',
        },
    },
    '9': {
        name: '뉴스핌',
        categories: { '01': '주식', '02': '채권', '03': '외환', '07': '경제' },
    },
    '8': {
        name: '아시아경제',
        categories: { A0: '증권', B0: '금융', E0: '경제', I0: '루머&팩트' },
    },
    // B: {
    //     name: '헤럴드경제',
    //     categories: { '01': '뉴스', '02': '기업', '03': '재테크' },
    // },
    C: {
        name: '파이낸셜',
        categories: { '01': '증권', '02': '금융', '04': '산업', '05': '경제' },
    },
    D: {
        name: '이투데이',
        categories: { '21': '증권', '51': '금융', '23': '산업' },
    },
    U: {
        name: '서울경제',
        categories: { '31': '증권', '33': '경제/금융', '34': '산업/기업' },
    },
    V: { name: '조선경제i', categories: { '1': '뉴스', '2': 'Market' } },
    '7': {
        name: '인포스탁',
        categories: {
            '01': '거래소종목',
            '02': '코스닥종목',
            '03': '해외증시',
            '04': '선물동향',
        },
    },
    X: {
        name: 'CEO스코어',
        categories: { '01': '경제', '02': '산업', '03': '금융' },
    },
    S: { name: '컨슈머타임스', categories: { '02': '파이낸셜컨뮤머' } },
    Z: { name: '인베스트조선', categories: { '01': '증권/금융' } },
    d: { name: 'NSP통신', categories: { '12': '금융/증권', '20': '기업' } },
    a: {
        name: 'IRGO',
        categories: { '10': 'IR정보', '20': 'IR일정', '50': 'IR FOCUS' },
    },
    Y: { name: 'eFriend Air', categories: { '01': '종목상담' } },
    J: { name: '동향', categories: { '0': '종합' } },
    L: { name: '한투리서치', categories: { '0': '종합' } },
};

@Injectable()
export class KoreaInvestmentNewsProcessor {
    private transformer = new KoreaInvestmentNewsTransformer();

    constructor(
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
        private readonly newsService: NewsService,
        private readonly favoriteStockService: FavoriteStockService,
    ) {}

    @OnQueueProcessor(NewsCrawlerQueueType.RequestDomesticNewsTitle)
    async processRequestDomesticNewsTitle(job: Job) {
        const childrenResponse =
            await this.koreaInvestmentRequestApiHelper.getChildResponses<
                any,
                RequestDomesticNewsTitleResponse
            >(job);
        const childrenResults = childrenResponse.flatMap(
            ({ response }) => response.output,
        );

        const filteredOutputs = childrenResults.filter((output) =>
            this.isCrawling(output),
        );

        const transformedNewsItems = filteredOutputs.map((newsItem) =>
            this.transformer.transform(newsItem),
        );
        const chunks = _.chunk(transformedNewsItems, 10);
        for (const chunk of chunks) {
            await Promise.allSettled([
                this.newsService.upsert(chunk.map(({ news }) => news)),
                this.newsService.upsertStockNews(
                    chunk.flatMap((newsItem) => {
                        return newsItem.stockCodes.map((stockCode) => ({
                            ...newsItem.news,
                            stockCode,
                        }));
                    }),
                ),
            ]);
        }
    }

    /**
     * 수집 대상인지 확인합니다.
     * @param news
     * @private
     */
    private isCrawling(news: KoreaInvestmentNewsItem) {
        const map = categoryMap[news.news_ofer_entp_code];
        if (!map) {
            return false;
        }

        return (
            map.categories[news.news_lrdv_code] !== undefined ||
            this.transformer.extractStockCodes(news).length > 0
        );
    }
}
