import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';


@Injectable()
export class AuditInterceptor implements NestInterceptor {
intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
const req = ctx.switchToHttp().getRequest();
const start = Date.now();
return next.handle().pipe(
tap({
next: () => {
const payload = {
at: new Date().toISOString(),
userId: req.user?.sub ?? null,
orgId: req.user?.orgId ?? null,
method: req.method,
path: req.originalUrl,
ms: Date.now() - start,
};
// Basic console audit; can be extended to file/DB via AuditService
// eslint-disable-next-line no-console
console.log(JSON.stringify(payload));
},
}),
);
}
}