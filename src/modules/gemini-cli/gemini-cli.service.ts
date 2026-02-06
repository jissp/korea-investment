import { ChildProcess, spawn } from 'node:child_process';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { normalizeError } from '@common/domains';
import { GeminiCliOptions, GeminiCliProvider } from './gemini-cli.types';
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
    public requestPrompt(
        prompt: string,
        options?: GeminiCliOptions,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const geminiProcess = this.openGeminiProcess(options);
                this.geminiCliProcessManagerService.addProcess(geminiProcess);

                this.setupProcessStreams(geminiProcess, resolve, reject);
                this.sendPromptToProcess(geminiProcess, prompt);
            } catch (error) {
                this.logger.error(error);

                reject(normalizeError(error));
            }
        });
    }

    /**
     * @private
     */
    private getCleanEnvironment(): NodeJS.ProcessEnv {
        const cleanEnv = { ...process.env };
        delete cleanEnv.NODE_OPTIONS;

        return cleanEnv;
    }

    /**
     * @private
     * @param options
     */
    private openGeminiProcess(options?: GeminiCliOptions): ChildProcess {
        const model = options?.model ?? this.config.model;

        return spawn('gemini', ['--model', model], {
            env: this.getCleanEnvironment(),
            shell: true,
        });
    }

    /**
     * @param process
     * @param prompt
     * @private
     */
    private sendPromptToProcess(process: ChildProcess, prompt: string): void {
        process.stdin?.write(prompt);
        process.stdin?.end();
    }

    /**
     * @param geminiProcess
     * @param resolve
     * @param reject
     * @private
     */
    private setupProcessStreams(
        geminiProcess: ChildProcess,
        resolve: (value: string) => void,
        reject: (reason?: any) => void,
    ): void {
        let outputData: string = '';

        geminiProcess.stdout?.on('data', (data) => {
            outputData += data.toString();
        });

        geminiProcess.on('error', (error) => {
            this.terminateProcess(geminiProcess);

            reject(error);
        });

        geminiProcess.on('close', () => {
            this.handleProcessClose(geminiProcess, outputData, resolve);
        });
    }

    /**
     * @param geminiProcess
     * @param outputData
     * @param resolve
     * @private
     */
    private handleProcessClose(
        geminiProcess: ChildProcess,
        outputData: string,
        resolve: (value: string) => void,
    ): void {
        resolve(outputData);

        this.cleanupProcess(geminiProcess);
        this.logger.log('Gemini CLI process closed');
    }

    /**
     * @param geminiProcess
     * @private
     */
    private cleanupProcess(geminiProcess: ChildProcess): void {
        this.geminiCliProcessManagerService.deleteProcess(geminiProcess);
    }

    /**
     * @param geminiProcess
     * @private
     */
    private terminateProcess(geminiProcess: ChildProcess): void {
        if (!geminiProcess.killed) {
            geminiProcess.kill();
        }
    }
}
