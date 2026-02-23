import { ApiProperty } from '@nestjs/swagger';
import { Nullable } from '@common/types';
import { AiAnalysisReport } from '@app/modules/repositories/ai-analysis-report';

export class GetAnalysisReportResponse {
    @ApiProperty({
        type: AiAnalysisReport,
        nullable: true,
    })
    data: Nullable<AiAnalysisReport>;
}
