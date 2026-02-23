import { Injectable } from '@nestjs/common';
import { ThemeService } from '@app/modules/repositories/theme';

export interface AddThemeFavoriteParams {
    themeCode: string;
}

@Injectable()
export class AddThemeFavoriteUseCase {
    constructor(private readonly themeService: ThemeService) {}

    async execute(params: AddThemeFavoriteParams): Promise<void> {
        await this.themeService.updateThemeFavorite(params.themeCode, true);
    }
}
