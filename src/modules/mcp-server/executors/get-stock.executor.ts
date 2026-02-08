import { Injectable } from '@nestjs/common';
import { StockService } from '@app/modules/repositories/stock';
import { McpResource, McpTool } from '../decorators';
import { BaseExecutor } from '../base.executor';
import { JsonRpcCallRequest } from '../mcp-server.types';

export interface GetStockExecutorParams {
    stockCode: string;
}

@Injectable()
export class GetStockExecutor implements BaseExecutor {
    constructor(private readonly stockService: StockService) {}

    @McpTool({
        name: 'get-stock',
        description: '종목 코드를 기반으로 종목의 정보를 조회합니다.',
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
        uri: 'stock:///code/{stockCode}',
        name: 'get-stock',
        description: '종목 코드를 기반으로 종목의 정보를 조회합니다.',
        mimeType: 'application/json',
    })
    execute(request: JsonRpcCallRequest<GetStockExecutorParams>) {
        const {
            arguments: { stockCode },
        } = request.params;

        return this.stockService.getStock(stockCode);
    }
}
