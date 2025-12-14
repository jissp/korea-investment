import { ApiProperty } from '@nestjs/swagger';
import { StockPlusAsset, StockPlusNews } from '@modules/stock-plus';

class StockPlusAssetItem implements StockPlusAsset {
    @ApiProperty({
        type: String,
        description: '종목 코드',
    })
    assetCode: string;

    @ApiProperty({
        type: String,
        description: '종목명',
    })
    displayName: string;
}

class InformationStockPlusNews implements StockPlusNews {
    @ApiProperty({
        type: Number,
    })
    id: number;

    @ApiProperty({
        type: String,
        description: '제목',
    })
    title: string;

    @ApiProperty({
        type: Number,
    })
    relatedNewsCount: number;

    @ApiProperty({
        type: String,
        description: '요약',
    })
    summaries: string[];

    @ApiProperty({
        type: String,
    })
    importance: 'GENERAL' | 'MAJOR';

    @ApiProperty({
        type: StockPlusAssetItem,
        description: '관련 종목',
        isArray: true,
    })
    assets: StockPlusAssetItem[];

    @ApiProperty({
        type: String,
        description: '발행일',
    })
    publishedAt: number;
}

export class InformationStockPlusNewsResponse {
    @ApiProperty({
        type: InformationStockPlusNews,
        isArray: true,
    })
    data: InformationStockPlusNews[];
}
