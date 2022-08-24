// local.strategy.ts
//本地登录-密文验证策略
import { Inject,CACHE_MANAGER,BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { compareSync } from 'bcryptjs';
import { UserModel } from '@/interface/user.interface';
import { ResponseData } from '@/interface/common.interface';
import { JwtService } from '@nestjs/jwt';
import {Cache} from 'cache-manager';

export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private jwtService: JwtService, //注入jwtService
    @Inject(CACHE_MANAGER) private cacheManage: Cache, //注入缓存管理器
    ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    console.log(`local策略被守卫调用-`, username);
    const userInfo = await UserModel.findOne({ username }).select('+password'); //+运算符包括其下的所有其他属性

    if (!userInfo) {
      const response:ResponseData={
        message: '登录失败!',
        meta: '用户名不正确',
        code: 6000,
        data: {},
      }
      throw new BadRequestException(response);
    }
    console.log(password, userInfo.password);

    if (!compareSync(password, userInfo.password)) {
        const response:ResponseData={
            message: '登录失败!',
            meta: '密码错误',
            code: 6000,
            data: {},
        }
      throw new BadRequestException(response);
    }
    const _id=String(userInfo._id);
    const payload = { _id};
    const token = this.jwtService.sign(payload);
    const value = await this.cacheManage.set(
        _id, 
        token, 
        {ttl: 3600,}
    );
    return {token};
  }
}
