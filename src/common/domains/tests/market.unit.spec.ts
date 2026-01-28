import { getMarketDivCodeByDate } from '@common/domains';
import { MarketDivCode } from '@modules/korea-investment/common';

describe('stock 도메인 테스트', () => {
    describe('getCurrentMarketDivCode', () => {
        it('06시일 때 장 마감이어야 한다.', () => {
            const status = getMarketDivCodeByDate(
                new Date('2025-01-01 06:00:00'),
            );

            expect(status).toBeNull();
        });

        it('8시 30분 일 때 NXT여야 한다.', () => {
            const status = getMarketDivCodeByDate(
                new Date('2025-01-01 08:30:00'),
            );

            expect(status).toBe(MarketDivCode.NXT);
        });

        it('11시 00분 일 때 KRX여야 한다.', () => {
            const status = getMarketDivCodeByDate(
                new Date('2025-01-01 11:00:00'),
            );

            expect(status).toBe(MarketDivCode.KRX);
        });

        it('15시 25분 일 때 KRX여야 한다.', () => {
            const status = getMarketDivCodeByDate(
                new Date('2025-01-01 15:25:00'),
            );

            expect(status).toBe(MarketDivCode.KRX);
        });

        it('18시 20분 일 때 NXT여야 한다.', () => {
            const status = getMarketDivCodeByDate(
                new Date('2025-01-01 18:20:00'),
            );

            expect(status).toBe(MarketDivCode.NXT);
        });

        it('21시 50분 일 때 장 마감이어야 한다.', () => {
            const status = getMarketDivCodeByDate(
                new Date('2025-01-01 21:50:00'),
            );

            expect(status).toBeNull();
        });
    });
});
