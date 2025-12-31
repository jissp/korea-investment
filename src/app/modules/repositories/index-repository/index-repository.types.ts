export enum IndexRepositoryRedisKey {
    DomesticIndex = 'index:domestic',
    DomesticDailyIndex = 'index:domestic:daily',
    DomesticDailyIndexScore = 'index:domestic:daily:score',
    OverseasIndex = 'index:overseas',
    OverseasDailyIndex = 'index:overseas:daily',
    OverseasDailyIndexScore = 'index:overseas:daily:score',
    OverseasGovernmentBond = 'index:overseas:government-bond',
    OverseasDailyGovernmentBond = 'index:overseas:government-bond:daily',
    OverseasDailyGovernmentBondScore = 'index:overseas:government-bond:daily:score',
}

export interface DomesticIndexItem {
    code: string;
    name: string;
    price: number;
    change: number;
    changeRate: number;
}

export interface DomesticDailyIndexItem extends DomesticIndexItem {
    date: string;
}

export interface OverseasIndexItem {
    code: string;
    name: string;
    price: number;
    change: number;
    changeRate: number;
}

export interface OverseasDailyIndexItem extends OverseasIndexItem {
    date: string;
}

export interface OverseasGovernmentBondItem {
    code: string;
    name: string;
    price: number;
    change: number;
    changeRate: number;
}

export interface OverseasDailyGovernmentBondItem extends OverseasGovernmentBondItem {
    date: string;
}
