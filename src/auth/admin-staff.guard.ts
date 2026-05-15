import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class AdminOrStaffGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        const user = req.user;

        if(!user) {
            throw new UnauthorizedException({
                message: 'Ingen användare inloggad'
            });
        }

        if(user.role === 'admin') {
            return true;
        }

        if(user.role === 'staff') {
            return true;
        }

        throw new ForbiddenException({
            message: 'Endast admin eller personal har behörighet',
            requiredRole: 'admin | staff'
        })
    }
}