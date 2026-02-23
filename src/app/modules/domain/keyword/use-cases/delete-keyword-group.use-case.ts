import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { KeywordGroupService } from '@app/modules/repositories/keyword';

@Injectable()
export class DeleteKeywordGroupUseCase implements BaseUseCase<number, void> {
    constructor(private readonly keywordGroupService: KeywordGroupService) {}

    async execute(groupId: number): Promise<void> {
        await this.keywordGroupService.deleteKeywordGroup(groupId);
    }
}
