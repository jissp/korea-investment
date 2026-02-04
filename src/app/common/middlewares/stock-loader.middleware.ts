import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { StockService } from '@app/modules/repositories/stock';

@Injectable()
export class StockLoaderMiddleware implements NestMiddleware {
    constructor(private readonly stockService: StockService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const stockCode = req.params.stockCode;
        if (!stockCode) {
            return next();
        }

        const stock = await this.stockService.getStock(stockCode);
        if (stock) {
            req['stock'] = stock;
        }

        next();
    }
}
