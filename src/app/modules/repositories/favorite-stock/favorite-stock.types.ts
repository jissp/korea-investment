import { FavoriteStock } from './favorite-stock.entity';

export enum FavoriteType {
    Manual = 'Manual',
    Possess = 'Possess',
    StockGroup = 'StockGroup',
}

export type FavoriteStockDto = Omit<FavoriteStock, 'id' | 'createdAt'>;
