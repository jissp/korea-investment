import { Worker, WorkerOptions } from 'bullmq';
import {
    Inject,
    Injectable,
    Logger,
    OnModuleInit,
    Optional,
} from '@nestjs/common';
import { MetadataScannerService } from '@modules/metadata-scanner';
import { QueueMetadataKey, QueueProvider } from './queue.types';

@Injectable()
export class QueueExplorer implements OnModuleInit {
    private readonly workers = new Set<Worker>();
    private readonly logger = new Logger(QueueExplorer.name);

    constructor(
        private readonly metadataScanner: MetadataScannerService,
        @Inject(QueueProvider.BullOptions)
        @Optional()
        private readonly bullOptions?: WorkerOptions,
    ) {}

    onModuleInit() {
        const metadataList = this.metadataScanner.scan({
            metadataKey: QueueMetadataKey,
        });

        metadataList.forEach(({ metadata, instance, methodName }) => {
            const methodRef = instance[methodName];
            const _workerOptions = Object.assign(
                {},
                this.bullOptions,
                metadata.workerOptions || {},
            );

            metadata.queueName.forEach((name: string) => {
                const worker = new Worker(
                    name,
                    methodRef.bind(instance),
                    _workerOptions,
                );
                this.workers.add(worker);
                this.logger.debug(`Registered worker for queue: ${name}`);
            });
        });
    }
}
