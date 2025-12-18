import { Module } from '@nestjs/common';
import { RedisModule } from '@modules/redis';
import { NaverNewsService } from './naver-news.service';

@Module({
    imports: [RedisModule.forFeature()],
    providers: [NaverNewsService],
    exports: [NaverNewsService],
})
export class NaverNewsModule {}