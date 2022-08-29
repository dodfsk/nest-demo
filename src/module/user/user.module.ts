import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
//ts-ignore
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@/common/guard/local.guard';
import { JwtStrategy } from '@/common/guard/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService], //注入configService
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get<string>('SECRET_KEY'), // 设置secret
          signOptions: {
            expiresIn: config.get<string>('JWT_TIMEOUT'), //设置时长
          }, // 设置token属性
        };
      },
    }), //注册JwtModule
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
  exports: [UserService, JwtModule],
})
export class UserModule {}
