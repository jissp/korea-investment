import { Module } from '@nestjs/common';
import { NewsServiceModule } from '@app/modules/services/news-service';

@Module({
    imports: [NewsServiceModule],
    exports: [NewsServiceModule],
})
export class AppServiceModule {}
