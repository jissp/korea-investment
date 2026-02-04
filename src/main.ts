import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setSwaggerConfigs } from '@common/swagger';
import { HttpDefaultException } from '@app/common/exceptions';
import { AppModule } from '@app/app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const appPort = process.env.PORT ?? 3100;

    const app = await NestFactory.create(AppModule);

    app.enableShutdownHooks();

    // Swagger 설정
    setSwaggerConfigs(app, {
        title: 'Korea Investment API',
        description: 'Korea Investment API',
        version: '1.0',
    });

    // Class Validator 적용
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    app.useGlobalFilters(new HttpDefaultException());

    await app.listen(appPort);

    logger.log(`Server is running on port ${appPort}`);
}
bootstrap();
