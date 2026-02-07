import { Injectable } from '@nestjs/common';
import { McpMetadataRegistryService } from './mcp-metadata-registry.service';

export interface JsonRpcRequest<T = unknown> {
    jsonrpc: '2.0';
    id?: number | string;
    method: string;
    params: {
        name: string;
        arguments: T;
    };
}

@Injectable()
export class McpServerService {
    constructor(private readonly registry: McpMetadataRegistryService) {}

    public async handleMessage(message: JsonRpcRequest): Promise<any> {
        const { method, id } = message;

        try {
            const suppliedMethods = [
                'initialize',
                'tools/list',
                'tools/call',
                'resources/list',
            ];

            if (!suppliedMethods.includes(method)) {
                return null;
            }

            if (method === 'initialize') {
                return this.initialize(message);
            }

            if (method === 'tools/list') {
                return this.toolsList(message);
            }

            if (method === 'tools/call') {
                return this.toolCall(message);
            }

            if (method === 'resources/list') {
                return this.resourceList(message);
            }
        } catch (error) {
            return {
                jsonrpc: '2.0',
                id,
                error: {
                    code: -32603,
                    message: error.message,
                },
            };
        }
    }

    private initialize({ id }: JsonRpcRequest) {
        const sessionId = crypto.randomUUID();

        return {
            sessionId,
            result: {
                jsonrpc: '2.0',
                id,
                result: {
                    protocolVersion: '2024-11-05',
                    capabilities: {
                        // tools: { listChanged: true },
                        resources: { subscribe: true, listChanged: true },
                    },
                    serverInfo: {
                        name: 'nestjs-mcp-server',
                        version: '1.0.0',
                    },
                },
            },
        };
    }

    private toolsList({ id }: JsonRpcRequest) {
        return {
            result: {
                jsonrpc: '2.0',
                id,
                result: {
                    tools: this.registry.getTools().map((t) => ({
                        name: t.name,
                        description: t.description,
                        inputSchema: t.inputSchema || { type: 'object' },
                    })),
                },
            },
        };
    }

    private async toolCall(message: JsonRpcRequest) {
        const { id, method, params } = message;
        const executor = this.registry.getToolExecutor(params.name);
        if (!executor) {
            throw new Error(`Tool not found: ${method}`);
        }

        // Executor의 execute 메서드 호출
        const executionResult = await executor.execute(message);

        return {
            result: {
                jsonrpc: '2.0',
                id,
                result: {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(executionResult),
                        },
                    ],
                    isError: false,
                },
            },
        };
    }

    private resourceList({ id }: JsonRpcRequest) {
        return {
            result: {
                jsonrpc: '2.0',
                id,
                result: {
                    resources: this.registry.getResources(),
                },
            },
        };
    }
}
