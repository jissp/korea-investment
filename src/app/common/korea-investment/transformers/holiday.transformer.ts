import { Pipe } from '@common/types';
import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { YN } from '@app/common/types';
import { KoreaInvestmentCalendarDto } from '@app/modules/repositories/korea-investment-calendar';
import { DomesticHolidayInquiryOutput } from '@app/modules/crawlers/korea-investment-crawler/korea-investment-calender-crawler';

export class HolidayTransformer implements Pipe<
    DomesticHolidayInquiryOutput,
    KoreaInvestmentCalendarDto
> {
    transform(
        output: DomesticHolidayInquiryOutput,
    ): KoreaInvestmentCalendarDto {
        return {
            date: toDateByKoreaInvestmentYmd(output.bass_dt),
            dayCode: output.wday_dvsn_cd,
            isOpen: output.opnd_yn === 'Y' ? YN.Y : YN.N,
            isTrade: output.opnd_yn === 'Y' ? YN.Y : YN.N,
            isBusiness: output.opnd_yn === 'Y' ? YN.Y : YN.N,
        };
    }
}
