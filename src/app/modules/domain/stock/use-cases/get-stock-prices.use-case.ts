import { chunk, groupBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { BaseUseCase, MarketType, YN } from '@app/common/types';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockPriceTransformer } from '@app/common/korea-investment';
import { KoreaInvestmentRequestApiHelper } from '@app/modules/korea-investment-request-api/common';
import { Stock, StockService } from '@app/modules/repositories/stock';
import { StockPriceDto } from '../dto';

interface GetStockPricesArgs {
    stockCodes: string;
}

@Injectable()
export class GetStockPricesUseCase implements BaseUseCase<
    GetStockPricesArgs,
    StockPriceDto[]
> {
    constructor(
        private readonly stockService: StockService,
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
        private readonly koreaInvestmentRequestApiHelper: KoreaInvestmentRequestApiHelper,
    ) {}

    async execute(args: GetStockPricesArgs): Promise<StockPriceDto[]> {
        const splitStockCodes = args.stockCodes.split(',');

        const stocks = await this.stockService.getStocksByStockCode({
            marketType: MarketType.Domestic,
            stockCodes: splitStockCodes,
        });
        const groupedStocks = groupBy(stocks, (stock) => stock.isNextTrade);

        const responses = await Promise.all(
            Object.entries(groupedStocks).flatMap(
                ([isNxt, stocks]: [YN, Stock[]]) => {
                    const marketDivCode =
                        isNxt === YN.Y ? MarketDivCode.통합 : MarketDivCode.KRX;
                    const stockChunks = chunk(stocks, 30);

                    return stockChunks.map((stocks) => {
                        const params =
                            this.koreaInvestmentRequestApiHelper.buildIntstockMultiPriceParam(
                                marketDivCode,
                                stocks.map((stock) => stock.shortCode),
                            );

                        return this.koreaInvestmentQuotationClient.inquireIntstockMultiPrice(
                            params,
                        );
                    });
                },
            ),
        );

        const transformer = new StockPriceTransformer();
        return responses.flat().map((output) =>
            transformer.transform({
                output,
            }),
        );
    }
}
