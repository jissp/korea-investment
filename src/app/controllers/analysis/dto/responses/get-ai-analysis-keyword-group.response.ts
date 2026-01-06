import { ApiProperty } from '@nestjs/swagger';
import { Nullable } from '@common/types';
import { AiAnalysisKeywordGroup } from '@app/modules/repositories/analysis-repository';

export class AiAnalysisKeywordGroupDto implements AiAnalysisKeywordGroup {
    @ApiProperty({
        description: '그룹명',
    })
    groupName: string;

    @ApiProperty({
        description: '분석 내용',
    })
    content: string;

    @ApiProperty({
        description: '업데이트 날짜',
    })
    updatedAt: Date;
}

export class GetAiAnalysisKeywordGroupResponse {
    @ApiProperty({
        type: AiAnalysisKeywordGroupDto,
        nullable: true,
    })
    data: Nullable<AiAnalysisKeywordGroupDto>;
}
