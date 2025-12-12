import { DynamicModule, Logger, Module } from '@nestjs/common';

@Module({})
export class LoggerModule {
    public static forRoot(): DynamicModule {
        return {
            module: LoggerModule,
            global: true,
            providers: [
                {
                    provide: Logger,
                    useValue: new Logger(),
                },
            ],
            exports: [Logger],
        };
    }
}
