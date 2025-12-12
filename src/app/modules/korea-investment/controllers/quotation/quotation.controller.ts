import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-client/korea-investment-quotation-client';
import {
    DomesticStockQuotationsInquireCcnlResponse,
    DomesticStockQuotationsInquireIndexDailyPriceQuery,
    DomesticStockQuotationsInquireIndexDailyPriceResponse,
    DomesticStockQuotationsInquireIndexPriceQuery,
    DomesticStockQuotationsInquireIndexPriceResponse,
    DomesticStockQuotationsInquireIndexTimePriceQuery,
    DomesticStockQuotationsInquireIndexTimePriceResponse,
    DomesticStockQuotationsInquireMemberQuery,
    DomesticStockQuotationsInquireMemberResponse,
    DomesticStockQuotationsInquirePrice2Query,
    DomesticStockQuotationsInquirePrice2Response,
    DomesticStockQuotationsInquireTimeItemChartPriceQuery,
    DomesticStockQuotationsInquireTimeItemChartPriceResponse,
    DomesticStockQuotationsIntstockMultpriceQuery,
    DomesticStockQuotationsIntstockMultPriceResponse,
    DomesticStockQuotationsNewsTitleQuery,
    DomesticStockQuotationsNewsTitleResponse,
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
        status: HttpStatus.OK,
        type: DomesticStockQuotationsInquireIndexPriceResponse,
    })
    @Get('inquire-index-price')
    public async getDomesticSectorCurrentIndex(
        @Query() query: DomesticStockQuotationsInquireIndexPriceQuery,
    ): Promise<DomesticStockQuotationsInquireIndexPriceResponse> {
        const response = await this.quotationClient.inquireIndexPrice(
            query.iscd,
        );

        return {
            data: response,
        };
    }

    @ApiOperation({
        summary: '주식현재가 시세',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DomesticStockQuotationsInquirePrice2Response,
    })
    @Get('inquire-price')
    public async getDomesticInquirePrice(
        @Query() query: DomesticStockQuotationsInquirePrice2Query,
    ) {
        const response = await this.quotationClient.inquirePrice(
            query.marketDivCode,
            query.iscd,
        );

        return {
            data: response,
        };
    }

    @ApiOperation({
        summary: '주식현재가 체결',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DomesticStockQuotationsInquireCcnlResponse,
    })
    @Get('inquire-ccnl')
    public async getDomesticInquireCcnl(
        @Query() query: DomesticStockQuotationsInquirePrice2Query,
    ) {
        const response = await this.quotationClient.inquireCcnl(
            query.marketDivCode,
            query.iscd,
        );

        return response;
    }

    @ApiOperation({
        summary: '주식당일분봉조회',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DomesticStockQuotationsInquireTimeItemChartPriceResponse,
    })
    @Get('inquire-time-item-chart-price')
    public async getDomesticInquireTimeItemChartPrice(
        @Query() query: DomesticStockQuotationsInquireTimeItemChartPriceQuery,
    ): Promise<DomesticStockQuotationsInquireTimeItemChartPriceResponse> {
        const response = await this.quotationClient.inQuireTimeItemChartPrice(
            query.marketDivCode,
            query.iscd,
            new Date(),
            query.isIncludeOldData,
        );

        return {
            data: {
                data1: response.output,
                data2: response.output2,
            },
        };
    }

    @ApiOperation({
        summary: '주식일별분봉조회',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DomesticStockQuotationsInquireTimeItemChartPriceResponse,
    })
    @Get('inquire-time-daily-chart-price')
    public async getDomesticInquireTimeDailyChartPrice(
        @Query() query: DomesticStockQuotationsInquireTimeItemChartPriceQuery,
    ) {
        const response = await this.quotationClient.inQuireTimeDailyChartPrice(
            query.marketDivCode,
            query.iscd,
            new Date(),
            query.isIncludeOldData,
        );

        return {
            data: response,
        };
    }

    @ApiOperation({
        summary: '국내업종 시간별지수',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DomesticStockQuotationsInquireIndexTimePriceResponse,
    })
    @Get('inquire-index-time-price')
    public async getDomesticInquireIndexTimePrice(
        @Query() query: DomesticStockQuotationsInquireIndexTimePriceQuery,
    ): Promise<DomesticStockQuotationsInquireIndexTimePriceResponse> {
        const response = await this.quotationClient.inQuireIndexTimePrice(
            query.iscd,
            query.timeframe,
        );

        return {
            data: response,
        };
    }

    @ApiOperation({
        summary: '국내업종 일자별지수',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DomesticStockQuotationsInquireIndexDailyPriceResponse,
    })
    @Get('inquire-index-daily-price')
    public async getDomesticInquireIndexDailyPrice(
        @Query() query: DomesticStockQuotationsInquireIndexDailyPriceQuery,
    ): Promise<DomesticStockQuotationsInquireIndexDailyPriceResponse> {
        const response =
            await this.quotationClient.inQuireIndexDailyPrice(query);

        return {
            data: {
                data1: response.output,
                data2: response.output2,
            },
        };
    }

    @ApiOperation({
        summary: '주식현재가 회원사',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DomesticStockQuotationsInquireMemberResponse,
    })
    @Get('inquire-member')
    public async getDomesticInquireMember(
        @Query() query: DomesticStockQuotationsInquireMemberQuery,
    ): Promise<DomesticStockQuotationsInquireMemberResponse> {
        const response = await this.quotationClient.inQuireMember(query);

        return {
            data: response,
        };
    }

    @ApiOperation({
        summary: '종합 시황/공시(제목)',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DomesticStockQuotationsNewsTitleResponse,
    })
    @Get('news-title')
    public async getDomesticNewsTitle(
        @Query() query: DomesticStockQuotationsNewsTitleQuery,
    ): Promise<DomesticStockQuotationsNewsTitleResponse> {
        const response = await this.quotationClient.inQuireNewsTitle(query);

        return {
            data: response,
        };
    }

    @ApiOperation({
        summary: '관심종목(멀티종목) 시세조회',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DomesticStockQuotationsIntstockMultPriceResponse,
    })
    @Get('intstock-multi-price')
    public async getDomesticIntstockMultiPrice(
        @Query() query: DomesticStockQuotationsIntstockMultpriceQuery,
    ): Promise<DomesticStockQuotationsIntstockMultPriceResponse> {
        const response =
            await this.quotationClient.inQuireIntstockMultiPrice(query);

        return {
            data: response,
        };
    }
}
