import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { GeminiCliModel, GeminiCliService } from '@modules/gemini-cli';
import { DomesticStockInvestorTrendEstimateOutput2 } from '@modules/korea-investment/common';
import { formatTemplate } from '@app/common/domains';
import { TransformByInvestorHelper } from '@app/modules/analysis/ai-analyzer/common';
import { StockAnalyzerFlowType } from './stock-analyzer.types';
import { StockAnalysisData } from './stock-analyzer.adapter';

const PROMPT_TEMPLATE = `당신은 제공된 데이터를 바탕으로 시장의 이면을 읽어내는 전문 주식 분석가이자 퀀트 투자자입니다.

# 분석 지침

1. 제공 데이터
- 오늘(또는 최근 영업일) 외인 투자자 동향
{promptForEstimate}

- 일별 투자자 동향
{promptForInvestors}

- 관련 리포트
\`\`\`
{mergedResultPrompts}
\`\`\`

2. 투자자 동향과 관련 이슈들의 상관관계를 연결하세요.

3. 상관관계를 설명할 때 억지로 연결하지 말고, 상관관계가 있을 때만 설명하세요.

4. 제공된 데이터와 위에서 확인한 데이터를 조합하여 분석하세요.

5. 세력의 움직임(예: 설거지 설계, 매집 등)을 분석하세요.

5. 전망은 영업일을 기준으로 분석합니다.
- 영업일 장 오픈 시간 이전일 때: 오전장, 오후장 전망을 분석
- 영업일 장 오픈 시간일 때: 현재 상황, 오후장 전망을 분석
- 영업일 장 마감 시간 이후일 때: 다음장 오픈 시간을 기준으로 분석(다음날이 영업일인 경우 다음날을, 다음날이 공휴일/연휴일인 경우 공휴일/연휴일이 끝난 이후 영업일 기준 시간으로 분석)

6. 응답은 [응답 형식](#응답_형식)에 따라 반드시 코드 블록(\`\`\`)을 제외하고, 일반인이 알아들을 수 있는 용어로 핵심만 간결하게 개조식으로 응답하세요.

# 응답 형식

\`\`\`
# 종목 평가
## 평가
[종목의 현재 평가 설명]

# 종목 전망
[종목의 전망 설명]
[세력의 설계/설거지 등에 관한 설명]

## 선물 동향
[선물 동향 정보를 기반으로 주가 상승/하락을 예측하고 설명]

## 투자자별 동향
[투자자별 동향을 이슈와 설명]

## 공시 / 실적 발표 정보
[공시 정보와 실적 발표 예상일을 설명]
[배당주인 경우 배당락, 배당일, 배당주 정보를 아주 간략하게 설명]

# 매수/매도 전략
## [매수/매도/관망 여부]: [근거 설명]
[매수/매도 타이밍 전략 방법 설명]

## 모니터링 이슈
[모니터링 또는 이슈 트래킹이 필요한 경우 설명]

# 이슈
[시장/종목의 이슈를 개조식으로 나열하고, 어떠한 이슈인지 간략한 설명과 어떠한 영향을 끼치는지를 설명]
\`\`\`
`;

@Processor(StockAnalyzerFlowType.Request)
export class StockAnalyzerProcessor extends WorkerHost {
    private readonly logger = new Logger(StockAnalyzerProcessor.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly transformByInvestorHelper: TransformByInvestorHelper,
    ) {
        super();
    }

    async process(job: Job<StockAnalysisData>) {
        try {
            this.logger.log('processing');
            const { stockInvestors, stockInvestorByEstimates } = job.data;
            const results = await this.getChildrenValues(job);

            const mergedResultPrompts = results.join('\n\n');

            const promptForInvestors =
                this.transformByInvestorHelper.transformByInvestor(
                    stockInvestors,
                );
            const promptForEstimate = this.transformByEstimate(
                stockInvestorByEstimates,
            );

            const requestPrompt = formatTemplate(PROMPT_TEMPLATE, {
                promptForInvestors,
                promptForEstimate,
                mergedResultPrompts,
            });

            const result = await this.geminiCliService.requestSyncPrompt(
                requestPrompt,
                {
                    model: GeminiCliModel.Gemini3Pro,
                },
            );

            this.logger.log('processed');
            return result;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * @param job
     * @private
     */
    private async getChildrenValues(job: Job) {
        const childrenValues = await job.getChildrenValues<string>();

        return Object.values(childrenValues);
    }

    /**
     * 금일 외국인 투자자 동향 정보를 프롬프트로 변경합니다.
     * @param outputs
     */
    transformByEstimate(
        outputs: DomesticStockInvestorTrendEstimateOutput2[],
    ): string {
        return outputs
            .map((output) => this.transformByEstimateRow(output))
            .join('\n');
    }

    /**
     * 개별 금일 외국인 투자자 동향 정보를 프롬프트로 변경합니다.
     * @param output
     * @private
     */
    private transformByEstimateRow(
        output: DomesticStockInvestorTrendEstimateOutput2,
    ) {
        const time = this.transformByInvestorHelper.hourGbToTime(
            output.bsop_hour_gb,
        );
        const personQuantity = Number(output.frgn_fake_ntby_qty);
        const organizationQuantity = Number(output.orgn_fake_ntby_qty);

        return `- ${time}: 외국인 매수량: ${personQuantity}, 기관 매수량: ${organizationQuantity}`;
    }
}
