import { Test } from '@nestjs/testing';
import { NaverApiClient, NaverApiModule } from '@modules/naver';
import { ConfigModule } from '@nestjs/config';
import configuration from '@app/configuration';

describe('Naver API Test', () => {
    let naverApiClient: NaverApiClient;
    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [configuration],
                }),
                NaverApiModule,
            ],
        }).compile();

        naverApiClient = app.get(NaverApiClient);
    });

    describe('검색 API', () => {
        it('검색이 정상적으로 이루어져야 한다.', async () => {
            try {
                const response = await naverApiClient.getNews({
                    query: '삼성전자',
                    start: 1,
                    display: 100,
                    sort: 'date',
                });

                console.log(response);

                expect(response.items).toBeDefined();
            } catch (error) {
                console.log(error.response.data);
            }
        });
    });
});
