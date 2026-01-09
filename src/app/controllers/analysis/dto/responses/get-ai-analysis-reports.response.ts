import { ApiProperty } from '@nestjs/swagger';
import { AiAnalysisReport } from '@app/modules/repositories/ai-analysis-report';

export class GetAiAnalysisReportsResponse {
    @ApiProperty({
        type: AiAnalysisReport,
        isArray: true,
    })
    data: AiAnalysisReport[];
}
