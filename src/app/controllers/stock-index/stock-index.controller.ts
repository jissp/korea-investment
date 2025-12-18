import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { StockRepository } from '@app/modules/stock-repository';
import {
    DomesticIndexPriceResponse,
    DomesticIndexPriceWithKey,
    OverseasGovernmentBondsResponse,
    OverseasIndexPriceResponse,
    OverseasIndexPriceWithKey,
} from './dto';

@Controller('v1/stocks/indexes')
export class StockIndexController {
    constructor(private readonly stockRepository: StockRepository) {}

    @ApiOperation({
        summary: '국내 업종 시세 조회',
    })
    @ApiOkResponse({
        type: DomesticIndexPriceResponse,
    })
    @Get('korea')
    public async getKoreaIndexes(): Promise<DomesticIndexPriceResponse> {
        const koreaIndexes = await this.stockRepository.getKoreaIndex();

        if (!koreaIndexes) {
            return {
                data: [],
            };
        }

        return {
            data: Object.entries(koreaIndexes).map(
                ([key, value]): DomesticIndexPriceWithKey => ({
                    key,
                    data: value,
                }),
            ),
        };
    }

    @ApiOperation({
        summary: '해외 업종 시세 조회',
    })
    @ApiOkResponse({
        type: OverseasIndexPriceResponse,
    })
    @Get('overseas')
    public async getOverseasIndexes(): Promise<OverseasIndexPriceResponse> {
        const indexes = await this.stockRepository.getOverseasIndex();
        if (!indexes) {
            return {
                data: [],
            };
        }

        return {
            data: Object.entries(indexes).map(
                ([key, value]): OverseasIndexPriceWithKey => ({
                    key,
                    data: value,
                }),
            ),
        };
    }

    @ApiOperation({
        summary: '미국 국채 지수 조회',
    })
    @ApiOkResponse({
        type: OverseasGovernmentBondsResponse,
    })
    @Get('overseas/government-bonds')
    public async getOverseasGovernmentBonds(): Promise<OverseasGovernmentBondsResponse> {
        const bonds = await this.stockRepository.getOverseasGovernmentBonds();
        if (!bonds) {
            return {
                data: [],
            };
        }

        return {
            data: Object.entries(bonds).map(([key, value]) => ({
                key,
                data: value.output,
                data2: value.output2,
            })),
        };
    }
}
