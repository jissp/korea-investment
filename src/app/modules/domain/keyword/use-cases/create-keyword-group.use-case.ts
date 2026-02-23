import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { KeywordGroupService } from '@app/modules/repositories/keyword';
import { CreateKeywordGroupBody } from '../dto';

@Injectable()
export class CreateKeywordGroupUseCase implements BaseUseCase<
    CreateKeywordGroupBody,
    void
> {
    constructor(private readonly keywordGroupService: KeywordGroupService) {}

    async execute({ name }: CreateKeywordGroupBody): Promise<void> {
        await this.keywordGroupService.createKeywordGroup({
            name,
        });
    }
}
