export enum McpServerProvider {
    MCP_SERVER_CONFIG = 'MCP_SERVER_CONFIG',
}

export interface McpServerConfig {
    name: string;
    version: string;
    description?: string;
}
