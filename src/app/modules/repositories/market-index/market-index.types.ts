import { MarketIndex } from './market-index.entity';

export type MarketIndexDto = Omit<MarketIndex, 'id' | 'createdAt'>;
