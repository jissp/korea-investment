import { spawn } from 'node:child_process';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    GeminiCliOptions,
    GeminiCliProvider,
    GeminiCliResult,
} from './gemini-cli.types';
import { GeminiCliProcessManagerService } from './gemini-cli-process-manager.service';

@Injectable()
export class GeminiCliService {
    private readonly logger = new Logger(GeminiCliService.name);

    constructor(
        private readonly geminiCliProcessManagerService: GeminiCliProcessManagerService,
        @Inject(GeminiCliProvider.GeminiCliConfig)
        private readonly config: GeminiCliOptions,
    ) {}

    /**
     * Gemini CLI를 통해 prompt를 전달합니다.
     * @param prompt
     * @param options
     */
    public requestSyncPrompt(
        prompt: string,
        options?: GeminiCliOptions,
    ): Promise<GeminiCliResult> {
        return new Promise((resolve, reject) => {
            const model = options?.model ?? this.config.model;

            const cleanEnv = { ...process.env };
            delete cleanEnv.NODE_OPTIONS;

            const geminiProcess = spawn(
                'gemini',
                ['--model', model, '--output-format', 'json'],
                {
                    env: cleanEnv,
                },
            );

            geminiProcess.stdin.write(prompt);
            geminiProcess.stdin.end();

            this.geminiCliProcessManagerService.addProcess(geminiProcess);

            // --output-format=json 이라 무조건 1번의 data만 응답됨.
            let outputData: string = '';
            geminiProcess.stdout.on('data', (data) => {
                outputData += data.toString();
            });

            geminiProcess.on('error', (error) => {
                if (!geminiProcess.killed) {
                    geminiProcess.kill();
                }

                reject(error);
            });

            geminiProcess.on('close', () => {
                if (!outputData) {
                    return reject(
                        new Error('Gemini CLI process closed without output'),
                    );
                }

                try {
                    const dataObject = JSON.parse(outputData);

                    resolve(dataObject);

                    this.logger.log('Gemini CLI process closed');
                    this.geminiCliProcessManagerService.deleteProcess(
                        geminiProcess,
                    );
                } catch (error) {
                    this.logger.log(
                        'Gemini CLI process Error',
                        outputData,
                        error,
                    );

                    if (error instanceof Error) {
                        reject(error);
                    } else {
                        reject(new Error(error.mesage));
                    }
                }
            });
        });
    }
}
