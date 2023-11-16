import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RoomService } from './room.service'
import { Room, RoomModel } from '@/interface/room.interface'
// import { JwtAuthGuard } from '@/common/guard/jwt.guard'
import { UserInfo } from '@/common/decorater/user.decorater'
import { Roles } from '@/common/decorater/roles.decorater'
import { RolesGuard } from '@/common/guard/roles.guard'
import { Public } from '@/common/decorater/public.decorater'

@Controller('room')
@ApiTags('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '创建帖子',
  })
  async create(@Body() roomParam: Room, @UserInfo() userInfo: UserInfo) {
    return await this.roomService.create(roomParam, userInfo)
  }

  @Get()
  @HttpCode(200)
  @Public()
  @ApiOperation({
    summary: '获取帖子列表',
  })
  async findList(@Query() query) {
    return await this.roomService.findList(query)
  }

  @Post('getMyList')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取用户发布列表',
  })
  async findMyList(@Body() roomParam: Room, @UserInfo() userInfo: UserInfo) {
    return await this.roomService.findMyList(roomParam, userInfo)
  }

  @Get(':id')
  @HttpCode(200)
  @Public()
  @ApiOperation({
    summary: '获取帖子详情',
  })
  async findOne(@Param('id') id: string) {
    return await this.roomService.findOne(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '更新帖子内容',
  })
  async update(
    @Param('id') id: string,
    @Body() roomData: Room,
    @UserInfo() userInfo: UserInfo,
  ) {
    return await this.roomService.update(id, roomData, userInfo)
  }

  @Patch('updateStatus/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '修改帖子状态',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() roomData: Room,
    @UserInfo() userInfo: UserInfo,
  ) {
    return await this.roomService.updateStatus(id, roomData, userInfo)
  }

  @Delete(':id')
  @HttpCode(200)
  //   @Roles('root')
  //   @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '删除帖子',
  })
  async delete(@Param('id') id: string, @UserInfo() userInfo: UserInfo) {
    return await this.roomService.remove(id, userInfo)
  }

  @Get()
  @HttpCode(200)
  @Roles('root')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'ROOT:获取帖子列表',
  })
  async findAll(@Query() query, @UserInfo() userInfo: UserInfo) {
    return await this.roomService.findAll(query, userInfo)
  }
}
