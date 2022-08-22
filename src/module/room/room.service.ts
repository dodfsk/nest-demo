import { Injectable } from '@nestjs/common';
import { Room, RoomModel } from '@/interface/room.interface';

@Injectable()
export class RoomService {
  public async create(roomParam: Room) {
    const res = await RoomModel.findOne({
        hid: roomParam.hid,
    });
    console.log('res,roomParam', res, roomParam);
    // if (res) {
    //   return {
    //     message: '该房间已创建!',
    //     meta: '请修改房间名',
    //     status: '6000',
    //     data: null,
    //   };
    // } else {
      try {
        const createRoom = new RoomModel(roomParam);
        //save user
        createRoom.save();
        return {
          message: '创建成功!',
          status: '200',
          data: null,
        };
      } catch (error) {
        throw Error('创建room失败' + error);
      }
    // }
  }

  public async findAll() {
    const res=await RoomModel
        .find()
    return res;
  }

  public async findOne(hid: string) {
    const res=await RoomModel
        .findOne({
            hid:hid
        })
    return res;
  }

  public async update(roomData:Room) {
    if(roomData.hid==undefined||null){
        return {message:'无房间信息',status:'6000',};
    }
    const res=await RoomModel
        .findOneAndUpdate({
            hid:roomData.hid
        },roomData)
    return res;
  }

  public async remove(hid: string) {
    if(hid==undefined||null){
        return {message:'无房间信息',status:'6000',};
    }
    const res=await RoomModel
        .findOneAndDelete({
            hid:hid
        })
    return res;
  }
}
