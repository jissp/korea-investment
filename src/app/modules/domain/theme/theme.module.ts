import { Module } from '@nestjs/common';
import { RepositoryModule } from '@app/modules/repositories/repository.module';
import {
    AddThemeFavoriteUseCase,
    GetFavoriteThemesUseCase,
    GetThemesByStockCodeUseCase,
    GetThemeStocksUseCase,
    GetThemesUseCase,
    RemoveThemeFavoriteUseCase,
} from './use-cases';
import { ThemeController } from './theme.controller';

@Module({
    imports: [RepositoryModule],
    controllers: [ThemeController],
    providers: [
        GetThemesUseCase,
        GetFavoriteThemesUseCase,
        GetThemesByStockCodeUseCase,
        GetThemeStocksUseCase,
        AddThemeFavoriteUseCase,
        RemoveThemeFavoriteUseCase,
    ],
})
export class ThemeModule {}
