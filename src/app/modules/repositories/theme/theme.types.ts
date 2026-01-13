import { Theme, ThemeStock } from './entities';

export type ThemeDto = Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>;
export type ThemeStockDto = Omit<ThemeStock, 'id' | 'createdAt' | 'updatedAt'>;
