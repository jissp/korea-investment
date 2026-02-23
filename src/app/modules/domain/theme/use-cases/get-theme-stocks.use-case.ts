import { Injectable } from '@nestjs/common';
import { ThemeService, ThemeStock } from '@app/modules/repositories/theme';

export interface GetThemeStocksParams {
    themeCode: string;
}

@Injectable()
export class GetThemeStocksUseCase {
    constructor(private readonly themeService: ThemeService) {}

    async execute(params: GetThemeStocksParams): Promise<ThemeStock[]> {
        return this.themeService.getThemeStocksByThemeCode(params.themeCode);
    }
}
