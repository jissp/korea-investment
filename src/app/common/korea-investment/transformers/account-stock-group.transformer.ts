import { Pipe } from '@common/types';
import { KoreaInvestmentInterestGroupListOutput } from '@modules/korea-investment/common';
import { AccountStockGroupDto } from '@app/modules/repositories/account-stock-group';

export class AccountStockGroupTransformer implements Pipe<
    KoreaInvestmentInterestGroupListOutput,
    AccountStockGroupDto
> {
    transform({
        inter_grp_code,
        inter_grp_name,
    }: KoreaInvestmentInterestGroupListOutput): AccountStockGroupDto {
        return {
            code: inter_grp_code,
            name: inter_grp_name,
        };
    }
}
