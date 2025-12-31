import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { StockRepository } from '@app/modules/stock-repository';
import {
    DomesticIndexItem,
    IndexRepository,
    OverseasGovernmentBondItem,
    OverseasIndexItem,
} from '@app/modules/repositories';
import {
    DOMESTIC_INDEX_CODES,
    OVERSEAS_GOVERNMENT_BOND_CODES,
    OVERSEAS_INDEX_CODES,
} from '@app/modules/crawlers/korea-investment-index-crawler';
import {
    DomesticIndexPriceResponse,
    OverseasGovernmentBondsResponse,
    OverseasIndexPriceResponse,
} from './dto';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Controller('v1/stocks/indexes')
export class StockIndexController {
    private readonly logger = new Logger(StockIndexController.name);

    constructor(
        private readonly stockRepository: StockRepository,
        private readonly indexRepository: IndexRepository,
    ) {}

    @ApiOperation({
        summary: '국내 업종 시세 조회',
    })
    @ApiOkResponse({
        type: DomesticIndexPriceResponse,
    })
    @Get('domestics')
    public async getDomesticIndexes(): Promise<DomesticIndexPriceResponse> {
        try {
            const domesticIndexes = await Promise.all(
                DOMESTIC_INDEX_CODES.map(({ code }) =>
                    this.indexRepository.getDomesticIndex(code),
                ),
            );

            return {
                data: domesticIndexes.filter(
                    (index): index is DomesticIndexItem => !isNil(index),
                ),
            };
        } catch (error) {
            this.logger.error(error);

            return {
                data: [],
            };
        }
    }

    @ApiOperation({
        summary: '해외 업종 시세 조회',
    })
    @ApiOkResponse({
        type: OverseasIndexPriceResponse,
    })
    @Get('overseas')
    public async getOverseasIndexes(): Promise<OverseasIndexPriceResponse> {
        try {
            const overseasIndexes = await Promise.all(
                OVERSEAS_INDEX_CODES.map(({ code }) =>
                    this.indexRepository.getOverseasIndex(code),
                ),
            );

            return {
                data: overseasIndexes.filter(
                    (index): index is OverseasIndexItem => !isNil(index),
                ),
            };
        } catch (error) {
            this.logger.error(error);

            return {
                data: [],
            };
        }
    }

    @ApiOperation({
        summary: '미국 국채 지수 조회',
    })
    @ApiOkResponse({
        type: OverseasGovernmentBondsResponse,
    })
    @Get('overseas/government-bonds')
    public async getOverseasGovernmentBonds(): Promise<OverseasGovernmentBondsResponse> {
        try {
            const overseasGovernmentBondsIndexes = await Promise.all(
                OVERSEAS_GOVERNMENT_BOND_CODES.map(({ code }) =>
                    this.indexRepository.getOverseasGovernmentBond(code),
                ),
            );

            return {
                data: overseasGovernmentBondsIndexes.filter(
                    (index): index is OverseasGovernmentBondItem =>
                        !isNil(index),
                ),
            };
        } catch (error) {
            this.logger.error(error);

            return {
                data: [],
            };
        }
    }
}
