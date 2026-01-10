import { TradingVolumeRank } from './trading-volume-rank.entity';

export type TradingVolumeRankDto = Omit<
    TradingVolumeRank,
    'id' | 'createdAt' | 'updatedAt'
>;
