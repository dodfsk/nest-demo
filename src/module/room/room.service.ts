import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common'
import { Room, RoomModel } from '@/interface/room.interface'
import { UserInfo } from '@/common/decorater/user.decorater'
import { ResponseData } from '@/interface/common'
import { User } from '@/interface/user.interface'
import {
  ImgReplace,
  UrlReplace,
  ImgToOss,
  UrlToOss,
} from '@/common/utils/ossReplace'
import { AssetsService } from '../assets/assets.service'

@Injectable()
export class RoomService {
  constructor(private readonly assetsService: AssetsService) {}

  roomIsNull: ResponseData = {
    message: '无房间信息!',
    // meta: '请确认信息',
    code: 400,
    data: {},
  }
  //test
  //   public async preCreate(roomParam: Room, userInfo: UserInfo) {
  //     roomParam.from = userInfo.username
  //     try {
  //         let hid=nanoid()
  //         while(await RoomModel.findOne({hid})){
  //             hid=nanoid()
  //         }
  //         const res={hid}
  //       return {
  //         message: '预生成id成功!',
  //         code: 200,
  //         data: res,
  //       }
  //     } catch (error) {
  //       throw Error('预生成id失败' + error)
  //     }
  //   }

  public async create(roomParam: Room, userInfo: UserInfo) {
    roomParam.from = userInfo._id
    // let initParam:Partial<Room>={}
    // initParam.title=roomParam.title
    // initParam.content=roomParam.content

    // 创建空草稿逻辑待修改
    const createRoom = new RoomModel(roomParam)
    //save room
    const res = await createRoom
      .save()
      .then((res) => {
        // console.log(res)
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('创建room失败' + err)
      })

    return <ResponseData>{
      message: '创建成功!',
      code: 200,
      data: res,
    }
  }

  public async findOne(hid: string) {
    const res = await RoomModel.findOne({ hid })
      .select('+content +assets')
      .populate<{ from: User }>({
        path: 'from',
        select: 'uid username avatar stats',
      })
      .then((res) => {
        //替换@oss,后续将添加全局flag是否启用
        res.content = ImgReplace(res.content)
        if (res.cover) {
          res.cover = UrlReplace(res.cover)
        }
        if (res.from && res.from.avatar) {
          res.from.avatar = UrlReplace(res.from.avatar)
        }
        if (res.assets) {
          res.assets.forEach((item) => {
            if (item.url) {
              item.url = UrlReplace(item.url)
            }
          })
        }

        return res
      })
    // console.log(res)

    if (!res) {
      return this.roomIsNull
    }
    return <ResponseData>{ message: '查找成功', code: 200, data: res }
  }

