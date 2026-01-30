import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SlackModule, SlackService } from '@modules/slack';
import configuration from '@app/configuration';

describe('slack Test', () => {
    let slackService: SlackService;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [configuration],
                }),
                SlackModule,
            ],
        }).compile();

        slackService = app.get(SlackService);
    });

    describe('Test', () => {
        it('Test', async () => {
            const result = await slackService.send();

            expect(result).toBeDefined();
        });
    });
});
