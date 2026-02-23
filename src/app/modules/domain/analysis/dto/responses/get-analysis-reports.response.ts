import { ApiProperty } from '@nestjs/swagger';
import { AiAnalysisReport } from '@app/modules/repositories/ai-analysis-report';

export class GetAnalysisReportsResponse {
    @ApiProperty({
        type: AiAnalysisReport,
        isArray: true,
    })
    data: AiAnalysisReport[];
}
