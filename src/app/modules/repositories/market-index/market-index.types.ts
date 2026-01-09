import { MarketIndex } from '@app/modules/repositories/market-index/market-index.entity';

export type MarketIndexDto = Omit<MarketIndex, 'id' | 'createdAt'>;
