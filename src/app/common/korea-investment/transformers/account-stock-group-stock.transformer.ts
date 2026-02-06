import { Pipe } from '@common/types';
import { DomesticStockQuotationsIntstockMultPriceOutput } from '@modules/korea-investment/common';
import { UpdateAccountStockGroupStockDto } from '@app/modules/repositories/account-stock-group';

interface TransformerArgs {
    output: DomesticStockQuotationsIntstockMultPriceOutput;
}

export class AccountStockGroupStockTransformer implements Pipe<
    TransformerArgs,
    UpdateAccountStockGroupStockDto
> {
    transform({ output }: TransformerArgs): UpdateAccountStockGroupStockDto {
        return {
            stockCode: output.inter_shrn_iscd,
            price: Number(output.inter2_prpr),
            changePrice: Number(output.inter2_prdy_vrss),
            changePriceRate: Number(output.prdy_ctrt),
            lowPrice: Number(output.inter2_lwpr),
            highPrice: Number(output.inter2_hgpr),
            tradingVolume: Number(output.acml_vol),
        };
    }
}
