export interface NaverApiNewsParams {
    /**
     * 검색어.
     * UTF-8로 인코딩되어야 합니다.
     */
    query: string;

    /**
     * 한 번에 표시할 검색 결과 개수(기본값: 10, 최댓값: 100)
     */
    display?: number;

    /**
     * 검색 시작 위치(기본값: 1, 최댓값: 1000)
     */
    start?: number;

    /**
     * 검색 결과 정렬 방법
     * sim: 정확도순으로 내림차순 정렬(기본값)
     * date: 날짜순으로 내림차순 정렬
     */
    sort?: 'sim' | 'date';
}

export interface NaverApiNewsItem {
    /**
     * 뉴스 기사의 제목.
     * 제목에서 검색어와 일치하는 부분은 <b> 태그로 감싸져 있습니다.
     */
    title: string;

    /**
     * 뉴스 기사 원문의 URL
     */
    originallink: string;

    /**
     * 뉴스 기사의 네이버 뉴스 URL.
     * 네이버에 제공되지 않은 기사라면 기사 원문의 URL을 반환합니다.
     */
    link: string;

    /**
     * 뉴스 기사의 내용을 요약한 패시지 정보.
     * 패시지 정보에서 검색어와 일치하는 부분은 <b> 태그로 감싸져 있습니다.
     */
    description: string;

    /**
     * 뉴스 기사가 네이버에 제공된 시간.
     * 네이버에 제공되지 않은 기사라면 기사 원문이 제공된 시간을 반환합니다.
     */
    pubDate: string;
}

export interface NaverApiNewsResponse {
    /**
     * 검색 결과를 생성한 시간
     */
    lastBuildDate: string;

    /**
     * 총 검색 결과 개수
     */
    total: number;

    /**
     * 검색 시작 위치
     */
    start: number;

    /**
     * 한 번에 표시할 검색 결과 개수
     */
    display: number;

    /**
     * 개별 검색 결과.
     * JSON 형식의 결괏값에서는 items 속성의 JSON 배열로 개별 검색 결과를 반환합니다.
     */
    items: NaverApiNewsItem[];
}
