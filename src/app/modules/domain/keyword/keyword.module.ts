import { Module } from '@nestjs/common';
import { RepositoryModule } from '@app/modules/repositories/repository.module';
import {
    CreateKeywordGroupUseCase,
    CreateKeywordUseCase,
    DeleteKeywordGroupUseCase,
    DeleteKeywordUseCase,
    GetKeywordGroupsUseCase,
    GetKeywordsByGroupUseCase,
} from './use-cases';
import { KeywordController } from './keyword.controller';
import { KeywordGroupController } from './keyword-group.controller';

@Module({
    imports: [RepositoryModule],
    controllers: [KeywordController, KeywordGroupController],
    providers: [
        CreateKeywordUseCase,
        DeleteKeywordUseCase,
        GetKeywordsByGroupUseCase,
        CreateKeywordGroupUseCase,
        DeleteKeywordGroupUseCase,
        GetKeywordGroupsUseCase,
    ],
    exports: [],
})
export class KeywordModule {}
