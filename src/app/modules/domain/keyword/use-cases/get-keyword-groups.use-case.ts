import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import {
    KeywordGroup,
    KeywordGroupService,
} from '@app/modules/repositories/keyword';

@Injectable()
export class GetKeywordGroupsUseCase implements BaseUseCase<
    void,
    KeywordGroup[]
> {
    constructor(private readonly keywordGroupService: KeywordGroupService) {}

    async execute(): Promise<KeywordGroup[]> {
        return this.keywordGroupService.getKeywordGroups();
    }
}
