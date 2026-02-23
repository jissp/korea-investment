import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { KeywordService, KeywordType } from '@app/modules/repositories/keyword';

interface CreateKeywordInput {
    keyword: string;
    keywordGroupId?: number;
}

@Injectable()
export class CreateKeywordUseCase implements BaseUseCase<
    CreateKeywordInput,
    void
> {
    constructor(private readonly keywordService: KeywordService) {}

    async execute(input: CreateKeywordInput): Promise<void> {
        await this.keywordService.createKeyword({
            type: KeywordType.Manual,
            name: input.keyword,
            keywordGroupId: input.keywordGroupId,
        });
    }
}
