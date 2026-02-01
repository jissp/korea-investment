import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { GeminiCliModel, GeminiCliService } from '@modules/gemini-cli';
import { MarketAnalyzerFlowType } from './market-analyzer.types';

@Processor(MarketAnalyzerFlowType.Request)
export class MarketAnalyzerProcessor extends WorkerHost {
    private readonly logger = new Logger(MarketAnalyzerProcessor.name);

    constructor(private readonly geminiCliService: GeminiCliService) {
        super();
    }

    async process(job: Job) {
        try {
            this.logger.debug('processing');
            const childrenValues = await job.getChildrenValues<string>();
            const results = Object.values(childrenValues);

            const mergedResultPrompts = results.join('\n\n');

            const requestPrompt = this.getPrompt(mergedResultPrompts);

            const { response } = await this.geminiCliService.requestSyncPrompt(
                requestPrompt,
                {
                    model: GeminiCliModel.Gemini3Pro,
                },
            );

            this.logger.debug('processed');
            return response;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public getPrompt(mergedResultPrompts: string) {
        const currentDate = new Date();

        return `
당신은 제공된 데이터를 바탕으로 시장의 이면을 읽어내는 전문 주식 분석가이자 퀀트 투자자입니다.

현재 기준(${currentDate.toISOString()}) 최신 데이터를 기반으로 분석 지침에 따라 분석하세요.

# 분석 지침

1. 제공 데이터

${mergedResultPrompts}

2. 시장 이면 읽기 (Core Analysis): 제공된 데이터를 기반으로 숨겨진 의도나 경제적 파급효과를 퀀트적 시각에서 분석하세요. 
예: 관세 위협이 실제 시행 가능성인지, 협상용 카드인지에 따른 시장 경로 차이

3. 관련 종목들의 실적 발표일(예정일 포함)을 확인하세요.

4. 위에서 확인한 데이터들을 종합하여 분석하세요.

5. 상관관계를 설명할 때 억지로 연결하지 말고, 상관관계가 있을 때만 설명하세요.

6. 전망은 영업일을 기준으로 분석합니다.
- 영업일 장 오픈 시간 이전일 때: 오늘 오전장, 오후장 전망을 분석
- 영업일 장 오픈 시간인데 오전일 경우: 오후장 전망을 분석
- 영업일 장 오픈 시간인데 오후일 경우: 오후장 전망과 다음날 오전장 분석
- 영업일 장 마감 시간 이후일 때: 다음 영업일 오전장을 기준으로 분석(다음날이 영업일인 경우 다음날을, 다음날이 공휴일/연휴일인 경우 공휴일/연휴일이 끝난 이후 영업일 기준 시간으로 분석)

7. 응답은 [응답 형식](#응답_형식)에 따라 반드시 코드 블록(\`\`\`)을 제외하고, 일반인이 알아들을 수 있는 용어로 핵심만 간결하게 개조식으로 응답하세요.

# 응답 형식

\`\`\`
# 시장 정보
## 흐름
[시장의 흐름을 설명]

## 시장 전망
[시장의 전망 구체적으로 설명]

## 모니터링 전략
[모니터링 또는 이슈 트래킹이 필요한 경우 설명]

# 관련 종목
[제공 데이터에 존재하는 종목들의 공시 정보와, 앞으로 있을 실적 발표 정보를 나열]

# 추천 테마
[추천하는 테마, 섹터, 매크로 민감주, 테마주 등을 나열하고 명확한 근거를 제시]
[다다음 시기를 예측하여 소외된 테마들 중 추천 테마 몇개를 나열하고 명확한 근거를 제시]

# 이슈
[시장/종목의 이슈를 나열하고, 어떠한 이슈인지 간략한 설명과 근거를 명확하게 제시]
\`\`\`
`;
    }
}
