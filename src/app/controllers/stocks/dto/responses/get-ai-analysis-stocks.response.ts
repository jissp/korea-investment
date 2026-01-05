import { ApiProperty } from '@nestjs/swagger';
import { AiAnalysisStockDto } from '@app/controllers/stocks/dto/responses/get-ai-analysis-stock.response';

export class GetAiAnalysisStocksResponse {
    @ApiProperty({
        type: AiAnalysisStockDto,
        isArray: true,
    })
    data: AiAnalysisStockDto[];
}
