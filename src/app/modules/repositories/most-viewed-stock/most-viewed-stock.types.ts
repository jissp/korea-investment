import { MostViewedStock } from './most-viewed-stock.entity';

export type MostViewedStockDto = Omit<
    MostViewedStock,
    'id' | 'createdAt' | 'updatedAt'
>;
