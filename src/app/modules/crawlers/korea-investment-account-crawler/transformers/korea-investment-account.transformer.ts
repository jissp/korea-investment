import { Pipe } from '@common/types';
import { KoreaInvestmentAccountOutput2 } from '@app/modules/korea-investment-request-api';
import { AccountInfoDto } from '@app/modules/repositories/account';

export class KoreaInvestmentAccountTransformer implements Pipe<
    KoreaInvestmentAccountOutput2,
    AccountInfoDto
> {
    transform(value: KoreaInvestmentAccountOutput2): AccountInfoDto {
        return {
            pchsAmtSmtl: Number(value.pchs_amt_smtl),
            evluPflsAmtSmtl: Number(value.evlu_pfls_amt_smtl),
            totAsstAmt: Number(value.tot_asst_amt),
            totDnclAmt: Number(value.tot_dncl_amt),
            nassTotAmt: Number(value.nass_tot_amt),
            frcrEvluTota: Number(value.frcr_evlu_tota),
            ovrsStckEvluAmt1: Number(value.ovrs_stck_evlu_amt1),
        };
    }
}
