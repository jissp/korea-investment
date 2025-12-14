import { Worker, WorkerOptions } from 'bullmq';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Inject, Injectable, OnModuleInit, Optional } from '@nestjs/common';
import {
    QueueMetadataKey,
    QueueMetadataValue,
    QueueProvider,
} from './queue.types';

@Injectable()
export class QueueExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        private readonly reflector: Reflector,
        @Inject(QueueProvider.BullOptions)
        @Optional()
        private readonly bullOptions?: WorkerOptions,
    ) {}

    onModuleInit() {
        const providers = this.discoveryService.getProviders();
        const controllers = this.discoveryService.getControllers();
        const instances = [...providers, ...controllers];

        instances.forEach((wrapper: InstanceWrapper) => {
            const { instance } = wrapper;
            if (!instance || typeof instance !== 'object') {
                return;
            }

            const prototype = Object.getPrototypeOf(instance);
            if (!prototype) {
                return;
            }

            const methodNames =
                this.metadataScanner.getAllMethodNames(prototype);
            methodNames.forEach((methodName: string) => {
                this.registerQueueProcessor(instance, methodName);
            });
        });
    }

    private registerQueueProcessor(instance: any, methodName: string) {
        const methodRef = instance[methodName];
        const metadata = this.reflector.get<QueueMetadataValue>(
            QueueMetadataKey,
            methodRef,
        );

        if (!metadata) {
            return;
        }

        const { queueName, workerOptions } = metadata;
        const _workerOptions = Object.assign(
            {},
            this.bullOptions,
            workerOptions || {},
        );

        queueName.forEach((name: string) => {
            new Worker(name, methodRef.bind(instance), _workerOptions);
        });
    }
}
