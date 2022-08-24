//jwt.strategy.ts

import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { User, UserModel } from '@/interface/user.interface';
import { Cache } from 'cache-manager';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManage:Cache,//注入缓存管理器
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY, //设置secret
      ignoreExpiration: false, //是否忽略过期时间
      passReqToCallback: true,//返回传递token
    } as StrategyOptions);
  }

  async validate(req,payload: any) {
    console.log(`jwt策略被守卫调用-`, payload);
    const existUser = await UserModel.findById(payload);

    const headersToken:string = req.headers['authorization'].split(' ')[1];
    const redisToken=await this.cacheManage.get<string>(payload._id)
    console.log(
        'redis中的token-',redisToken
    );
    if(headersToken==redisToken){
        console.log('redis缓存通过');
        return existUser;
    }
    else{
      throw new UnauthorizedException('token失效!请重新登录');
    }
  }
}
