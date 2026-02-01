import { BadRequestException, Injectable } from '@nestjs/common';
import { ThemeService } from '@app/modules/repositories/theme';
import { ReportType } from '@app/modules/repositories/ai-analysis-report';
import {
    ExhaustionTraceAnalyzerAdapter,
    ExhaustionTraceAnalyzerByThemeAdapter,
} from './adapters';
import { BaseExhaustionTraceAnalyzerAdapter } from './base-exhaustion-trace-analyzer.adapter';

@Injectable()
export class ExhaustionTraceAnalyzerFactory {
    constructor(
        private readonly themeService: ThemeService,
        private readonly exhaustionTraceAnalyzerAdapter: ExhaustionTraceAnalyzerAdapter,
        private readonly exhaustionTraceAnalyzerByThemeAdapter: ExhaustionTraceAnalyzerByThemeAdapter,
    ) {}

    public async create(
        reportTarget: string,
    ): Promise<BaseExhaustionTraceAnalyzerAdapter> {
        if (reportTarget === ReportType.ExhaustionTrace.toString()) {
            return this.exhaustionTraceAnalyzerAdapter;
        }

        const isExistsTheme =
            await this.themeService.existsThemeByCode(reportTarget);
        if (isExistsTheme) {
            return this.exhaustionTraceAnalyzerByThemeAdapter;
        }

        throw new BadRequestException('Invalid report target');
    }
}
