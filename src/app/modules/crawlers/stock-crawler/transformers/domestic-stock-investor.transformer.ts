import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { KoreaInvestmentStockInvestor } from '@app/modules/repositories/stock-repository/stock-repository.types';
import { DomesticStockQuotationsInquireInvestorOutput } from '@modules/korea-investment/korea-investment-quotation-client';

export class DomesticStockInvestorTransformer {
    transform(
        output: DomesticStockQuotationsInquireInvestorOutput,
    ): KoreaInvestmentStockInvestor {
        return {
            date: toDateByKoreaInvestmentYmd(output.stck_bsop_date),
            stockPrice: Number(output.stck_clpr),
            prsnQuantity: Number(output.prsn_ntby_qty),
            frgnQuantity: Number(output.frgn_ntby_qty),
            orgnQuantity: Number(output.orgn_ntby_qty),
        };
    }
}
