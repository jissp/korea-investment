import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';
import {
    DomesticStockQuotationsInquireCcnlResponse,
    DomesticStockQuotationsInquireIndexPriceQuery,
    DomesticStockQuotationsInquireIndexPriceResponse,
    DomesticStockQuotationsInquireIndexTimePriceQuery,
    DomesticStockQuotationsInquirePrice2Query,
    DomesticStockQuotationsInquirePrice2Response,
    DomesticStockQuotationsInquireTimeItemChartPriceQuery,
} from './dto';

@Controller('v1/korea-investment/quotations')
export class QuotationController {
    constructor(
        private readonly quotationClient: KoreaInvestmentQuotationClient,
    ) {}

    @ApiOperation({
        summary: '국내업종 현재지수',
    })
    @ApiResponse({
        type: DomesticStockQuotationsInquireIndexPriceResponse,
    })
    @Get('inquire-index-price')
    public async getDomesticSectorCurrentIndex(
        @Query() query: DomesticStockQuotationsInquireIndexPriceQuery,
    ) {
        return this.quotationClient.inquireIndexPrice(query.iscd);
    }

    @ApiOperation({
        summary: '주식현재가 시세',
    })
    @ApiResponse({
        type: DomesticStockQuotationsInquirePrice2Response,
    })
    @Get('inquire-price')
    public async getDomesticInquirePrice(
        @Query() query: DomesticStockQuotationsInquirePrice2Query,
    ) {
        return this.quotationClient.inquirePrice(
            query.marketDivCode,
            query.iscd,
        );
    }

    @ApiOperation({
        summary: '주식현재가 체결',
    })
    @ApiResponse({
        type: DomesticStockQuotationsInquireCcnlResponse,
    })
    @Get('inquire-ccnl')
    public async getDomesticInquireCcnl(
        @Query() query: DomesticStockQuotationsInquirePrice2Query,
    ) {
        return this.quotationClient.inquireCcnl(
            query.marketDivCode,
            query.iscd,
        );
    }

    @ApiOperation({
        summary: '주식당일분봉조회',
    })
    @ApiResponse({
        type: DomesticStockQuotationsInquireTimeItemChartPriceQuery,
    })
    @Get('inquire-time-item-chart-price')
    public async getDomesticInquireTimeItemChartPrice(
        @Query() query: DomesticStockQuotationsInquireTimeItemChartPriceQuery,
    ) {
        return this.quotationClient.inQuireTimeItemChartPrice(
            query.marketDivCode,
            query.iscd,
            new Date(),
            query.isIncludeOldData,
        );
    }

    @ApiOperation({
        summary: '주식일별분봉조회',
    })
    @ApiResponse({
        type: DomesticStockQuotationsInquireTimeItemChartPriceQuery,
    })
    @Get('inquire-time-daily-chart-price')
    public async getDomesticInquireTimeDailyChartPrice(
        @Query() query: DomesticStockQuotationsInquireTimeItemChartPriceQuery,
    ) {
        return this.quotationClient.inQuireTimeDailyChartPrice(
            query.marketDivCode,
            query.iscd,
            new Date(),
            query.isIncludeOldData,
        );
    }

    @ApiOperation({
        summary: '국내업종 시간별지수',
    })
    @ApiResponse({
        type: DomesticStockQuotationsInquireIndexTimePriceQuery,
    })
    @Get('inquire-index-time-price')
    public async getDomesticInquireIndexTimePrice(
        @Query() query: DomesticStockQuotationsInquireIndexTimePriceQuery,
    ) {
        return this.quotationClient.inQuireIndexTimePrice(
            query.iscd,
            query.timeframe,
        );
    }
}
