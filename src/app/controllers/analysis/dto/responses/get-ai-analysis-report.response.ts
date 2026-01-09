import { ApiProperty } from '@nestjs/swagger';
import { Nullable } from '@common/types';
import { AiAnalysisReport } from '@app/modules/repositories/ai-analysis-report';

export class GetAiAnalysisReportResponse {
    @ApiProperty({
        type: AiAnalysisReport,
        nullable: true,
    })
    data: Nullable<AiAnalysisReport>;
}
