import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateJwtTokenBody {
    @ApiProperty({
        type: String,
        name: 'AccountId',
        description: '계좌 정보',
    })
    @IsNotEmpty()
    @IsString()
    accountId!: string;
}
