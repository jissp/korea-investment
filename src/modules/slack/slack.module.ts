import { DynamicModule, Module, Provider } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import App from '@slack/bolt';
import { IConfiguration } from '@app/configuration';
import { BotName, SlackProvider } from './slack.types';
import { SlackService } from './slack.service';

type FactoryOptions = UseValueOption | UseFactoryOption;

type UseValueOption = {
    channelId: string;
};

type UseFactoryOption = Pick<FactoryProvider, 'inject' | 'useFactory'> & {
    imports: ModuleMetadata['imports'];
};

@Module({})
export class SlackModule {
    public static forRoot(): DynamicModule {
        return {
            global: true,
            module: SlackModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: SlackProvider.Config,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        return configService.get<IConfiguration['slack']>(
                            'slack',
                        );
                    },
                },
                {
                    provide: SlackProvider.SlackApp,
                    inject: [SlackProvider.Config],
                    useFactory: (config?: IConfiguration['slack']) => {
                        if (!config) {
                            throw new Error('Slack configuration is missing');
                        }

                        return new App({
                            signingSecret: config.signingSecret,
                            appToken: config.appToken,
                            token: config.token,
                            socketMode: true,
                        });
                    },
                },
                {
                    provide: SlackProvider.SlackAppClient,
                    inject: [SlackProvider.SlackApp],
                    useFactory: (slackApp: App) => {
                        return slackApp.client;
                    },
                },
            ],
            exports: [
                {
                    provide: SlackProvider.SlackApp,
                    inject: [SlackProvider.Config],
                    useFactory: (config?: IConfiguration['slack']) => {
                        if (!config) {
                            throw new Error('Slack configuration is missing');
                        }

                        return new App({
                            signingSecret: config.signingSecret,
                            appToken: config.appToken,
                            token: config.token,
                            socketMode: true,
                        });
                    },
                },
                {
                    provide: SlackProvider.SlackAppClient,
                    inject: [SlackProvider.SlackApp],
                    useFactory: (slackApp: App) => {
                        return slackApp.client;
                    },
                },
            ],
        };
    }

    public static forFeature(
        botName: BotName,
        options: FactoryOptions,
    ): DynamicModule {
        const imports: ModuleMetadata['imports'] = [];
        const providers: Provider[] = [];

        if (this.isFactoryOptions(options)) {
            if (options.imports?.length) {
                imports.push(...options.imports);
            }

            providers.push({
                provide: SlackProvider.ChannelId,
                inject: options.inject,
                useFactory: options.useFactory,
            });
        } else {
            providers.push({
                provide: SlackProvider.ChannelId,
                useValue: options.channelId,
            });
        }

        return {
            module: SlackModule,
            imports,
            providers: [
                ...providers,
                {
                    provide: SlackProvider.BotName,
                    useValue: botName,
                },
                SlackService,
            ],
            exports: [SlackService],
        };
    }

    private static isFactoryOptions(options: any): options is UseFactoryOption {
        return 'useFactory' in options;
    }
}
