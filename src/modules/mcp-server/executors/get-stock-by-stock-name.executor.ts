import { Injectable } from '@nestjs/common';
import { StockService } from '@app/modules/repositories/stock';
import { McpResource, McpTool } from '../decorators';
import { BaseExecutor } from '../base.executor';
import { JsonRpcCallRequest } from '../mcp-server.types';

export interface GetStockByStockNameExecutorParams {
    stockName: string;
}

@Injectable()
export class GetStockByStockNameExecutor implements BaseExecutor {
    constructor(private readonly stockService: StockService) {}

    @McpTool({
        name: 'get-stock-by-name',
        description: '종목 이름를 기반으로 종목의 정보를 조회합니다.',
        inputSchema: {
            type: 'object',
            properties: {
                stockName: {
                    type: 'string',
                    description: '종목이름 (e.g., 삼성전자)',
                },
            },
            required: ['stockName'],
        },
    })
    @McpResource({
        uri: 'stock:///name/{stockName}',
        name: 'get-stock-by-name',
        description: '종목 이름를 기반으로 종목의 정보를 조회합니다.',
        mimeType: 'application/json',
    })
    execute(request: JsonRpcCallRequest<GetStockByStockNameExecutorParams>) {
        const {
            arguments: { stockName },
        } = request.params;

        return this.stockService.getStockByStockName(stockName);
    }
}
