import { ApiProperty } from '@nestjs/swagger';
import { Nullable } from '@common/types';
import { AiAnalysisStock } from '@app/modules/repositories/analysis-repository';

export class AiAnalysisStockDto implements AiAnalysisStock {
    @ApiProperty({
        description: '종목 코드',
    })
    stockCode: string;

    @ApiProperty({
        description: '종목명',
    })
    stockName: string;

    @ApiProperty({
        description: '분석 내용',
    })
    content: string;

    @ApiProperty({
        description: '업데이트 날짜',
    })
    updatedAt: Date;
}

export class GetAiAnalysisStockResponse {
    @ApiProperty({
        type: AiAnalysisStockDto,
        nullable: true,
    })
    data: Nullable<AiAnalysisStockDto>;
}
