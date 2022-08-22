// local.strategy.ts
//本地登录-密文验证策略
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { BadRequestException } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { UserModel } from '@/interface/user.interface';
import { ResponseData } from '@/interface/common.interface';

export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor() {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    console.log(`local策略被守卫调用-`, username);
    const localReq = await UserModel.findOne({ username }).select('+password'); //+运算符包括其下的所有其他属性

    if (!localReq) {
      //   throw new BadRequestException('用户名不正确！');
      const res:ResponseData={
        message: '登录失败!',
        meta: '用户名不正确',
        status: '6000',
        data: {},
      }
      throw new BadRequestException(res);
    }
    console.log(password, localReq.password);

    if (!compareSync(password, localReq.password)) {
        const res:ResponseData={
            message: '登录失败!',
            meta: '密码错误',
            status: '6000',
            data: {},
        }
      throw new BadRequestException(res);
    }

    return localReq;
  }
}
