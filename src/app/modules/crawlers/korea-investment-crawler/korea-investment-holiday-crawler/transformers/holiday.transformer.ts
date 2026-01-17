import { Pipe } from '@common/types';
import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { YN } from '@app/common/types';
import { KoreaInvestmentHolidayDto } from '@app/modules/repositories/korea-investment-holiday';
import { DomesticHolidayInquiryOutput } from '../korea-investment-holiday-crawler.interface';

export class HolidayTransformer implements Pipe<
    DomesticHolidayInquiryOutput,
    KoreaInvestmentHolidayDto
> {
    transform(output: DomesticHolidayInquiryOutput): KoreaInvestmentHolidayDto {
        return {
            date: toDateByKoreaInvestmentYmd(output.bass_dt),
            dayCode: output.wday_dvsn_cd,
            isOpen: output.opnd_yn === 'Y' ? YN.Y : YN.N,
            isTrade: output.opnd_yn === 'Y' ? YN.Y : YN.N,
            isBusiness: output.opnd_yn === 'Y' ? YN.Y : YN.N,
        };
    }
}
