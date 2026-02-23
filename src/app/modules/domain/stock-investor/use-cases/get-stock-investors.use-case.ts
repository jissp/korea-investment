import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { StockInvestor } from '@app/modules/repositories/stock-investor';
import { StockInvestorService } from '@app/modules/app-services/stock-investor';
import { GetStockInvestorsResponse } from '../dto';

interface GetStockInvestorsArgs {
    stockCode: string;
    limit?: number;
}

@Injectable()
export class GetStockInvestorsUseCase implements BaseUseCase<
    GetStockInvestorsArgs,
    GetStockInvestorsResponse
> {
    constructor(private readonly stockInvestorService: StockInvestorService) {}

    async execute(args: GetStockInvestorsArgs): Promise<GetStockInvestorsResponse> {
        const data = await this.stockInvestorService.getDailyInvestors(
            args.stockCode,
            args.limit,
        );
        return { data };
    }
}
