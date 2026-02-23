import { Injectable, NotFoundException } from '@nestjs/common';
import { Nullable } from '@common/types';
import { BaseUseCase } from '@app/common/types';
import {
    KeywordGroupService,
    KeywordService,
    KeywordType,
} from '@app/modules/repositories/keyword';

interface DeleteKeywordParams {
    keyword: string;
    keywordGroupId?: Nullable<number>;
}

@Injectable()
export class DeleteKeywordUseCase implements BaseUseCase<
    DeleteKeywordParams,
    void
> {
    constructor(
        private readonly keywordService: KeywordService,
        private readonly keywordGroupService: KeywordGroupService,
    ) {}

    async execute({
        keyword,
        keywordGroupId,
    }: DeleteKeywordParams): Promise<void> {
        if (keywordGroupId) {
            const keywordGroup =
                await this.keywordGroupService.getKeywordGroup(keywordGroupId);
            if (!keywordGroup) {
                throw new NotFoundException('키워드 그룹이 존재하지 않습니다.');
            }
        }

        await this.keywordService.deleteKeywordByName({
            type: KeywordType.Manual,
            name: keyword,
            keywordGroupId: keywordGroupId ?? null,
        });
    }
}
