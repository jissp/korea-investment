import { Pipe } from '@common/types';
import { KoreaInvestmentInterestGroupListOutput } from '@modules/korea-investment/common';
import { AccountStockGroupDto } from '@app/modules/repositories/account-stock-group';

interface TransformerArgs {
    output: KoreaInvestmentInterestGroupListOutput;
}

export class AccountStockGroupTransformer implements Pipe<
    TransformerArgs,
    AccountStockGroupDto
> {
    transform({ output }: TransformerArgs): AccountStockGroupDto {
        return {
            code: output.inter_grp_code,
            name: output.inter_grp_name,
        };
    }
}
