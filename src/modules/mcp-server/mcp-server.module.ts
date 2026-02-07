import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { StockModule } from '@app/modules/repositories/stock';
import { GetStockByStockNameExecutor, GetStockExecutor } from './executors';
import { McpServerConfig, McpServerProvider } from './mcp-server.types';
import { McpMetadataRegistryService } from './mcp-metadata-registry.service';
import { McpServerService } from './mcp-server.service';
import { McpServerController } from './mcp-server.controller';

const repositories = [StockModule];
const executors = [GetStockExecutor, GetStockByStockNameExecutor];

@Module({})
export class McpServerModule {
    static forRoot(config?: McpServerConfig): DynamicModule {
        return {
            module: McpServerModule,
            imports: [DiscoveryModule, StockModule, ...repositories],
            controllers: [McpServerController],
            providers: [
                {
                    provide: McpServerProvider.MCP_SERVER_CONFIG,
                    useValue: config || {
                        name: 'Korea Investment MCP Server',
                        version: '1.0.0',
                    },
                },
                McpMetadataRegistryService,
                McpServerService,
                ...executors,
            ],
            exports: [],
        };
    }
}
