import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKeywordBody {
    @ApiProperty({
        type: String,
        description: '키워드',
    })
    @IsString()
    keyword: string;

    @ApiPropertyOptional({
        type: Number,
        description: '키워드 그룹 ID',
    })
    @IsNumber()
    @IsOptional()
    keywordGroupId?: number;
}
