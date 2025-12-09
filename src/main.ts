import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '@app/app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const appPort = process.env.PORT ?? 3100;

    const app = await NestFactory.create(AppModule);
    await app.listen(appPort);

    logger.log(`Server is running on port ${appPort}`);
}
bootstrap();
