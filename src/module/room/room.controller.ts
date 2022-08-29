import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoomService } from './room.service';
import { Room, RoomModel } from "@/interface/room.interface";
import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { UserInfo } from '@/common/decorater/user.decorater';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async create(@Body() roomParam: Room,@UserInfo() userInfo:UserInfo) {
    return await this.roomService.create(roomParam,userInfo);
  }

  @Get()
  @HttpCode(200)
  async findAll() {
    return await this.roomService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
	
    return await this.roomService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async update(@Body() roomData: Room,@UserInfo() userInfo:UserInfo) {
    return await this.roomService.update(roomData,userInfo);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string,@UserInfo() userInfo:UserInfo) {
    return await this.roomService.remove(id,userInfo);
  }
}
