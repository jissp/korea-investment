import { ApiProperty } from '@nestjs/swagger';
import { AiAnalysisStockDto } from './get-ai-analysis-stock.response';

export class GetAiAnalysisStocksResponse {
    @ApiProperty({
        type: AiAnalysisStockDto,
        isArray: true,
    })
    data: AiAnalysisStockDto[];
}
