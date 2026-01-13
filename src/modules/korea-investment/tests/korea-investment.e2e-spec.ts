import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfig, RedisModule } from '@modules/redis';
import configuration from '@app/configuration';
import { MarketDivCode } from '@modules/korea-investment/common';
import { KoreaInvestmentConfigModule } from '@modules/korea-investment/korea-investment-config';
import {
    KoreaInvestmentQuotationClient,
    KoreaInvestmentQuotationClientModule,
} from '@modules/korea-investment/korea-investment-quotation-client';
import {
    KoreaInvestmentHelperModule,
    KoreaInvestmentHelperService,
} from '@modules/korea-investment/korea-investment-helper';
import {
    KoreaInvestmentRankClient,
    KoreaInvestmentRankClientModule,
} from '@modules/korea-investment/korea-investment-rank-client';

describe('KoreaInvestmentOauthClient e2e 테스트', () => {
    let helperService: KoreaInvestmentHelperService;
    let quotationClient: KoreaInvestmentQuotationClient;
    let rankClient: KoreaInvestmentRankClient;

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
                KoreaInvestmentConfigModule,
                KoreaInvestmentHelperModule,
                KoreaInvestmentQuotationClientModule,
                KoreaInvestmentRankClientModule,
            ],
        }).compile();

        helperService = app.get(KoreaInvestmentHelperService);
        quotationClient = app.get(KoreaInvestmentQuotationClient);
        rankClient = app.get(KoreaInvestmentRankClient);
    });

    describe('일단 API 호출 테스트', () => {
        it('토큰 발급 테스트', async () => {
            const token = await helperService.getToken();

            expect(token).toBeDefined();
        });

        describe('KoreaInvestmentQuotationClient', () => {
            // it('관심종목(멀티종목) 시세조회', async () => {
            //     const response =
            //         await quotationClient.inquireIntstockMultiPrice({
            //             FID_INPUT_ISCD_1: '128940',
            //             FID_COND_MRKT_DIV_CODE_1: 'UN',
            //         });
            //
            //     expect(response).toBeDefined();
            // });

            // it('투자자 동향 조회', async () => {
            //     const response = await quotationClient.inquireInvestor({
            //         FID_INPUT_ISCD: '005930',
            //         FID_COND_MRKT_DIV_CODE: MarketDivCode.통합,
            //     });
            //
            //     expect(response).toBeDefined();
            // });

            // it('국내업종 현재지수 테스트', async () => {
            //     const response =
            //         await quotationClient.inquireIndexPrice('0001');
            //
            //     expect(response).toBeDefined();
            // });

            // it('국내업종 구분별전체시세', async () => {
            //     const response =
            //         await quotationClient.inquireIndexPriceByCategory({
            //             FID_BLNG_CLS_CODE: '0',
            //             FID_MRKT_CLS_CODE: 'K',
            //             FID_INPUT_ISCD: '',
            //         });
            //
            //     expect(response).toBeDefined();
            // });

            // it('주식기본조회', async () => {
            //     const response = await quotationClient.inquireSearchStockInfo({
            //         PRDT_TYPE_CD: '300',
            //         PDNO: '005930',
            //     });
            //
            //     expect(response).toBeDefined();
            // });

            it('상품기본조회', async () => {
                const response = await quotationClient.inquireSearchInfo({
                    PRDT_TYPE_CD: '300',
                    PDNO: '005930',
                });

                expect(response).toBeDefined();
            });
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
