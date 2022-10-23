import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './db/mongo/mongo.module';

import { UserController } from './module/user/user.controller';
import { UserModule } from './module/user/user.module';
import { RoomModule } from './module/room/room.module';
import { RoomController } from './module/room/room.controller';
import { UploadModule } from './module/upload/upload.module';
import { AuthModule } from './module/auth/auth.module';
import { MinioModule } from './db/minio/minio.module';
import { RedisModule } from './db/redis/redis.module';
import { AssetsModule } from './module/assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), //.env环境变量  全局
    RedisModule,//redis
    MongoModule,//mongo
    MinioModule,//minio
    UserModule,
    RoomModule,
    UploadModule,
    AuthModule,
    AssetsModule,
  ],
  controllers: [AppController, UserController, RoomController],
  providers: [AppService],
})
export class AppModule {}
