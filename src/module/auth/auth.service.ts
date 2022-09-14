import { Injectable } from '@nestjs/common';
// import { User, UserModel } from '@/interface/user.interface';
import { ResponseData } from '@/interface/common';

@Injectable()
export class AuthService {
  constructor() {} // private configService:ConfigService//configService

  public async login(token: string) {
    // validate
    const response: ResponseData = {
      message: '登录成功',
      meta: '账户验证通过',
      code: 200,
      data: {
        token,
      },
    };
    return response;
  }

  public async isLogin() {
    // validate
    const response: ResponseData = {
      message: 'token有效',
      meta: '账户处于登录状态',
      code: 200,
      data: {
      },
    };
    return response;
  }

}
