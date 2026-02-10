import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { Nullable } from '@common/types';
import { normalizeError } from '@common/domains';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new Error('Authorization header is missing.');
            }

            const payload = await this.authService.verify(token);

            const account = await this.authService.getAccount(payload.account);
            if (!account) {
                throw new Error('Account not found.');
            }

            request['account'] = account;

            return true;
        } catch (error) {
            this.logger.error(normalizeError(error).message);
            throw new UnauthorizedException();
        }
    }

    /**
     * @param request
     * @private
     */
    private extractTokenFromHeader(request: Request): Nullable<string> {
        const authorization = request.headers[
            'authorization'
        ] as Nullable<string>;

        const [type, token] = authorization?.split(' ') || [];

        return type === 'Bearer' && token ? token : null;
    }
}
