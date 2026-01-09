import { Module } from '@nestjs/common';
import { FavoriteStockModule } from '@app/modules/repositories/favorite-stock';
import { KeywordModule } from '@app/modules/repositories/keyword';
import { NewsModule } from '@app/modules/repositories/news';
import { NewsService } from './news.service';

@Module({
    imports: [KeywordModule, FavoriteStockModule, NewsModule],
    providers: [NewsService],
    exports: [NewsService],
})
export class NewsServiceModule {}
