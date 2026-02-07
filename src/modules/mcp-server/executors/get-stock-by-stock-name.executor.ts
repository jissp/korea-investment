import { Injectable } from '@nestjs/common';
import { StockService } from '@app/modules/repositories/stock';
import { McpResource, McpTool } from '../decorators';
import { BaseExecutor } from '../base.executor';
import { JsonRpcRequest } from '../mcp-server.service';

export interface GetStockByStockNameExecutorParams {
    stockName: string;
}

@Injectable()
export class GetStockByStockNameExecutor implements BaseExecutor {
    constructor(private readonly stockService: StockService) {}

    @McpTool({
        name: 'get-stock-by-name',
        description: 'Get stock information by stock name',
        inputSchema: {
            type: 'object',
            properties: {
                stockName: {
                    type: 'string',
                    description: 'Stock Name (e.g., 삼성전자)',
                },
            },
            required: ['stockName'],
        },
    })
    @McpResource({
        uri: 'stock:///{stockName}',
        name: 'Stock Information',
        description: 'Get stock information resource',
        mimeType: 'application/json',
    })
    execute(request: JsonRpcRequest<GetStockByStockNameExecutorParams>) {
        const {
            arguments: { stockName },
        } = request.params;

        return this.stockService.getStockByStockName(stockName);
    }
}
