import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { KeywordService, KeywordType } from '@app/modules/repositories/keyword';
import { CreateKeywordBody } from '../dto';

@Injectable()
export class CreateKeywordUseCase implements BaseUseCase<
    CreateKeywordBody,
    void
> {
    constructor(private readonly keywordService: KeywordService) {}

    async execute({
        keyword,
        keywordGroupId,
    }: CreateKeywordBody): Promise<void> {
        await this.keywordService.createKeyword({
            type: KeywordType.Manual,
            name: keyword,
            keywordGroupId,
        });
    }
}
