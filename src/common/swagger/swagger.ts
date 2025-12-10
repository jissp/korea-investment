import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfigs } from './swagger.types';

export function setSwaggerConfigs<T extends INestApplication>(
    app: T,
    configs: SwaggerConfigs,
) {
    const options = new DocumentBuilder()
        .setTitle(configs.title)
        .setDescription(configs.description)
        .setVersion(configs.version)
        .build();

    const document = SwaggerModule.createDocument(app, options);

    if (configs.apiTags) {
        document.tags = configs.apiTags.map((apiTag) => ({ name: apiTag }));
    }

    SwaggerModule.setup('api-docs', app, document, {
        jsonDocumentUrl: 'api-json',
    });
}
