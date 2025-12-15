import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import * as IdxCodeJson from '@assets/idxcode.json';
import * as KrxKosdaqCodeJson from '@assets/kosdaq_code.json';
import * as KrxKospiCodeJson from '@assets/kospi_code.json';
import * as NxtKosdaqCodeJson from '@assets/nxt_kosdaq_code.json';
import * as NxtKospiCodeJson from '@assets/nxt_kospi_code.json';
import { type AssetIdxItem, AssetIdxResponse } from './dto';

const IdxCodes: AssetIdxItem[] = IdxCodeJson as unknown as AssetIdxItem[];
const KrxKosdaqCodes: AssetIdxItem[] =
    KrxKosdaqCodeJson as unknown as AssetIdxItem[];
const KrxKospiCodes: AssetIdxItem[] =
    KrxKospiCodeJson as unknown as AssetIdxItem[];
const NxtKosdaqCodes: AssetIdxItem[] =
    NxtKosdaqCodeJson as unknown as AssetIdxItem[];
const NxtKospiCodes: AssetIdxItem[] =
    NxtKospiCodeJson as unknown as AssetIdxItem[];

@Controller('v1/assets')
export class AssetController {
    @ApiOperation({
        summary: '',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: AssetIdxResponse,
    })
    @Get('idx')
    public async getIdxCode(): Promise<AssetIdxResponse> {
        return {
            data: IdxCodes,
        };
    }

    @ApiOperation({
        summary: '',
    })
    @ApiParam({
        name: 'type',
        enum: ['krx', 'nxt'],
        description: '시장 구분',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: AssetIdxResponse,
    })
    @Get('kosdaq/:type')
    public async getKosdaqCode(
        @Param('type') type: 'krx' | 'nxt',
    ): Promise<AssetIdxResponse> {
        return {
            data: type === 'nxt' ? NxtKosdaqCodes : KrxKosdaqCodes,
        };
    }

    @ApiOperation({
        summary: '',
    })
    @ApiParam({
        name: 'type',
        enum: ['krx', 'nxt'],
        description: '시장 구분',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: AssetIdxResponse,
    })
    @Get('kospi/:type')
    public async getKospiCode(
        @Param('type') type: 'krx' | 'nxt',
    ): Promise<AssetIdxResponse> {
        return {
            data: type === 'nxt' ? NxtKospiCodes : KrxKospiCodes,
        };
    }
}
