import { Injectable } from '@nestjs/common';
import { StockService } from '@app/modules/repositories/stock';
import { McpResource, McpTool } from '../decorators';
import { BaseExecutor } from '../base.executor';
import { JsonRpcRequest } from '../mcp-server.service';

export interface GetStockExecutorParams {
    stockCode: string;
}

@Injectable()
export class GetStockExecutor implements BaseExecutor {
    constructor(private readonly stockService: StockService) {}

    @McpTool({
        name: 'get-stock',
        description: 'Get stock information by stock code',
        inputSchema: {
            type: 'object',
            properties: {
                stockCode: {
                    type: 'string',
                    description: 'Stock code (e.g., 005930)',
                },
            },
            required: ['stockCode'],
        },
    })
    @McpResource({
        uri: 'stock:///{stockCode}',
        name: 'Stock Information',
        description: 'Get stock information resource',
        mimeType: 'application/json',
    })
    execute(request: JsonRpcRequest<GetStockExecutorParams>) {
        const {
            arguments: { stockCode },
        } = request.params;

        return this.stockService.getStock(stockCode);
    }
}
