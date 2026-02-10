import { ApiProperty } from '@nestjs/swagger';

export class GeneratedJwtToken {
    @ApiProperty({
        type: String,
        name: 'accessToken',
        description: '발급된 Access Token',
    })
    accessToken: string;

    @ApiProperty({
        type: Number,
        name: 'expiresIn',
        description: '토큰 만료 시간',
    })
    expiresIn: number;
}

export class GenerateJwtTokenResponse {
    @ApiProperty({
        type: GeneratedJwtToken,
    })
    data: GeneratedJwtToken;
}
