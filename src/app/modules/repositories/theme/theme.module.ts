import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theme, ThemeStock } from './entities';
import { ThemeService } from './theme.service';

const entities = [Theme, ThemeStock];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [ThemeService],
    exports: [TypeOrmModule.forFeature(entities), ThemeService],
})
export class ThemeModule {}
