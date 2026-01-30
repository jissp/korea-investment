import { Inject, Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SlackProvider } from './slack.types';

@Injectable()
export class SlackService {
    constructor(
        @Inject(SlackProvider.SlackAppClient)
        private readonly client: WebClient,
        @Inject(SlackProvider.BotName)
        private readonly botName: string,
        @Inject(SlackProvider.ChannelId)
        private readonly channelId: string,
    ) {}

    public async send(text: string) {
        await this.client.chat.postMessage({
            username: this.botName,
            channel: this.channelId,
            text,
        });
    }
}
