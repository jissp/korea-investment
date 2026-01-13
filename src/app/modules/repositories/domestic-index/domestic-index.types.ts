import { DomesticIndex } from './domestic-index.entity';

export type DomesticIndexDto = Omit<
    DomesticIndex,
    'id' | 'createdAt' | 'updatedAt'
>;
