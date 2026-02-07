import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import {
    MCP_RESOURCE_METADATA,
    MCP_TOOL_METADATA,
    McpResourceOptions,
    McpToolOptions,
} from './decorators';
import { BaseExecutor } from './base.executor';

@Injectable()
export class McpMetadataRegistryService implements OnModuleInit {
    private tools = new Map<
        string,
        { executor: BaseExecutor; metadata: McpToolOptions }
    >();
    private resources = new Map<
        string,
        { handler: Function; metadata: McpResourceOptions }
    >();

    constructor(
        private readonly discovery: DiscoveryService,
        private readonly reflector: Reflector,
    ) {}

    onModuleInit() {
        this.scanMetadata();
    }

    private scanMetadata() {
        const wrappers = this.discovery.getProviders();
        wrappers.forEach((wrapper) => {
            const { instance } = wrapper;
            if (!instance || typeof instance !== 'object') return;

            const prototype = Object.getPrototypeOf(instance);
            const methodNames = Object.getOwnPropertyNames(prototype).filter(
                (methodName) => {
                    const descriptor = Object.getOwnPropertyDescriptor(
                        prototype,
                        methodName,
                    );
                    return (
                        descriptor &&
                        typeof descriptor.value === 'function' &&
                        methodName !== 'constructor'
                    );
                },
            );

            methodNames.forEach((methodName) => {
                this.processMethod(instance, methodName);
            });
        });
    }

    private processMethod(instance: any, methodName: string) {
        const methodHandler = instance[methodName].bind(instance);

        // Scan Tools
        const toolMeta = this.reflector.get<McpToolOptions>(
            MCP_TOOL_METADATA,
            instance[methodName],
        );
        if (toolMeta) {
            this.tools.set(toolMeta.name, {
                executor: instance,
                metadata: toolMeta,
            });
        }

        // Scan Resources
        const resourceMeta = this.reflector.get<McpResourceOptions>(
            MCP_RESOURCE_METADATA,
            instance[methodName],
        );
        if (resourceMeta) {
            this.resources.set(resourceMeta.uri, {
                handler: methodHandler,
                metadata: resourceMeta,
            });
        }
    }

    getTools() {
        return Array.from(this.tools.values()).map((t) => t.metadata);
    }

    getToolExecutor(name: string) {
        return this.tools.get(name)?.executor;
    }

    getResources() {
        return Array.from(this.resources.values()).map((r) => r.metadata);
    }

    getResourceHandler(uri: string) {
        // 실제 구현에서는 URI 템플릿 매칭 로직이 필요할 수 있습니다.
        return this.resources.get(uri)?.handler;
    }
}