  //无需登陆的roomList
  public async findList(query) {
    const { page = 0, size = 0, order = 1, sort = 'createdAt' } = query

    const total = await RoomModel.find({ status: 2 }).count()
    const res = await RoomModel.find({ status: 2 })
      .populate<{ from: User }>({
        path: 'from',
        select: 'uid username avatar stats',
      })
      .sort({ [sort]: order })
      .skip(page > 0 ? (page - 1) * size : 0)
      .limit(size)
      .then((res) => {
        res.forEach((item) => {
          if (item.cover) {
            item.cover = UrlReplace(item.cover)
          }
          if (item.from.avatar) {
            item.from.avatar = UrlReplace(item.from.avatar)
          }
        })
        return res
      })
    const response: ResponseData = {
      message: '查找成功!',
      code: 200,
      data: { total, roomList: res },
    }
    return response
  }
  //获取我的roomList
  public async findMyList(roomParam, userInfo: UserInfo) {
    const {
      page = 0,
      size = 0,
      order = 1,
      sort = 'createdAt',
      status = 2,
    } = roomParam

    const total = await RoomModel.find({ from: userInfo._id, status }).count()
    const res = await RoomModel.find({ from: userInfo._id, status })
      .populate<{ from: User }>({
        path: 'from',
        select: 'uid username avatar stats',
      })
      .sort({ [sort]: order })
      .skip(page > 0 ? (page - 1) * size : 0)
      .limit(size)
      .then((res) => {
        //替换@oss,后续将添加全局flag是否启用
        res.forEach((item) => {
          if (item.cover) {
            item.cover = UrlReplace(item.cover)
          }
          if (item.from && item.from.avatar) {
            item.from.avatar = UrlReplace(item.from.avatar)
          }
        })
        return res
      })
    return <ResponseData>{
      message: '查找成功!',
      code: 200,
      data: { total, roomList: res },
    }
    return
  }
  //更新用接口,待拆分出root接口
  public async updateMy(paramId: string, roomParam: Room, userInfo: UserInfo) {
    //权限判定
    const pre = await RoomModel.findOne({ hid: paramId })
    if (!userInfo._id.equals(pre.from)) {
      throw new BadRequestException('只能修改自己创建的帖子')
    }

    let { hid, from, stats, status, createdAt, ...updateParam } = roomParam
    //解构剔除不更新的字段

    updateParam.updatedAt = new Date()

    //替换@oss,后续将添加全局flag是否启用
    if (updateParam.content) {
      updateParam.content = ImgToOss(updateParam.content)
    }
    if (updateParam.cover) {
      updateParam.cover = UrlToOss(updateParam.cover)
    }
    if (updateParam.assets) {
      updateParam.assets.forEach((item) => {
        item.url = UrlToOss(item.url)
      })
    }

    const res = await RoomModel.findOneAndUpdate({ hid: paramId }, updateParam)
      .select('+content +assets')
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('更新room失败' + err)
      })

    return <ResponseData>{ message: '修改成功', code: 200, data: res }
  }
  //单向0-->3状态更新
  public async updateStatus(paramId: string, roomParam, userInfo: UserInfo) {
    //权限判定
    const pre = await RoomModel.findOne({ hid: paramId })
    if (!userInfo._id.equals(pre.from)) {
      throw new BadRequestException('只能修改自己创建的帖子')
    }

    //解构取出状态字段
    let { status } = roomParam
    if (pre.status >= status) {
      throw new BadRequestException(`无法回退状态!`)
    }

    let updateParam: Partial<Room> = {}

    updateParam.status = status
    if (status === 2) {
      updateParam.createdAt = new Date()
    }

    const res = await RoomModel.findOneAndUpdate(
      { hid: paramId },
      updateParam,
      { returnDocument: 'after' },
    ) //返回更新后的文档
      .select('+content +assets')
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('状态修改失败' + err)
      })

    return <ResponseData>{ message: '状态修改成功', code: 200, data: res }
  }
  ///////////////////////////
  //---以下为root权限接口---//
  //////////////////////////
  public async findAll(query, userInfo: UserInfo) {
    const {
      page = 0,
      size = 0,
      order = 1,
      sort = 'createdAt',
      status = 2,
    } = query

    const total = await RoomModel.find({ status }).count()
    const res = await RoomModel.find({ status })
      .populate<{ from: User }>({
        path: 'from',
        select: 'uid username avatar stats',
      })
      .sort({ [sort]: order })
      .skip(page > 0 ? (page - 1) * size : 0)
      .limit(size)
      .then((res) => {
        res.forEach((item) => {
          if (item.cover) {
            item.cover = UrlReplace(item.cover)
          }
          if (item.from.avatar) {
            item.from.avatar = UrlReplace(item.from.avatar)
          }
        })
        return res
      })
    const response: ResponseData = {
      message: '查找成功!',
      code: 200,
      data: { total, roomList: res },
    }
    return response
  }
  public async update(paramId: string, roomParam: Room, userInfo: UserInfo) {
    //权限判定
    const pre = await RoomModel.findOne({ hid: paramId })
    if (!userInfo._id.equals(pre.from)) {
      throw new BadRequestException('只能修改自己创建的帖子')
    }

    let { hid, from, stats, status, createdAt, ...updateParam } = roomParam
    //解构剔除不更新的字段

    updateParam.updatedAt = new Date()

    //替换@oss,后续将添加全局flag是否启用
    if (updateParam.content) {
      updateParam.content = ImgToOss(updateParam.content)
    }
    if (updateParam.cover) {
      updateParam.cover = UrlToOss(updateParam.cover)
    }
    if (updateParam.assets) {
      updateParam.assets.forEach((item) => {
        item.url = UrlToOss(item.url)
      })
    }

    const res = await RoomModel.findOneAndUpdate({ hid: paramId }, updateParam)
      .select('+content +assets')
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('更新room失败' + err)
      })

    return <ResponseData>{ message: '修改成功', code: 200, data: res }
  }
  //删除用接口,待拆分出root接口
  public async remove(paramId: string, userInfo: UserInfo) {
    if (paramId == undefined || null) {
      return { message: '无房间信息', code: 6000 }
    }
    //权限判定
    const pre = await RoomModel.findOne({ hid: paramId })
    if (!userInfo._id.equals(pre.from)) {
      throw new BadRequestException('只能删除自己创建的帖子')
    }

    const res = await RoomModel.findOneAndDelete({
      hid: paramId,
    })
    return <ResponseData>{ message: '删除成功', code: 200, data: res }
  }

  // 待修改
  //   public async uploadOss(paramId: string,body, userInfo: UserInfo) {
  //     const { fileName } = body
  //     //权限判定
  //      const pre = await RoomModel.findOne({ hid:paramId })
  //      if (pre.from != userInfo._id) {
  //          throw Error('只能修改自己创建的帖子')
  //      }

  //     const prePramas={
  //         bucketName:'archive',
  //         subName: paramId,
  //         fileName
  //     }

  //     return await this.assetsService.getPreSignedUrl(prePramas, userInfo)

  //   }
}
