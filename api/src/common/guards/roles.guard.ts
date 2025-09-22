import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role, roleSatisfies } from '../../rbac/rbac';


@Injectable()
export class RolesGuard implements CanActivate {
constructor(private reflector: Reflector) {}
canActivate(ctx: ExecutionContext): boolean {
const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);
if (!required?.length) return true;
const req = ctx.switchToHttp().getRequest();
const userRole = req.user?.role as Role | undefined;
if (!userRole) return false;
return required.some((r) => roleSatisfies(r, userRole));
}
}