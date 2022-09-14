import { Injectable } from '@nestjs/common';
import { Room, RoomModel } from '@/interface/room.interface';
import { UserInfo } from '@/common/decorater/user.decorater';
import { ResponseData } from '@/interface/common';

@Injectable()
export class RoomService {
  roomIsNull: ResponseData = {
    message: '无房间信息!',
    // meta: '请确认信息',
    code: 6000,
    data: {},
  };
  public async create(roomParam: Room, userInfo: UserInfo) {
    roomParam.from = userInfo.username;
    try {
      const createRoom = new RoomModel(roomParam);
      //save user
      const res = await createRoom.save();

      return {
        message: '创建成功!',
        code: 200,
        data: res,
      };
    } catch (error) {
      throw Error('创建room失败' + error);
    }
  }

  public async findAll(query:Room) {
    // console.log('query', query);
    if (!query) {
      const res = await RoomModel.find();
      if (!res.length) {
        return this.roomIsNull;
      }
      const response: ResponseData = {
        message: '查找成功!',
        code: 200,
        data: { roomList: res },
      };
      return response;
    } else {
      const { from } = query;
      const res = await RoomModel.find(query).select('+content');
      if (!res.length) {
        return this.roomIsNull;
      }
      const response: ResponseData = {
        message: '查找成功!',
        code: 200,
        data: { roomList: res },
      };
      return response;
    }
  }

  public async findOne(hid: string) {
    const res = await RoomModel.findOne({ hid }).select('+content');
    if (!res) {
      return this.roomIsNull;
    }
    return { message: '查找成功', code: 200, data: res };
  }

  public async update(roomParam: Room, userInfo: UserInfo) {
    if (roomParam.hid == undefined || null) {
      return this.roomIsNull;
    }
    let { hid, from, createdAt, ...updateParam } = roomParam;
    updateParam.updateAt = new Date();
    const res = await RoomModel.findOneAndUpdate({ hid }, updateParam).select(
      '+content',
    );
    return { message: '修改成功', code: 200, data: res };
  }

  public async delete(hid: string, userInfo: UserInfo) {
    if (hid == undefined || null) {
      return { message: '无房间信息', code: 6000 };
    }
    const res = await RoomModel.findOneAndDelete({
      hid,
    }).select('+content');
    return { message: '删除成功', code: 200, data: res };
  }
}
