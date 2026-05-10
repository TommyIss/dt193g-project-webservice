import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        if(!req.user) {
            throw new UnauthorizedException({
                message: 'Ingen användare är inloggad'
            });
        }

        if(req.user?.role !== 'admin') {
            throw new ForbiddenException({
                message: 'Endast admin har behörighet',
                requiredRole: 'admin'
            });
        }

        return true;
    }
}