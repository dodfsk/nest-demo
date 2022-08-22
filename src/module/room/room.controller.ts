import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoomService } from './room.service';
import { Room, RoomModel } from "@/interface/room.interface";

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(@Body() roomParam: Room) {
    return await this.roomService.create(roomParam);
  }

  @Get()
  async findAll() {
    return await this.roomService.findAll();
  }

  @Get(':id')
  async findOne(@Param('hid') hid: string) {
    return await this.roomService.findOne(hid);
  }

  @Patch(':id')
  async update(@Body() roomData: Room) {
    return await this.roomService.update(roomData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.roomService.remove(id);
  }
}
