import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface Data<T> {
  data: T;
}
@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Data<T>> | Promise<Observable<Data<T>>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 0,
          message: '成功',
        };
      }),
    );
  }
}
