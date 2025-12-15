import { Nullable } from '@common/types';
import { MarketDivCode } from '@modules/korea-investment/common';

// KRX 정규장: 09:00 ~ 15:30
const krxStart = 9 * 60; // 540
const krxEnd = 15 * 60 + 30; // 930

// NXT 시간외 단일가: 15:30 ~ 16:00
const nxtStart = 8 * 60; // 480
const nxtEnd = 20 * 60; // 960

/**
 * 현재 시간이 장 오픈 시간(KRX/NXT) 또는 종료 시간인지 확인합니다.
 * @returns 'KRX' | 'NXT' | null
 * - KRX: 정규장 (09:00 ~ 15:30)
 * - NXT: 시간외 단일가 (15:30 ~ 16:00)
 * - null: 장 종료
 */
export function getCurrentMarketDivCode(date?: Date): Nullable<MarketDivCode> {
    const targetDate = date ? new Date(date.getTime()) : new Date();
    const hours = targetDate.getHours();
    const minutes = targetDate.getMinutes();

    const currentTime = hours * 60 + minutes;

    const isKrx = currentTime >= krxStart && currentTime < krxEnd;
    if (isKrx) {
        return MarketDivCode.KRX;
    }

    const isStartNxt = currentTime >= nxtStart && currentTime < krxStart;
    const isEndNxt = currentTime >= krxEnd && currentTime < nxtEnd;
    if (isStartNxt || isEndNxt) {
        return MarketDivCode.NXT;
    }

    return null;
}
