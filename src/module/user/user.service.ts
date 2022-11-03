import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common'
import { User, UserModel, ChangePasswordType } from '@/interface/user.interface'
// import { ConfigService } from '@nestjs/config'
import { ResponseData } from '@/interface/common'
import { UrlReplace, UrlToOss } from '@/common/utils/ossReplace'
import { compareSync } from 'bcryptjs'
import { UserInfo } from '@/common/decorater/user.decorater'

@Injectable()
export class UserService {
  userIsNull: ResponseData = {
    message: '无用户信息!',
    // meta: '请修改用户名',
    code: 400,
    data: {},
  }
  constructor() {} // private configService:ConfigService//configService

  public async register(userParam: User) {
    const { username, password } = userParam
    const usernameReg = new RegExp(/^\w+$/)
    const passwordReg = new RegExp(/^[\w!@#$%&*]+$/)
    
    if (!usernameReg.test(username) || !passwordReg.test(password)) {
      throw new BadRequestException('检测到非法字符')
    }

    const res = await UserModel.findOne({
      username,
    })
    // validate
    if (res) {
      //   console.log("该用户已注册");
      return <ResponseData>{
        message: '该用户名已被使用!',
        meta: '请修改用户名',
        code: 6000,
        data: {},
      }
    } else {
      //   const password=hashSync(userParam.password, 10)
      const createUser = new UserModel(userParam)
      //save user
      createUser
        .save()
        .then((res) => {
          return res
        })
        .catch((err) => {
          throw new UnprocessableEntityException(
            '注册失败(存入数据库失败)' + err,
          )
        })

      return <ResponseData>{
        message: '注册成功!',
        // meta: '请修改用户名',
        code: 200,
        data: {},
      }
    }
  }

  public async changePassword(param: ChangePasswordType, userInfo: UserInfo) {
    const { _id } = userInfo
    let { oldPassword, newPassword } = param
    const passwordReg = new RegExp(/^[\w!@#$%&*]+$/)
    
    if (!passwordReg.test(newPassword)) {
        throw new BadRequestException('检测到非法字符')
    }
    
    const pre = await UserModel.findOne({
      _id,
    }).select('+password') //查询库中加密的旧密码
    const oldValidate = compareSync(oldPassword, pre.password) //比对旧密码
    if (!oldValidate) {
      throw new BadRequestException('原密码错误')
    }
    //直接存入新密码,由schema自动盐加密
    const res = await UserModel.findOneAndUpdate(
      {
        _id,
      },
      { password: newPassword },
    )
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException(
          '修改密码失败(存入数据库失败)' + err,
        )
      })

    return <ResponseData>{
      message: '修改密码成功!',
      // meta: '请修改用户名',
      code: 200,
      data: {},
    }
  }

  public async findMyself(userInfo: UserInfo) {
    const { _id } = userInfo
    const res = await UserModel.findOne({
      _id,
    })
      .then((res) => {
        if (res.avatar) {
          res.avatar = UrlReplace(res.avatar)
        }
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('查找失败' + err)
      })

    return <ResponseData>{ message: '查询成功!', code: 200, data: res }
  }

  public async updateMyself(userParam: User, userInfo: UserInfo) {
    const { _id } = userInfo

    let { uid, username, password, role, createdAt, ...updateParam } = userParam
    updateParam.updatedAt = new Date() //解构出可更新字段的对象

    if (updateParam.avatar) {
      updateParam.avatar = UrlToOss(updateParam.avatar)
    }

    const res = await UserModel.findOneAndUpdate(
      { _id },
      updateParam,
      { returnDocument: 'after' }, //返回更新后的文档
    )
      .then((res) => {
        if (res.avatar) {
          res.avatar = UrlReplace(res.avatar)
        }
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('修改用户失败' + err)
      })

    return <ResponseData>{
      message: '修改成功!',
      // meta: '请修改用户名',
      code: 200,
      data: res,
    }
  }

  public async removeMyself(userInfo: UserInfo) {
    const { _id } = userInfo

    const res = await UserModel.findOneAndDelete({
      _id,
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('删除comment失败' + err)
      })
    return <ResponseData>{ message: '删除成功', code: 200, data: res }
  }

  public async findOne(paramId: string) {
    const res = await UserModel.findOne({
      uid: paramId,
    })
      .then((res) => {
        if (res.avatar) {
          res.avatar = UrlReplace(res.avatar)
        }
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('查找失败' + err)
      })

    return <ResponseData>{ message: '查找成功', code: 200, data: res }
  }

  //---以下为root权限接口
  public async findAll(query) {
    const { page = 0, size = 0, order = 1, sort = 'createdAt' } = query

    const res = await UserModel.find()
      .sort({ [sort]: order })
      .skip(page > 0 ? (page - 1) * size : 0)
      .limit(size)
      .then((res) => {
        // res.forEach((item) => {
        //   console.log('res', res)
        //   if (item.from.avatar) {
        //     item.from.avatar = UrlReplace(item.from.avatar)
        //   }
        // })
        return res
      })

    return <ResponseData>{
      message: '查询成功!',
      // meta: '请修改用户名',
      code: 200,
      data: res,
    }
  }

  public async update(paramId: string, userParam: User) {
    if (!userParam.username || !paramId) {
      return this.userIsNull
    }

    let { uid, username, password, role, createdAt, ...updateParam } = userParam
    updateParam.updatedAt = new Date() //解构出可更新字段的对象

    if (updateParam.avatar) {
      updateParam.avatar = UrlToOss(updateParam.avatar)
    }

    const res = await UserModel.findOneAndUpdate(
      { uid: paramId },
      updateParam,
      { returnDocument: 'after' }, //返回更新后的文档
    )
      .then((res) => {
        if (res.avatar) {
          res.avatar = UrlReplace(res.avatar)
        }
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('修改用户失败' + err)
      })

    return <ResponseData>{
      message: '修改成功!',
      // meta: '请修改用户名',
      code: 200,
      data: res,
    }
  }

  public async remove(paramId: string) {
    if (paramId == undefined) {
      return this.userIsNull
    }

    const res = await UserModel.findOneAndDelete({
      uid: paramId,
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('删除comment失败' + err)
      })

    return <ResponseData>{ message: '删除成功', code: 200, data: res }
  }
}
