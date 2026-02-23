import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { KeywordGroupService } from '@app/modules/repositories/keyword';

interface CreateKeywordGroupInput {
    name: string;
}

@Injectable()
export class CreateKeywordGroupUseCase implements BaseUseCase<
    CreateKeywordGroupInput,
    void
> {
    constructor(private readonly keywordGroupService: KeywordGroupService) {}

    async execute(input: CreateKeywordGroupInput): Promise<void> {
        await this.keywordGroupService.createKeywordGroup({
            name: input.name,
        });
    }
}
