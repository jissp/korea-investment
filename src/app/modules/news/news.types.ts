export enum NewsRedisKey {
    News = 'News:Articles',
    NewsByKeyword = 'News:Score:Keyword',
    NewsByStockCode = 'News:Score:StockCode',
}

export enum NewsCategory {
    KoreaInvestment = 'KoreaInvestment',
    StockPlus = 'StockPlus',
    Naver = 'Naver',
}

export interface NewsItem {
    /**
     * 뉴스 ID
     */
    articleId: string;

    /**
     * 뉴스 출처
     */
    category: NewsCategory;

    /**
     * 뉴스 제목
     */
    title: string;

    /**
     * 뉴스 내용
     */
    description?: string;

    /**
     * 뉴스 링크
     */
    link?: string;

    /**
     * 뉴스 종목 코드 목록
     */
    stockCodes: string[];

    /**
     * 뉴스 생성 일시
     */
    createdAt: string;
}
