import { Injectable } from '@nestjs/common';
import { Theme, ThemeService } from '@app/modules/repositories/theme';

@Injectable()
export class GetThemesUseCase {
    constructor(private readonly themeService: ThemeService) {}

    async execute(): Promise<Theme[]> {
        return this.themeService.getThemes();
    }
}
