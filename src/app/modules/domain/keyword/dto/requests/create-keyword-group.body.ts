import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateKeywordGroupBody {
    @ApiProperty({
        type: String,
        description: '키워드 그룹 이름',
    })
    @IsString()
    name: string;
}
