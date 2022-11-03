import { ResponseData } from '@/interface/common'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

// @Catch()
// export class HttpExceptionFilter<T> implements ExceptionFilter {
//   catch(exception: T, host: ArgumentsHost) {}
// }

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    // 以下根据自己业务进行调整
    // 错误信息参数
    let code = exception.getStatus()
    let message: string = ''
    let meta: string | undefined = undefined
    // const url = request.originalUrl;
    const timestamp = new Date().getTime()
    // console.log('exception-',exception);
    const GetResponse = typeof exception.getResponse()
    if (GetResponse === 'string') {
      message = exception.message
    } else if (GetResponse === 'object') {
      const responseData = exception.getResponse() as ResponseData
      message = responseData.message
      meta = responseData.meta
      code = responseData.code || code
    }

    // 整理返回全部的错误信息
    const errorResponse: ResponseData = {
      data: {}, // 默认结果为空对象
      message, // 错误提示
      meta, //错误元提示
      code, // 自定义code
      timestamp, //当前时间戳
      //   url, // 错误的url地址
    }

    // http状态码响应，没有就是500
    const status =
      exception instanceof HttpException
        ? code
        : HttpStatus.INTERNAL_SERVER_ERROR
    // 设置返回的状态码、请求头、发送错误信息
    response.status(200)//设置默认200
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
