import { Injectable } from '@nestjs/common';
import { User, UserModel } from '@/interface/user.interface';
// import { ConfigService } from '@nestjs/config'
import { ResponseData } from '@/interface/common.interface';

@Injectable()
export class UserService {
  userIsNull: ResponseData = {
    message: '无用户信息!',
    // meta: '请修改用户名',
    code: 6000,
    data: {},
  };
  constructor() {} // private configService:ConfigService//configService

  //@Header('Cache-Control', 'none')
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

  public async register(userParam: User) {
    const { username } = userParam;
    const res = await UserModel.findOne({
      username,
    });
    // validate
    if (res) {
      //   console.log("该用户已注册");
      const response: ResponseData = {
        message: '该用户已注册!',
        meta: '请修改用户名',
        code: 6000,
        data: {},
      };
      return response;
    } else {
      try {
        //   const password=bcrypt.hashSync(userParam.password, 10)
        const createUser = new UserModel(userParam);
        //save user
        createUser.save();

        const response: ResponseData = {
          message: '注册成功!',
          // meta: '请修改用户名',
          code: 6000,
          data: {},
        };
        return response;
      } catch (error) {
        throw Error('存入数据库失败' + error);
      }
    }
  }

  public async findAll(username: string) {
    const res = await UserModel.find();
    const response: ResponseData = {
      message: '查询成功!',
      // meta: '请修改用户名',
      code: 200,
      data: res,
    };
    return response;
  }

  public async findOne(username: string) {
    const res = await UserModel.findOne({
      username,
    });
    if (res) {
      const response: ResponseData = {
        message: '查询成功!',
        // meta: '请修改用户名',
        code: 200,
        data: res,
      };
      return response;
    } else {
      return this.userIsNull;
    }
  }

  public async update(userInfo: User) {
    if (userInfo.username == undefined || null) {
      return this.userIsNull;
    }
    const res = await UserModel.findOneAndUpdate(
      { username: userInfo.username },
      userInfo,
    );
    if (res) {
      const response: ResponseData = {
        message: '修改成功!',
        // meta: '请修改用户名',
        code: 200,
        data: res,
      };
      return response;
    }
  }

  public async remove(username: string) {
    if (username == undefined) {
      return this.userIsNull;
    }
    const res = await UserModel.findOneAndDelete({
      username,
    });
    if (res) {
      const response: ResponseData = {
        message: '删除成功!',
        // meta: '请修改用户名',
        code: 200,
        data: res,
      };
      return response;
    } else return this.userIsNull;
  }
}
