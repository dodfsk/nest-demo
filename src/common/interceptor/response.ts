import { ResponseData } from '@/interface/common';
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'


@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<ResponseData<T>> | Promise<Observable<ResponseData<T>>> {
    return next.handle().pipe(
      map((res) => {
        return {
          data: res.data,
          code: res.code ?? 200,
          meta: res.meta??undefined,
          url:res.url??undefined,
          message: res.message ?? '成功',
          timestamp: new Date().getTime(),
        }
      }),
    )
  }
}
