import { Pipe } from '@common/types';
import { DomesticStockQuotationVolumeRankOutput } from '@modules/korea-investment/common';
import { TradingVolumeRankDto } from '@app/modules/repositories/trading-volume-rank';

interface TransformerArgs {
    output: DomesticStockQuotationVolumeRankOutput;
}

export class TradingVolumeRankTransformer implements Pipe<
    TransformerArgs,
    TradingVolumeRankDto
> {
    transform({ output }: TransformerArgs): TradingVolumeRankDto {
        return {
            stockCode: output.mksc_shrn_iscd,
            stockName: output.hts_kor_isnm,
            price: Number(output.stck_prpr),
            changePrice: Number(output.prdy_vrss),
            changePriceRate: Number(output.prdy_ctrt),
            tradingVolume: Number(output.avrg_vol),
        };
    }
}
