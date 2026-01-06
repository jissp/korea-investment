/**
 * PromiseSettledResult 배열에서 성공한 Promise의 값만 추출합니다.
 * @param promiseSettledResults
 */
export function filterFulfilledPromiseValues<T = any>(
    promiseSettledResults: PromiseSettledResult<T>[],
): T[] {
    return promiseSettledResults
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
}

/**
 * PromiseSettledResult 배열에서 Rejected Promise만 추출합니다.
 * @param promiseSettledResults
 */
export function filterRejectedPromises<T = any>(
    promiseSettledResults: PromiseSettledResult<T>[],
): PromiseRejectedResult[] {
    return promiseSettledResults.filter(
        (result) => result.status === 'rejected',
    );
}
