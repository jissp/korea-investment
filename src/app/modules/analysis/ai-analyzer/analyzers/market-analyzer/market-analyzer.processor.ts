import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { GeminiCliModel, GeminiCliService } from '@modules/gemini-cli';
import { formatTemplate } from '@app/common/domains';
import { MarketAnalyzerFlowType } from './market-analyzer.types';

const PROMPT_TEMPLATE = `당신은 제공된 데이터를 바탕으로 시장의 이면을 읽어내는 전문 주식 분석가이자 퀀트 투자자입니다.

현재 기준({currentDate}) 최신 데이터를 기반으로 분석 지침에 따라 분석하세요.

# 분석 지침

1. 제공 데이터

{mergedResultPrompts}

2. 시장 이면 읽기 (Core Analysis): 제공된 데이터를 기반으로 숨겨진 의도나 경제적 파급효과를 퀀트적 시각에서 분석하세요.
예: 관세 위협이 실제 시행 가능성인지, 협상용 카드인지에 따른 시장 경로 차이

3. 위에서 확인한 데이터들을 종합하여 분석하세요.

4. 상관관계를 설명할 때 억지로 연결하지 말고, 상관관계가 있을 때만 설명하세요.

5. 전망은 영업일을 기준으로 분석합니다.
- 영업일 장 오픈 시간 이전일 때: 오늘 오전장, 오후장 전망을 분석
- 영업일 장 오픈 시간인데 오전일 경우: 오후장 전망을 분석
- 영업일 장 오픈 시간인데 오후일 경우: 오후장 전망과 다음날 오전장 분석
- 영업일 장 마감 시간 이후일 때: 다음 영업일 오전장을 기준으로 분석(다음날이 영업일인 경우 다음날을, 다음날이 공휴일/연휴일인 경우 공휴일/연휴일이 끝난 이후 영업일 기준 시간으로 분석)

6. 응답은 [응답 형식](#응답_형식)에 따라 반드시 코드 블록(\`\`\`)을 제외하고, 일반인이 알아들을 수 있는 용어로 핵심만 간결하게 "개조식"으로 응답하세요.

# 응답 형식

\`\`\`
# 거시경제 지표
[비트코인, 금 현물, 달러 인덱스, 엔캐리, 원화(환율) 상황 설명]

# 시장

## 시장 상황
[시장의 상황과 흐름 설명]

## 시장 전망
[시장의 전망 구체적으로 설명]

# 핵심 이슈
[거시경제/시장 이슈들을 최대한 나열하고, 어떠한 이슈인지 간략한 설명과 근거를 명확하게 제시]

# 모니터링 전략
[모니터링 또는 이슈 트래킹이 필요한 경우 설명]
\`\`\`
`;

@Processor(MarketAnalyzerFlowType.Request)
export class MarketAnalyzerProcessor extends WorkerHost {
    private readonly logger = new Logger(MarketAnalyzerProcessor.name);

    constructor(private readonly geminiCliService: GeminiCliService) {
        super();
    }

    async process(job: Job) {
        this.logger.debug('processing');

        try {
            const results = await this.getChildrenValues(job);
            const requestPrompt = this.buildPrompt(results);

            return await this.geminiCliService.requestSyncPrompt(
                requestPrompt,
                {
                    model: GeminiCliModel.Gemini3Pro,
                },
            );
        } catch (error) {
            this.logger.error(error);
            throw error;
        } finally {
            this.logger.debug('processed');
        }
    }

    private async getChildrenValues(job: Job) {
        const childrenValues = await job.getChildrenValues<string>();

        return Object.values(childrenValues);
    }

    /**
     * @param mergedResultPrompts
     */
    public buildPrompt(mergedResultPrompts: string[]) {
        const currentDate = new Date();

        return formatTemplate(PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            mergedResultPrompts: mergedResultPrompts.join('\n\n'),
        });
    }
}
