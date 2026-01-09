import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAnalysisReport } from './ai-analysis-report.entity';
import { AiAnalysisReportService } from './ai-analysis-report.service';

const entities = [AiAnalysisReport];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [AiAnalysisReportService],
    exports: [TypeOrmModule.forFeature(entities), AiAnalysisReportService],
})
export class AiAnalysisReportModule {}
