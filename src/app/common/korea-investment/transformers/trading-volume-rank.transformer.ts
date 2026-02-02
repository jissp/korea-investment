import { Pipe } from '@common/types';
import { DomesticStockQuotationVolumeRankOutput } from '@modules/korea-investment/korea-investment-rank-client';
import { TradingVolumeRankDto } from '@app/modules/repositories/trading-volume-rank';

export class TradingVolumeRankTransformer implements Pipe<
    DomesticStockQuotationVolumeRankOutput,
    TradingVolumeRankDto
> {
    transform(
        value: DomesticStockQuotationVolumeRankOutput,
    ): TradingVolumeRankDto {
        return {
            stockCode: value.mksc_shrn_iscd,
            stockName: value.hts_kor_isnm,
            price: Number(value.stck_prpr),
            changePrice: Number(value.prdy_vrss),
            changePriceRate: Number(value.prdy_ctrt),
            tradingVolume: Number(value.avrg_vol),
        };
    }
}
