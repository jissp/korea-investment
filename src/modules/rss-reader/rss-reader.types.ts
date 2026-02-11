export enum RssReaderProvider {
    HttpClient = 'HttpClient',
}

export interface RssChannel<T> {
    item: T | T[];
}

export interface RssFeed<T> {
    rss?: {
        channel?: RssChannel<T>;
    };
}
