import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssetIdxItem {
    @ApiProperty({
        type: String,
        description: '종목 단축 코드',
    })
    shortCode: string;

    @ApiProperty({
        type: String,
        description: '종목 코드',
    })
    code: string;

    @ApiPropertyOptional({
        type: String,
        description: '종목명',
    })
    name?: string;
}

export class AssetIdxResponse {
    @ApiProperty({
        type: AssetIdxItem,
        isArray: true,
    })
    data: AssetIdxItem[];
}
