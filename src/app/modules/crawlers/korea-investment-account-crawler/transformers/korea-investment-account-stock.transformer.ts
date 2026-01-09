import { Pipe } from '@common/types';
import { isDelistedStockByName } from '@app/common';
import { KoreaInvestmentAccountStockOutput } from '@app/modules/korea-investment-request-api';
import { AccountStockDto } from '@app/modules/repositories/account';

export class KoreaInvestmentAccountStockTransformer implements Pipe<
    {
        accountId: string;
        output: KoreaInvestmentAccountStockOutput;
    },
    AccountStockDto
> {
    transform({
        accountId,
        output,
    }: {
        accountId: string;
        output: KoreaInvestmentAccountStockOutput;
    }): AccountStockDto {
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
