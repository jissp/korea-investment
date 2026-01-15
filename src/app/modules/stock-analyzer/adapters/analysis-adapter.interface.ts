import { AnalysisCompletedEventBody } from '../stock-analyzer.types';

export interface IAnalysisAdapter<TCollectedData> {
    /**
     * 분석에 필요한 데이터를 수집합니다.
     * @param target
     */
    collectData(target: string): Promise<TCollectedData>;

    /**
     * 데이터를 프롬프트로 변환합니다.
     * @param data
     */
    transformToPrompt(data: TCollectedData): string;

    /**
     * 분석 완료 이벤트 객체를 생성합니다.
     * @param target
     * @param data
     */
    getEventConfig(
        target: string,
        data: TCollectedData,
    ): AnalysisCompletedEventBody;
}
