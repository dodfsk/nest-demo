import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './common/db/db.module';
import { ConfigModule } from '@nestjs/config'

import { UserController } from './module/user/user.controller';
import { UserModule } from './module/user/user.module';
import { RoomModule } from './module/room/room.module';
import { RoomController } from './module/room/room.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
    }),//.env环境变量  全局
	DbModule, 
	UserModule, 
    RoomModule, 
],
  controllers: [
    AppController, 
    UserController,
    RoomController
],
  providers: [AppService],
})
export class AppModule {}
