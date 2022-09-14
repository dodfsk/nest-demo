import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from '@/common/guard/local.guard';
import { JwtStrategy } from '@/common/guard/jwt.guard';

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
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
