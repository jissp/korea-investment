import { ApiProperty } from '@nestjs/swagger';

export class CodeItem {
    @ApiProperty({
        type: String,
    })
    code: string;
}

export class GetCodesResponse {
    @ApiProperty({
        type: CodeItem,
        isArray: true,
    })
    data: CodeItem[];
}
