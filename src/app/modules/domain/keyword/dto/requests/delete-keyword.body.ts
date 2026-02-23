import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class DeleteKeywordBody {
    @ApiProperty({
        type: String,
        description: '키워드 그룹명',
    })
    @IsNumber()
    @IsOptional()
    keywordGroupId?: number;
}
