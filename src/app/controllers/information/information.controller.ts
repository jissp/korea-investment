import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { StockRepository } from '@app/modules/stock-repository';
import {
    InformationKoreaInvestmentNewsResponse,
    InformationStockPlusNewsResponse,
} from './dto';

@Controller('v1/information')
export class InformationController {
    constructor(private readonly stockRepository: StockRepository) {}

    @ApiOperation({
        summary: '한국투자증권 뉴스 조회',
    })
    @ApiOkResponse({
        type: InformationKoreaInvestmentNewsResponse,
    })
    @Get('news/korea-investment')
    public async getKoreaInvestmentNews(): Promise<InformationKoreaInvestmentNewsResponse> {
        const news = await this.stockRepository.getKoreaInvestmentNews();

        return {
            data: news,
        };
    }

    @ApiOperation({
        summary: '증권 플러스 뉴스 조회',
    })
    @ApiOkResponse({
        type: InformationStockPlusNewsResponse,
    })
    @Get('news/stock-plus')
    public async getStockPlusNews(): Promise<InformationStockPlusNewsResponse> {
        const news = await this.stockRepository.getStockPlusNews();

        return {
            data: news,
        };
    }
}
