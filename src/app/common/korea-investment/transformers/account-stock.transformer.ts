import { Pipe } from '@common/types';
import { isDelistedStockByName } from '@app/common/domains';
import { KoreaInvestmentAccountStockOutput } from '@modules/korea-investment/common';
import { AccountStockDto } from '@app/modules/repositories/account';

interface KoreaInvestmentAccountStockTransformerParams {
    accountId: string;
    output: KoreaInvestmentAccountStockOutput;
}

export class AccountStockTransformer implements Pipe<
    KoreaInvestmentAccountStockTransformerParams,
    AccountStockDto
> {
    transform({
        accountId,
        output,
    }: KoreaInvestmentAccountStockTransformerParams): AccountStockDto {
        return {
            accountId,
            stockName: output.prdt_name,
            stockCode: output.pdno,
            price: Number(output.prpr),
            quantity: Number(output.hldg_qty),
            pchsAmt: Number(output.pchs_amt),
            evluAmt: Number(output.evlu_amt),
            pchsAvgPric: Number(output.pchs_avg_pric),
            isClosed: isDelistedStockByName(output.prdt_name) ? 'Y' : 'N',
        };
    }
}
