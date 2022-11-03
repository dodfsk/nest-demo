import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
//swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import { join } from 'path';
import { json } from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtAuthGuard } from './common/guard/jwt.guard';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { Response } from '@/common/interceptor/response';

const listenPort = 13573;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    // allowedHeaders:['content-type'],
    // origin:'http://192.168.2.107:3000',
    // credentials:true,
  });
  app.useGlobalFilters(new HttpExceptionFilter()); //全局过滤器
  app.use(json({ limit: '5mb' })); //json大小限制
//   app.useStaticAssets(join(__dirname, 'assets'), { prefix: '/assets' });//访问静态资源路径
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()))//全局使用jwt守卫,Public装饰器为公开接口
  app.useGlobalInterceptors(new Response())

  //swagger config↓
  const config = new DocumentBuilder()
    .setTitle('NestJs Api') //标题
    .setDescription('NestJs项目Demo') //描述
    .setVersion('1.1') //版本
    .addBearerAuth()
    // .addTag("cats")
    .build();
  const document = SwaggerModule.createDocument(app, config); // 引入Swagger
  SwaggerModule.setup('swagger', app, document); // 接口文档路径
  //swagger↑

  //session config↓
  //   app.use(
  //     session({
  //       secret: 'hmmm', //服务端session签名
  //       rolling: true, //每次请求强制设置cookie,充值过期时间,默认false
  //       name: 'hmmm.sid', //客户端cookie名字
  //       cookie: {
  //         maxAge: 86400, //单位秒
  //       },
  //     }),
  //   );
  await app.listen(listenPort);
}
bootstrap();
