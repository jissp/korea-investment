/**
 * 종목이 상장 폐지된 종목인지 확인합니다. (이름에 * 가 붙어있으면 사장폐지 됐다고 봄)
 * @param name
 */
export function isDelistedStockByName(name: string) {
    return name.includes('*');
}
