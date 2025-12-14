import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '@app/configuration';
import { StockPlusClient, StockPlusModule } from '@modules/stock-plus';

describe('증권플러스 Client 테스트', () => {
    let client: StockPlusClient;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [configuration],
                }),
                StockPlusModule,
            ],
        }).compile();

        client = app.get(StockPlusClient);
    });

    it('뉴스 조회 API 호출', async () => {
        const response = await client.getLatestNews();

        expect(response).toBeDefined();
        expect(response.data.breakingNews).toBeDefined();
    });
});
