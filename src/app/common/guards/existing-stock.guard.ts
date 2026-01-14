import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { StockService } from '@app/modules/repositories/stock';

@Injectable()
export class ExistingStockGuard implements CanActivate {
    constructor(private readonly stockService: StockService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const stockCode = request.params.stockCode;
        if (!stockCode) {
            return true;
        }

        const exists = await this.stockService.existsStock(stockCode);
        if (!exists) {
            throw new NotFoundException(`Stock not found: ${stockCode}`);
        }

        return true;
    }
}
