import { ChildProcess, spawn } from 'node:child_process';
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
            try {
                const model = options?.model ?? this.config.model;
                const geminiProcess = this.spawnGeminiProcess(model);

                this.geminiCliProcessManagerService.addProcess(geminiProcess);
                this.setupProcessStreams(geminiProcess, resolve, reject);
                this.sendPromptToProcess(geminiProcess, prompt);
            } catch (error) {
                this.logger.error(error);

                reject(
                    error instanceof Error ? error : new Error('Unknown error'),
                );
            }
        });
    }

    private getCleanEnvironment(): NodeJS.ProcessEnv {
        const cleanEnv = { ...process.env };
        delete cleanEnv.NODE_OPTIONS;
        return cleanEnv;
    }

    private spawnGeminiProcess(model: string): ChildProcess {
        return spawn('gemini', ['--model', model, '--output-format', 'json'], {
            env: this.getCleanEnvironment(),
            shell: true,
        });
    }

    private sendPromptToProcess(process: ChildProcess, prompt: string): void {
        process.stdin?.write(prompt);
        process.stdin?.end();
    }

    private setupProcessStreams(
        geminiProcess: ChildProcess,
        resolve: (value: GeminiCliResult) => void,
        reject: (reason?: any) => void,
    ): void {
        let outputData: string = '';

        geminiProcess.stdout?.on('data', (data) => {
            outputData += data.toString();
        });

        geminiProcess.stderr?.on('data', (data) => {});

        geminiProcess.on('error', (error) => {
            if (!geminiProcess.killed) {
                geminiProcess.kill();
            }

            reject(error);
        });

        geminiProcess.on('close', () => {
            this.handleProcessClose(geminiProcess, outputData, resolve, reject);
        });
    }

    private handleProcessClose(
        geminiProcess: ChildProcess,
        outputData: string,
        resolve: (value: GeminiCliResult) => void,
        reject: (reason?: any) => void,
    ): void {
        if (!outputData) {
            return reject(
                new Error('Gemini CLI process closed without output'),
            );
        }

        try {
            const dataObject = JSON.parse(outputData);
            resolve(dataObject);
            this.logger.log('Gemini CLI process closed');
            this.geminiCliProcessManagerService.deleteProcess(geminiProcess);
        } catch (error) {
            this.logger.error('Gemini CLI process Error', outputData, error);
            this.cleanupProcess(geminiProcess);

            if (error instanceof Error) {
                reject(error);
            } else {
                reject(new Error('Failed to parse Gemini CLI response'));
            }
        }
    }

    private cleanupProcess(geminiProcess: ChildProcess): void {
        this.geminiCliProcessManagerService.deleteProcess(geminiProcess);
    }
}
