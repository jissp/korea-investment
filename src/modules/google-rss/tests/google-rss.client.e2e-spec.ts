import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '@app/configuration';
import { GoogleRssModule, GoogleRssService } from '@modules/google-rss';

describe('GoogleRss', () => {
    let service: GoogleRssService;

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [configuration],
                }),
                GoogleRssModule,
            ],
        }).compile();

        service = app.get<GoogleRssService>(GoogleRssService);
    });

    describe('비즈니스 카테고리 뉴스 조회', () => {
        it('should call axios.get with the provided URL', async () => {
            const items = await service.getBusinessNews();

            expect(items).toBeDefined();
            expect(items[0].title).toBeDefined();
        });
    });
});
