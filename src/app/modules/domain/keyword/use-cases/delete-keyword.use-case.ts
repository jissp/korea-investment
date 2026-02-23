import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import {
    KeywordGroupService,
    KeywordService,
    KeywordType,
} from '@app/modules/repositories/keyword';
import { Nullable } from '@common/types';

interface DeleteKeywordInput {
    keyword: string;
    keywordGroupId?: Nullable<number>;
}

@Injectable()
export class DeleteKeywordUseCase implements BaseUseCase<
    DeleteKeywordInput,
    void
> {
    constructor(
        private readonly keywordService: KeywordService,
        private readonly keywordGroupService: KeywordGroupService,
    ) {}

    async execute(input: DeleteKeywordInput): Promise<void> {
        if (input.keywordGroupId) {
            const keywordGroup = await this.keywordGroupService.getKeywordGroup(
                input.keywordGroupId,
            );
            if (!keywordGroup) {
                throw new NotFoundException('키워드 그룹이 존재하지 않습니다.');
            }
        }

        await this.keywordService.deleteKeywordByName({
            type: KeywordType.Manual,
            name: input.keyword,
            keywordGroupId: input.keywordGroupId ?? null,
        });
    }
}
