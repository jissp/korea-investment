import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import * as IdxCodeJson from '@assets/idxcode.json';
import * as KrxKosdaqCodeJson from '@assets/kosdaq_code.json';
import * as KrxKospiCodeJson from '@assets/kospi_code.json';
import * as NxtKosdaqCodeJson from '@assets/nxt_kosdaq_code.json';
import * as NxtKospiCodeJson from '@assets/nxt_kospi_code.json';

type IndexCode = {
    shortCode: string;
    code: string;
};

type ExtendedIndexCode = IndexCode & {
    name: string;
};

const IdxCodes: IndexCode[] = IdxCodeJson as unknown as IndexCode[];
const KrxKosdaqCodes: ExtendedIndexCode[] =
    KrxKosdaqCodeJson as unknown as ExtendedIndexCode[];
const KrxKospiCodes: ExtendedIndexCode[] =
    KrxKospiCodeJson as unknown as ExtendedIndexCode[];
const NxtKosdaqCodes: ExtendedIndexCode[] =
    NxtKosdaqCodeJson as unknown as ExtendedIndexCode[];
const NxtKospiCodes: ExtendedIndexCode[] =
    NxtKospiCodeJson as unknown as ExtendedIndexCode[];

@Controller('v1/korea-investment/assets')
export class AssetController {
    @ApiOperation({
        summary: '',
    })
    @Get('idx')
    public async getIdxCode() {
        return IdxCodes;
    }

    @ApiOperation({
        summary: '',
    })
    @Get('kosdaq/:type')
    public async getKosdaqCode(@Param('type') type: 'krx' | 'nxt') {
        if (type === 'nxt') {
            return NxtKosdaqCodes;
        }

        return KrxKosdaqCodes;
    }

    @ApiOperation({
        summary: '',
    })
    @Get('kospi/:type')
    public async getKospiCode(@Param('type') type: 'krx' | 'nxt') {
        if (type === 'nxt') {
            return NxtKospiCodes;
        }

        return KrxKospiCodes;
    }
}
