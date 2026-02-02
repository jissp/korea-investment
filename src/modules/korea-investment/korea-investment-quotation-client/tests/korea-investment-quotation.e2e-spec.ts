import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfig, RedisModule } from '@modules/redis';
import { toDateYmdByDate } from '@common/utils';
import {
    KoreaInvestmentQuotationClient,
    KoreaInvestmentQuotationClientModule,
} from '@modules/korea-investment/korea-investment-quotation-client';
import configuration from '@app/configuration';
import { MarketDivCode } from '@modules/korea-investment/common';

describe('KoreaInvestmentQuotation e2e 테스트', () => {
    let quotationClient: KoreaInvestmentQuotationClient;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [configuration],
                }),
                RedisModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService): RedisConfig => {
                        return configService.get<RedisConfig>('redis')!;
                    },
                }),
                KoreaInvestmentQuotationClientModule,
            ],
        }).compile();

        quotationClient = app.get(KoreaInvestmentQuotationClient);
    });

    describe('일단 API 호출 테스트', () => {
        it('', async () => {
            const currentDate = new Date();
            const koreaInvestmentDate = toDateYmdByDate({
                date: currentDate,
            });

            const news = await quotationClient.getInvestorTradeByStockDaily({
                FID_INPUT_ISCD: '001440',
                FID_INPUT_DATE_1: '2026-02-02',
                FID_COND_MRKT_DIV_CODE: MarketDivCode.통합,
            });

            console.log(news);

            expect(news).toBeDefined();
        });
        // describe('KoreaInvestmentRankClient', () => {
        //     it('거래량 순위 테스트', async () => {
        //         const response = await rankClient.inquireVolumeRank({
        //             FID_COND_MRKT_DIV_CODE: MarketDivCode.KRX,
        //             FID_BLNG_CLS_CODE: '0',
        //             FID_TRGT_EXLS_CLS_CODE: '0000000000',
        //             FID_TRGT_CLS_CODE: '000000000',
        //         });
        //
        //         expect(response).toBeDefined();
        //     });
        //
        //     it('국내주식 등락률 순위 테스트', async () => {
        //         const response = await rankClient.inquireFluctuationRank({
        //             fid_cond_mrkt_div_code: MarketDivCode.KRX,
        //             fid_prc_cls_code: '0',
        //             fid_rank_sort_cls_code: '0',
        //         });
        //
        //         expect(response).toBeDefined();
        //     });
        //
        //     it('HTS조회상위20종목', async () => {
        //         const response = await rankClient.getHtsTopList();
        //
        //         console.log(response);
        //
        //         expect(response).toBeDefined();
        //     });
        // });
    });
});
