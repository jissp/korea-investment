import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { Keyword, KeywordService } from '@app/modules/repositories/keyword';

@Injectable()
export class GetKeywordsByGroupUseCase implements BaseUseCase<
    number,
    Keyword[]
> {
    constructor(private readonly keywordService: KeywordService) {}

    async execute(groupId: number): Promise<Keyword[]> {
        return this.keywordService.getKeywordsByGroupId(groupId);
    }
}
