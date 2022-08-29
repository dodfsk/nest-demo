import { Injectable } from '@nestjs/common';
import { Room, RoomModel } from '@/interface/room.interface';
import { UserInfo } from '@/common/decorater/user.decorater';

@Injectable()
export class RoomService {
  public async create(roomParam: Room,userInfo:UserInfo) {
    roomParam.from=userInfo.username
    // roomParam.createdAt=new Date()
      try {
        const createRoom = new RoomModel(roomParam);
        //save user
        const res=await createRoom.save();
        
        return {
          message: '创建成功!',
          code: 200,
          data: res,
        };
      } catch (error) {
        throw Error('创建room失败' + error);
      }

    }

  public async findAll() {
    const res=await RoomModel
        .find()
    return {message:'查找成功',code: 200,data:{roomList:res}};
  }

  public async findOne(hid: string) {
    const res=await RoomModel
        .findOne({hid}).select('+content')
    return {message:'查找成功',code:200,data:res};
  }

  public async update(roomParam:Room,userInfo:UserInfo) {
    const { hid }=roomParam
    if(hid==undefined||null){
        return {message:'无房间信息',code: 6000};
    }
    roomParam.updateAt=new Date()
    const res=await RoomModel
        .findOneAndUpdate({hid},roomParam).select('+content')
    return {message:'修改成功',code:200,data:res};
  }

  public async remove(hid: string,userInfo:UserInfo) {
    if(hid==undefined||null){
        return {message:'无房间信息',code:6000,};
    }
    const res=await RoomModel
        .findOneAndDelete({
            hid
        }).select('+content')
    return {message:'删除成功',code:200,data:res};
  }
}
