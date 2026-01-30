import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import App from '@slack/bolt';
import { SlackProvider } from './slack.types';

@Injectable()
export class SlackWebSocket implements OnModuleInit {
    constructor(@Inject(SlackProvider.SlackApp) private readonly app: App) {}

    async onModuleInit() {
        await this.app.start();
    }
}
