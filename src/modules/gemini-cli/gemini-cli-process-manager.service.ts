import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ChildProcess } from 'node:child_process';

@Injectable()
export class GeminiCliProcessManagerService implements OnModuleDestroy {
    private activeProcesses = new Set<ChildProcess>();

    private readonly logger = new Logger(GeminiCliProcessManagerService.name);

    /**
     * 모듈 소멸 시, 활성화된 Gemini CLI 프로세스를 정리합니다.
     */
    onModuleDestroy() {
        this.logger.log(
            `Cleaning up ${this.activeProcesses.size} active Gemini CLI processes`,
        );

        for (const process of this.activeProcesses) {
            if (!process.killed) {
                process.kill('SIGTERM');
            }
        }

        this.activeProcesses.clear();
    }

    /**
     * 생성된 Gemini CLI 프로세스를 등록합니다.
     * @param process
     */
    public addProcess(process: ChildProcess) {
        this.activeProcesses.add(process);
    }

    /**
     * 생성된 Gemini CLI 프로세스를 삭제합니다.
     * @param process
     */
    public deleteProcess(process: ChildProcess) {
        this.activeProcesses.delete(process);
    }
}
