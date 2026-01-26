import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { GeminiCliModel, GeminiCliService } from '@modules/gemini-cli';
import { StockAnalyzerFlowType } from '../stock-analyzer.types';

@Processor(StockAnalyzerFlowType.RequestStockAnalysis)
export class RequestStockAnalysisProcessor extends WorkerHost {
    private readonly logger = new Logger(RequestStockAnalysisProcessor.name);

    constructor(private readonly geminiCliService: GeminiCliService) {
        super();
    }

    async process(job: Job) {
        try {
            this.logger.log('processing');
            const childrenValues = await job.getChildrenValues();
            const results = Object.values(childrenValues);

            const mergedResultPrompts = results.join('\n\n');
            const requestPrompt = this.getPrompt(mergedResultPrompts);

            const { response } = await this.geminiCliService.requestSyncPrompt(
                requestPrompt,
                {
                    model: GeminiCliModel.Gemini3Pro,
                },
            );

            this.logger.log('processed');
            return response;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public getPrompt(mergedResultPrompts: string) {
        return `
당신은 제공된 데이터를 바탕으로 시장의 이면을 읽어내는 전문 주식 분석가이자 퀀트 투자자입니다.

# 분석 지침
1. 반드시 현재 프로젝트 파일은 무시하고 당신이 가진 지식으로만 답변하세요.
2. 제공 데이터
${mergedResultPrompts}
3. 제공된 데이터를 분석하여 불필요한 내용은 배제하고 구체적으로 리포트를 작성하세요.
4. 전망은 영업일을 기준으로 분석합니다.
- 영업일 장 오픈 시간 이전일 때: 오전장, 오후장 전망을 분석
- 영업일 장 마감 시간 이후일 때: 다음장 오픈 시간을 기준으로 분석(다음날이 영업일인 경우 다음날을, 다음날이 공휴일/연휴일인 경우 공휴일/연휴일이 끝난 이후 영업일 기준 시간으로 분석)
5. 상관관계를 설명할 때 억지로 연결하지 말고, 상관관계가 있을 때만 설명하세요.
6. 응답은 [응답 형식](#응답_형식)에 따라 반드시 코드 블록(\`\`\`)을 제외하고 핵심만 간결하게 응답하세요.

# 응답 형식

\`\`\`
# 종목 평가
[종목의 현재 평가 설명]
[투자자별 동향을 구체적으로 설명]

## 매수/매도 전략
### [매수/매도/관망 여부]
[매수/매도/관망 여부의 근거를 설명]
### 매수/매도 전략 타이밍
[매수/매도 타이밍 전략 방법 설명]
### 모니터링 전략
[모니터링 또는 이슈 트래킹이 필요한 경우 설명]

# 전망
[전망을 개조식으로 설명]

# 이슈
[시장/종목의 이슈를 개조식으로 나열하고, 어떠한 이슈인지 간략한 설명과 어떠한 영향을 끼치는지를 설명]
\`\`\`
`;
    }
}
