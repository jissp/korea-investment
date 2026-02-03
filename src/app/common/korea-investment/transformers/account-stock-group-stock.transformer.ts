import { Pipe } from '@common/types';
import { DomesticStockQuotationsIntstockMultPriceOutput } from '@modules/korea-investment/common';
import { UpdateAccountStockGroupStockDto } from '@app/modules/repositories/account-stock-group';

export class AccountStockGroupStockTransformer implements Pipe<
    DomesticStockQuotationsIntstockMultPriceOutput,
    UpdateAccountStockGroupStockDto
> {
    transform({
        inter_shrn_iscd,
        inter2_prpr,
        inter2_prdy_vrss,
        prdy_ctrt,
        inter2_hgpr,
        inter2_lwpr,
        acml_vol,
    }: DomesticStockQuotationsIntstockMultPriceOutput): UpdateAccountStockGroupStockDto {
        return {
            stockCode: inter_shrn_iscd,
            price: Number(inter2_prpr),
            changePrice: Number(inter2_prdy_vrss),
            changePriceRate: Number(prdy_ctrt),
            lowPrice: Number(inter2_lwpr),
            highPrice: Number(inter2_hgpr),
            tradingVolume: Number(acml_vol),
        };
    }
}
