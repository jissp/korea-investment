import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword, KeywordGroup } from './entities';
import { KeywordService } from './keyword.service';
import { KeywordGroupService } from './keyword-group.service';

const entities = [Keyword, KeywordGroup];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [KeywordService, KeywordGroupService],
    exports: [
        TypeOrmModule.forFeature(entities),
        KeywordService,
        KeywordGroupService,
    ],
})
export class KeywordModule {}
