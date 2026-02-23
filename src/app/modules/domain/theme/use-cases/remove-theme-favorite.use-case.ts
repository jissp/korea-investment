import { Injectable } from '@nestjs/common';
import { ThemeService } from '@app/modules/repositories/theme';

export interface RemoveThemeFavoriteParams {
    themeCode: string;
}

@Injectable()
export class RemoveThemeFavoriteUseCase {
    constructor(private readonly themeService: ThemeService) {}

    async execute(params: RemoveThemeFavoriteParams): Promise<void> {
        await this.themeService.updateThemeFavorite(params.themeCode, false);
    }
}
