import { Injectable } from '@nestjs/common';
import { BaseUseCase, YN } from '@app/common/types';
import { MarketDivCode, PeriodType } from '@modules/korea-investment/common';
import { KoreaInvestmentQuotationClient } from '@modules/korea-investment/korea-investment-quotation-client';
import { StockDailyPriceTransformer } from '@app/common/korea-investment';
import { StockService } from '@app/modules/repositories/stock';
import { StockDailyPriceDto } from '../dto';

interface GetDailyPricesArgs {
    stockCode: string;
    periodType: PeriodType;
}

@Injectable()
export class GetDailyPricesUseCase implements BaseUseCase<
    GetDailyPricesArgs,
    StockDailyPriceDto[]
> {
    constructor(
        private readonly stockService: StockService,
        private readonly koreaInvestmentQuotationClient: KoreaInvestmentQuotationClient,
    ) {}

    async execute(args: GetDailyPricesArgs): Promise<StockDailyPriceDto[]> {
        const stock = (await this.stockService.getStock(args.stockCode))!;

        const response =
            await this.koreaInvestmentQuotationClient.inquireDailyPrice({
                FID_COND_MRKT_DIV_CODE:
                    stock.isNextTrade === YN.Y
                        ? MarketDivCode.통합
                        : MarketDivCode.KRX,
                FID_INPUT_ISCD: stock.shortCode,
                FID_ORG_ADJ_PRC: '1',
                FID_PERIOD_DIV_CODE: args.periodType,
            });

        const transformer = new StockDailyPriceTransformer();
        return response.output.map((output) =>
            transformer.transform({ output }),
        );
    }
}
