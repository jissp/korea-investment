import { Stock } from './stock.entity';

export type StockDto = Omit<Stock, 'id' | 'createdAt' | 'updatedAt'>;
