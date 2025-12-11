import { ApiProperty } from '@nestjs/swagger';
import { DomesticStockRankingHtsTopViewOutput } from '@modules/korea-investment/korea-investment-client/korea-investment-rank-client';

class DomesticStockRankingHtsTopView implements DomesticStockRankingHtsTopViewOutput {
    @ApiProperty({
        type: String,
        enum: ['J', 'Q'],
        description: '시장구분 (J:코스피, Q:코스닥)',
    })
    mrkt_div_cls_code: 'J' | 'Q';

    @ApiProperty({
        type: String,
        description: '종목코드',
    })
    mksc_shrn_iscd: string;
}

export class DomesticStockRankingHtsTopViewResponse {
    @ApiProperty({
        type: DomesticStockRankingHtsTopView,
        isArray: true,
    })
    data: DomesticStockRankingHtsTopView[];
}
