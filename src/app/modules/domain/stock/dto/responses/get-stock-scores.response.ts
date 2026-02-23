import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CalculateResult } from '@app/modules/analysis/analyzer';

class CalculateResultDto implements CalculateResult {
    @ApiProperty({
        type: Number,
        description: '종목 점수',
    })
    score: number;

    @ApiProperty({
        type: String,
        description: '종목 점수 문구',
    })
    scoreText: string;
}

class StockScoresData {
    @ApiProperty({
        description: '종목 수급 점수',
        type: CalculateResultDto,
    })
    exhaustionTraceScore: CalculateResultDto;
}

export class GetStockScoresResponse {
    @ApiProperty({
        description: '종목 점수 정보',
        type: StockScoresData,
    })
    @Type(() => StockScoresData)
    data: StockScoresData;
}
