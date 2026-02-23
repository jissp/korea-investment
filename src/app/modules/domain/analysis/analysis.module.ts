import { Module } from '@nestjs/common';
import { AiAnalyzerModule } from '@app/modules/analysis/ai-analyzer';
import { RepositoryModule } from '@app/modules/repositories/repository.module';
import {
    GetAnalysisReportsUseCase,
    GetAnalysisReportUseCase,
    RequestAnalysisUseCase,
} from './use-cases';
import { AnalysisController } from './analysis.controller';

@Module({
    imports: [AiAnalyzerModule, RepositoryModule],
    controllers: [AnalysisController],
    providers: [
        RequestAnalysisUseCase,
        GetAnalysisReportUseCase,
        GetAnalysisReportsUseCase,
    ],
    exports: [],
})
export class AnalysisModule {}
