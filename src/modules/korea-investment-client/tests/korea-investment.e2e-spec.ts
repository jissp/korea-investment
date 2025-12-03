import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfig, RedisModule } from '@modules/redis';
import configuration from '@app/configuration';
import { MarketDivCode } from '@modules/korea-investment-client/common';
import { KoreaInvestmentConfigModule } from '@modules/korea-investment-client/korea-investment-config';
import {
    KoreaInvestmentQuotationClient,
    KoreaInvestmentQuotationClientModule,
} from '@modules/korea-investment-client/korea-investment-quotation-client';
import {
    KoreaInvestmentHelperModule,
    KoreaInvestmentHelperService,
} from '@modules/korea-investment-client/korea-investment-helper';
import {
    KoreaInvestmentRankClient,
    KoreaInvestmentRankClientModule,
} from '@modules/korea-investment-client/korea-investment-rank-client';

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
                    useFactory: async (
                        configService: ConfigService,
                    ): Promise<RedisConfig> => {
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

    it('oAuth test', async () => {
        const token = await helperService.getToken();

        expect(token).toBeDefined();
    });

    describe('KoreaInvestmentQuotationClient', () => {
        it('inquireIndexPrice test', async () => {
            try {
                const response =
                    await quotationClient.inquireIndexPrice('0001');

                console.log(response);
            } catch (error) {
                console.log(error);
            }
        });

        it('inquireVolumeRank test', async () => {
            try {
                const response = await rankClient.inquireVolumeRank({
                    FID_COND_MRKT_DIV_CODE: MarketDivCode.KRX,
                    FID_BLNG_CLS_CODE: '0',
                    FID_TRGT_EXLS_CLS_CODE: '0000000000',
                    FID_TRGT_CLS_CODE: '000000000',
                });

                console.log(response);
            } catch (error) {
                console.log(error);
            }
        });

        it('getFluctuation test', async () => {
            try {
                const response = await rankClient.getFluctuation({
                    fid_cond_mrkt_div_code: MarketDivCode.KRX,
                    fid_prc_cls_code: '0',
                    fid_rank_sort_cls_code: '0',
                });

                console.log(response);
            } catch (error) {
                console.log(error);
            }
        });
    });
});
