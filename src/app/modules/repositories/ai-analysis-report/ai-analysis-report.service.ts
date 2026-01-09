import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AiAnalysisReport } from './ai-analysis-report.entity';
import {
    AiAnalysisReportDto,
    ReportType,
} from '@app/modules/repositories/ai-analysis-report/ai-analysis-report.types';

@Injectable()
export class AiAnalysisReportService {
    constructor(
        @InjectRepository(AiAnalysisReport)
        private readonly aiAnalysisReportRepository: Repository<AiAnalysisReport>,
    ) {}

    /**
     * AI 분석 리포트를 추가합니다.
     * @param aiAnalysisReport
     */
    public async addReport(aiAnalysisReport: AiAnalysisReportDto) {
        return this.aiAnalysisReportRepository.insert(aiAnalysisReport);
    }

    /**
     * AI 분석 리포트를 조회합니다.
     * @param reportType
     * @param reportTarget
     */
    public async getReport({
        reportType,
        reportTarget,
    }: {
        reportType: ReportType;
        reportTarget: string;
    }) {
        return this.aiAnalysisReportRepository.findOne({
            where: {
                reportType,
                reportTarget,
            },
            order: {
                id: 'DESC',
            },
        });
    }

    /**
     * AI 분석 리포트 목록을 조회합니다.
     * @param reportType
     * @param limit
     */
    public async getReportsByType({
        reportType,
        limit = 100,
    }: {
        reportType: ReportType;
        limit?: number;
    }) {
        return this.aiAnalysisReportRepository.find({
            where: {
                reportType,
            },
            order: {
                id: 'DESC',
            },
            take: limit,
        });
    }
}
