import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const started = Date.now();
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - started;
        const request = context.switchToHttp().getRequest();
        console.log({
          method: request.method,
          url: request.url,
          durationMs: duration,
        });
      }),
    );
  }
}
