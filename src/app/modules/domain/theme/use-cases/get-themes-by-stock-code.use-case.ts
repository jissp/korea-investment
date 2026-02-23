import { Injectable } from '@nestjs/common';
import { Theme, ThemeService } from '@app/modules/repositories/theme';

export interface GetThemesByStockCodeParams {
    stockCode: string;
}

@Injectable()
export class GetThemesByStockCodeUseCase {
    constructor(private readonly themeService: ThemeService) {}

    async execute(params: GetThemesByStockCodeParams): Promise<Theme[]> {
        return this.themeService.getThemesByStockCode(params.stockCode);
    }
}
