import { IConfiguration } from '@app/configuration';

export enum GoogleRssProvider {
    Config = 'Config',
}

export type GoogleRssConfig = IConfiguration['rss']['google'];

export interface GoogleRssItem {
    guid: string;
    title: string;
    description?: string;
    link: string;
    pubDate: string;
}
