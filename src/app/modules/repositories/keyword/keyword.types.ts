import { Keyword, KeywordGroup } from './entities';

export enum KeywordType {
    Manual = 'Manual',
    Possess = 'Possess',
    StockGroup = 'StockGroup',
}

export type KeywordDto = Omit<Keyword, 'id' | 'createdAt' | 'updatedAt'>;
export type KeywordGroupDto = Omit<
    KeywordGroup,
    'id' | 'createdAt' | 'updatedAt'
>;
