import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export interface JwtUserPayload {
sub: number;
email: string;
orgId: number;
role: string; // Role string
}


export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtUserPayload => {
const req = ctx.switchToHttp().getRequest();
return req.user;
});