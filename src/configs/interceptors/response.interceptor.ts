import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp();
    const res = httpCtx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // Prefer status provided by handler data, otherwise read from response object
        const status =
          res && (res.statusCode ?? res.status)
            ? res.statusCode ?? res.status
            : undefined;

        // success defaults to
        return {
          status,
          data: data,
        };
      }),
    );
  }
}
