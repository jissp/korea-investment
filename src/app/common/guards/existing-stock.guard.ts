import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ExistingStockGuard implements CanActivate {
    public canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (!request.stock) {
            throw new NotFoundException('Stock not found');
        }

        return true;
    }
}
