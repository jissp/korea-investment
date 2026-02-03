import { Injectable } from '@nestjs/common';
import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { getStockName } from '@common/domains';
import { MarketType } from '@app/common/types';
import { DomesticInvestorTradeByStockDailyOutput2 } from '@modules/korea-investment/common';
import { StockInvestorDto } from '@app/modules/repositories/stock-investor';

interface TransformParams {
    stockCode: string;
    output: DomesticInvestorTradeByStockDailyOutput2;
}

@Injectable()
export class StockInvestorTransformer {
    transform({ stockCode, output }: TransformParams): StockInvestorDto {
        return {
            marketType: MarketType.Domestic,
            date: toDateByKoreaInvestmentYmd(output.stck_bsop_date),
            stockCode,
            stockName: getStockName(stockCode),
            price: Number(output.stck_clpr),
            highPrice: Number(output.stck_hgpr),
            lowPrice: Number(output.stck_lwpr),
            tradeVolume: Number(output.acml_vol),
            person: Number(output.prsn_ntby_qty),
            foreigner: Number(output.frgn_ntby_qty),
            organization: Number(output.orgn_ntby_qty),
            financialInvestment: Number(output.scrt_ntby_qty),
            investmentTrust: Number(output.ivtr_ntby_qty),
            privateEquity: Number(output.pe_fund_ntby_vol),
            bank: Number(output.bank_ntby_qty),
            insurance: Number(output.insu_ntby_qty),
            merchantBank: Number(output.mrbn_ntby_qty),
            fund: Number(output.fund_ntby_qty),
            etc: Number(output.etc_ntby_qty),
        };
    }
}
