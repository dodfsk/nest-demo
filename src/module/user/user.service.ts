import { Injectable } from '@nestjs/common';
import { User, UserModel } from '@/interface/user.interface';
// import { ConfigService } from '@nestjs/config'
import { ResponseData } from '@/interface/common';

@Injectable()
export class UserService {
  userIsNull: ResponseData = {
    message: '无用户信息!',
    // meta: '请修改用户名',
    code: 6000,
    data: {},
  };
  constructor() {} // private configService:ConfigService//configService

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
          code: 200,
          data: {},
        };
        return response;
      } catch (error) {
        throw Error('存入数据库失败' + error);
      }
    }
  }

  public async findAll() {
    const res = await UserModel.find();
    const response: ResponseData = {
      message: '查询成功!',
      // meta: '请修改用户名',
      code: 200,
      data: res,
    };
    return response;
  }

  public async findOne(uname: string) {
    const res = await UserModel.findOne({
        username:uname,
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

  public async update(uname:string,userParam: User) {    
    if (!userParam.username||!uname) {
      return this.userIsNull;
    }
    let { username, password,role,createdAt, ...updateParam } = userParam;
    updateParam.updateAt=new Date()//解构出可更新字段的对象
    
    const res = await UserModel.findOneAndUpdate(
      { username: uname },
      updateParam,
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

  public async remove(uname: string) {
    if (uname == undefined) {
      return this.userIsNull;
    }
    const res = await UserModel.findOneAndDelete({
        username:uname,
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
