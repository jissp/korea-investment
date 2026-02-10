import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GenerateJwtTokenBody, GenerateJwtTokenResponse } from './dto';

@Controller('v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: 'JWT 토큰 발급 요청',
        description: 'JWT 토큰을 발급 요청합니다.',
    })
    @ApiBody({
        type: GenerateJwtTokenBody,
    })
    @ApiOkResponse({
        type: GenerateJwtTokenResponse,
    })
    @Post('token')
    public async generateJwtToken(
        @Body() { accountId }: GenerateJwtTokenBody,
    ): Promise<GenerateJwtTokenResponse> {
        const { accessToken, expiresIn } =
            await this.authService.generateAccessToken(accountId);

        return {
            data: {
                accessToken,
                expiresIn,
            },
        };
    }
}
