//jwt.strategy.ts

import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { User, UserModel } from '@/interface/user.interface';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY, //设置secret
      ignoreExpiration: false, //是否忽略过期时间
    } as StrategyOptions);
  }

  async validate(id: any) {
    console.log(`jwt策略被守卫调用-`, id);
    const existUser = await UserModel.findById(id);
    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }
    return existUser;
  }
}
