import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { IConfiguration } from '@app/configuration';
import { AccountModule } from '@app/modules/repositories/account';
import { AuthProvider } from './auth.types';
import { AuthGuard } from './guards';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({})
export class AuthModule {
    public static forRoot(): DynamicModule {
        return {
            global: true,
            module: AuthModule,
            imports: [
                ConfigModule,
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (
                        configService: ConfigService,
                    ): JwtModuleOptions => {
                        const jwtConfig =
                            configService.get<IConfiguration['jwt']>('jwt');

                        if (!jwtConfig) {
                            throw new Error('JWT configuration is missing.');
                        }

                        return {
                            secret: jwtConfig.secret,
                            signOptions: {
                                expiresIn: Number(jwtConfig.expiresIn) * 1000,
                            },
                        };
                    },
                }),
                AccountModule,
            ],
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthProvider.Config,
                    inject: [ConfigService],
                    useFactory: (
                        configService: ConfigService,
                    ): IConfiguration['jwt'] => {
                        return configService.get(
                            'jwt',
                        ) as IConfiguration['jwt'];
                    },
                },
                AuthService,
                AuthGuard,
            ],
            exports: [AuthService, AuthGuard],
        };
    }
}
