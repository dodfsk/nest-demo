import { ResponseData } from '@/interface/common.interface';
import { ArgumentsHost, Catch, ExceptionFilter,HttpException,HttpStatus } from '@nestjs/common';

// @Catch()
// export class HttpExceptionFilter<T> implements ExceptionFilter {
//   catch(exception: T, host: ArgumentsHost) {}
// }
  
  @Catch(HttpException)
  export class HttpExceptionFilter<T> implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      // 以下根据自己业务进行调整
      // 错误码
      let code = exception.getStatus();
      const message = exception.message;
      const url = request.originalUrl;
      const timestamp = new Date().getTime();
    //   const timestamp = new Date().toISOString();
  
      // 整理返回全部的错误信息
      const errorResponse:ResponseData = {
        data: {}, // 默认结果为空对象
        message, // 错误提示
        status:code, // 自定义code
        timestamp,//当前时间戳
        url, // 错误的url地址
      };
  
      // http状态码响应，没有就是500
      const status =
        exception instanceof HttpException
          ? code  : HttpStatus.INTERNAL_SERVER_ERROR;
      // 设置返回的状态码、请求头、发送错误信息
      response.status(status);
      response.header("Content-Type", "application/json; charset=utf-8");
      response.send(errorResponse);
    }
  }
  