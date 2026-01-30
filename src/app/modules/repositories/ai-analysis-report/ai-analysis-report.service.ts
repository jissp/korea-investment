import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AiAnalysisReportDto, ReportType } from './ai-analysis-report.types';
import { AiAnalysisReport } from './ai-analysis-report.entity';

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
     * AI 분석 리포트를 삭제합니다.
     * @param reportType
     * @param reportTarget
     */
    public async deleteReport(reportType: ReportType, reportTarget: string) {
        return this.aiAnalysisReportRepository.delete({
            reportType,
            reportTarget,
        });
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
        limit = 10,
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
