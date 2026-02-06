import { Pipe } from '@common/types';
import { toDateByKoreaInvestmentYmd } from '@common/utils';
import { YN } from '@app/common/types';
import { DomesticHolidayInquiryOutput } from '@modules/korea-investment/common';
import { KoreaInvestmentCalendarDto } from '@app/modules/repositories/korea-investment-calendar';

interface TransformerArgs {
    output: DomesticHolidayInquiryOutput;
}

export class HolidayTransformer implements Pipe<
    TransformerArgs,
    KoreaInvestmentCalendarDto
> {
    transform({ output }: TransformerArgs): KoreaInvestmentCalendarDto {
        return {
            date: toDateByKoreaInvestmentYmd(output.bass_dt),
            dayCode: output.wday_dvsn_cd,
            isOpen: output.opnd_yn === 'Y' ? YN.Y : YN.N,
            isTrade: output.opnd_yn === 'Y' ? YN.Y : YN.N,
            isBusiness: output.opnd_yn === 'Y' ? YN.Y : YN.N,
        };
    }
}
