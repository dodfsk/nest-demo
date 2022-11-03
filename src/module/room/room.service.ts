import { Injectable } from '@nestjs/common'
import { Room, RoomModel } from '@/interface/room.interface'
import { UserInfo } from '@/common/decorater/user.decorater'
import { ResponseData } from '@/interface/common'
import { nanoid } from "@/common/utils/nanoid";
import { AnyCnameRecord } from 'dns';

@Injectable()
export class RoomService {
  roomIsNull: ResponseData = {
    message: '无房间信息!',
    // meta: '请确认信息',
    code: 6000,
    data: {},
  }
  //test
  public async preCreate(roomParam: Room, userInfo: UserInfo) {
    roomParam.from = userInfo.username
    try {
        let hid=nanoid()
        while(await RoomModel.findOne({hid})){
            hid=nanoid()
        }
        const res={hid}
      return {
        message: '预生成id成功!',
        code: 200,
        data: res,
      }
    } catch (error) {
      throw Error('预生成id失败' + error)
    }
  }


  public async create(roomParam: Room, userInfo: UserInfo) {
    roomParam.from = userInfo.username
    try {
      const createRoom = new RoomModel(roomParam)
      //save user
      const res = await createRoom.save()

      return {
        message: '创建成功!',
        code: 200,
        data: res,
      }
    } catch (error) {
      throw Error('创建room失败' + error)
    }
  }

  public async findAll(query:Room) {
    // console.log('query',query)//{ from:xxx }
    
    if (!query.from) {
      const res = await RoomModel.find({isPublic:true})
    //   if (!res.length) {
    //     return this.roomIsNull
    //   }
      const response: ResponseData = {
        message: '查找成功!',
        code: 200,
        data: { roomList: res },
      }
      return response
    } else {
      const res = await RoomModel.find(query).select('+content +assets')
    //   if (!res.length) {
    //     return this.roomIsNull
    //   }
      const response: ResponseData = {
        message: '查找成功!',
        code: 200,
        data: { roomList: res },
      }
      return response
    }
  }

  public async findOne(hid: string) {
    const res = await RoomModel.findOne({ hid }).select('+content +assets')
    if (!res) {
      return this.roomIsNull
    }
    return { message: '查找成功', code: 200, data: res }
  }

  public async update(roomParam: Room, userInfo: UserInfo) {
    try{
        if (roomParam.hid == undefined || null) {
        return this.roomIsNull
        }
        let { hid, from, createdAt, ...updateParam } = roomParam
        updateParam.updateAt = new Date()
        const res = await RoomModel.findOneAndUpdate({ hid }, updateParam).select(
        '+content',
        )
    return { message: '修改成功', code: 200, data: res }
    } catch (error) {
        throw Error('更新room失败' + error)
    }
  }

  public async delete(hid: string, userInfo: UserInfo) {
    if (hid == undefined || null) {
      return { message: '无房间信息', code: 6000 }
    }
    let res:any
    if(userInfo.role==='root'){
        res = await RoomModel.findOneAndDelete({
            hid,
        })
    }else{
        res = await RoomModel.findOneAndDelete({
            hid,
            from:userInfo.username
        })
    }
    if(res){
        return { message: '删除成功', code: 200, data: res }
    }
    else{
        return {
            message:'删除失败!',meta:'只能删除自己的帖子',code:6000,data:res
        }
    }
  }
}
