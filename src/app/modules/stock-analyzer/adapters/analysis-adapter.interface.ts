import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';

export interface IAnalysisAdapter<TCollectedData> {
    /**
     * 분석에 필요한 데이터를 수집합니다.
     * @param target
     */
    collectData(target: string): Promise<TCollectedData>;

    /**
     * 작업의 Title을 변환합니다.
     * @param data
     */
    transformToTitle(data: TCollectedData): string;

    /**
     * 데이터를 프롬프트로 변환합니다.
     * @param data
     */
    transformToFlowChildJob(data: TCollectedData): FlowChildJob;
}
