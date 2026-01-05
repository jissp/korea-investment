import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    CallbackEvent,
    GeminiCliOptions,
    GeminiCliProvider,
    GeminiCliResponse,
    RequestCallbackEvent,
} from './gemini-cli.types';
import { GeminiCliProcessManagerService } from './gemini-cli-process-manager.service';

@Injectable()
export class GeminiCliService {
    private readonly logger = new Logger(GeminiCliService.name);

    constructor(
        private readonly geminiCliProcessManagerService: GeminiCliProcessManagerService,
        private readonly eventEmitter: EventEmitter2,
        @Inject(GeminiCliProvider.GeminiCliConfig)
        private readonly config: GeminiCliOptions,
    ) {}

    /**
     * Gemini CLI를 통해 prompt를 전달합니다.
     * @param prompt
     * @param callbackEvent
     */
    public requestPrompt<T = any>({
        prompt,
        callbackEvent,
    }: {
        prompt: string;
        callbackEvent: RequestCallbackEvent<T>;
    }) {
        const geminiProcess = spawn('gemini', [
            '--model',
            this.config.model,
            '--prompt',
            prompt,
            '--output-format',
            'json',
        ]);
        this.geminiCliProcessManagerService.addProcess(geminiProcess);

        this.bindProcessEvents(geminiProcess, callbackEvent);
    }

    /**
     * Gemini CLI 프로세스의 이벤트를 처리합니다.
     * @param geminiProcess
     * @param requestCallbackEvent
     * @private
     */
    private bindProcessEvents<T = any>(
        geminiProcess: ChildProcessWithoutNullStreams,
        requestCallbackEvent: RequestCallbackEvent<T>,
    ) {
        // stdout 데이터를 버퍼에 누적
        geminiProcess.stdout.on('data', (data) => {
            const eventMessage = {
                eventData: requestCallbackEvent.eventData,
                prompt: JSON.parse(data.toString()) as GeminiCliResponse,
            } as CallbackEvent<T>;

            // 이벤트 발행
            this.eventEmitter.emit(
                requestCallbackEvent.eventName,
                eventMessage,
            );
        });

        geminiProcess.stderr.on('error', (error) => {
            this.logger.error(`Gemini CLI error: ${error.message}`);

            this.geminiCliProcessManagerService.deleteProcess(geminiProcess);
        });

        geminiProcess.on('close', () => {
            this.geminiCliProcessManagerService.deleteProcess(geminiProcess);
        });
    }
}
