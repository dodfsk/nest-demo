import { Controller, Get, Post, Body, Patch, Param,Query, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoomService } from './room.service';
import { Room, RoomModel } from "@/interface/room.interface";
import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { UserInfo } from '@/common/decorater/user.decorater';
import { Roles } from '@/common/decorater/roles.decorater';
import { RolesGuard } from '@/common/guard/roles.guard';
import { Public } from '@/common/decorater/public.decorater';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() roomParam: Room,@UserInfo() userInfo:UserInfo) {
    return await this.roomService.create(roomParam,userInfo);
  }

  @Get()
  @HttpCode(200)
  @Public()
  async findAll(@Query() query) {
    return await this.roomService.findAll(query);
  }

  @Get(':id')
  @HttpCode(200)
  @Public()
  async findOne(@Param('id') id: string) {
	
    return await this.roomService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles('root')
  @UseGuards(RolesGuard)
  async update(@Body() roomData: Room,@UserInfo() userInfo:UserInfo) {
    return await this.roomService.update(roomData,userInfo);
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles('root')
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string,@UserInfo() userInfo:UserInfo) {
    return await this.roomService.delete(id,userInfo);
  }
}
