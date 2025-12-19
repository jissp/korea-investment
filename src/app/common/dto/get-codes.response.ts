import { ApiProperty } from '@nestjs/swagger';

export class CodeItem {
    @ApiProperty({
        type: String,
    })
    code: string;

    @ApiProperty({
        type: String,
    })
    name: string;
}

export class GetCodesResponse {
    @ApiProperty({
        type: CodeItem,
        isArray: true,
    })
    data: CodeItem[];
}
