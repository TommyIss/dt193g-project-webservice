import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const user = req.user;

        if(!req.user) {
            throw new UnauthorizedException({
                message: 'Ingen användare är inloggad'
            });
        }

        const requestedId = Number(req.params.id);

        // Admin behörighet
        if(user.role === 'admin') {
            return true;
        }

        if( user.id === requestedId ) {
            return true;
        }

        throw new ForbiddenException({
            message: 'Endast admin eller ägaren',
            requiredRole: 'admin | ägaren'
        });
    }
}