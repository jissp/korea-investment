import { JsonRpcRequest } from '@modules/mcp-server/mcp-server.service';

export interface BaseExecutor<T = unknown> {
    execute: (request: JsonRpcRequest) => Promise<T>;
}
