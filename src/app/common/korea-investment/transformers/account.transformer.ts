import { Pipe } from '@common/types';
import { KoreaInvestmentAccountOutput2 } from '@modules/korea-investment/common';
import { AccountInfoDto } from '@app/modules/repositories/account';

interface TransformerArgs {
    output: KoreaInvestmentAccountOutput2;
}

export class AccountTransformer implements Pipe<
    TransformerArgs,
    AccountInfoDto
> {
    transform({ output }: TransformerArgs): AccountInfoDto {
        return {
            pchsAmtSmtl: Number(output.pchs_amt_smtl),
            evluPflsAmtSmtl: Number(output.evlu_pfls_amt_smtl),
            totAsstAmt: Number(output.tot_asst_amt),
            totDnclAmt: Number(output.tot_dncl_amt),
            nassTotAmt: Number(output.nass_tot_amt),
            frcrEvluTota: Number(output.frcr_evlu_tota),
            ovrsStckEvluAmt1: Number(output.ovrs_stck_evlu_amt1),
        };
    }
}
