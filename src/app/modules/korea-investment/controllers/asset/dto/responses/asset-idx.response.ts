import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssetIdxItem {
    @ApiProperty({
        type: String,
        description: '',
    })
    shortCode: string;

    @ApiProperty({
        type: String,
        description: '',
    })
    code: string;

    @ApiPropertyOptional({
        type: String,
        description: '',
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
