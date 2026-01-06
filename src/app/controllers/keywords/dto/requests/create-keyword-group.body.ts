import { ApiProperty } from '@nestjs/swagger';

export class CreateKeywordGroupBody {
    @ApiProperty({
        type: String,
        description: '키워드 그룹 이름',
    })
    name: string;
}
