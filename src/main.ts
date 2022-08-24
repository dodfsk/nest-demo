import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
const listenPort = 13573;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());//全局过滤器
  
  //swagger config↓
  const config = new DocumentBuilder()
    .setTitle('NestJs Api')//标题
    .setDescription('NestJs项目测试')//描述
    .setVersion('1.0')//版本
    .addBearerAuth()
    // .addTag("cats")
    .build();
  const document = SwaggerModule.createDocument(app, config);// 引入Swagger
  SwaggerModule.setup('swagger', app, document);// 接口文档路径
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
