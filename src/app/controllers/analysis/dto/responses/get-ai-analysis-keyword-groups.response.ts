import { ApiProperty } from '@nestjs/swagger';
import { AiAnalysisKeywordGroupDto } from './get-ai-analysis-keyword-group.response';

export class GetAiAnalysisKeywordGroupsResponse {
    @ApiProperty({
        type: AiAnalysisKeywordGroupDto,
        isArray: true,
    })
    data: AiAnalysisKeywordGroupDto[];
}
