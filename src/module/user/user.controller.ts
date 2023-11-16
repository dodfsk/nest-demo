import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpCode,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { ChangePasswordType, User } from '@/interface/user.interface'
// import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { UserInfo } from '@/common/decorater/user.decorater'
import { Public } from '@/common/decorater/public.decorater'
import { RolesGuard } from '@/common/guard/roles.guard'
import { Roles } from '@/common/decorater/roles.decorater'

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(200)
  @Public()
  @ApiOperation({
    summary: '用户注册',
  })
  async register(@Body() userParam: User) {
    return await this.userService.register(userParam)
  }
  @Post('changePassword')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '修改我的密码',
  })
  async changePassword(
    @Body() param: ChangePasswordType,
    @UserInfo() userInfo: UserInfo,
  ) {
    return await this.userService.changePassword(param, userInfo)
  }

  @Post('findMyself')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '查找我的信息',
  })
  async findMyself(@UserInfo() userInfo: UserInfo) {
    return await this.userService.findMyself(userInfo)
  }

  @Post('updateMyself')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '修改我的信息',
  })
  async updateMyself(@Body() userParam: User, @UserInfo() userInfo: UserInfo) {
    return await this.userService.updateMyself(userParam, userInfo)
  }

  @Post('removeMyself')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '销毁我的账号',
  })
  async removeMyself(@UserInfo() userInfo: UserInfo) {
    return await this.userService.removeMyself(userInfo)
  }

  @Get(':id')
  @HttpCode(200)
  //   @Roles('root')
  //   @UseGuards(RolesGuard)
  //   @ApiBearerAuth()
  async findOne(@Param('id') uid: string, @UserInfo() userInfo: UserInfo) {
    return await this.userService.findOne(uid)
  }

  ///////////////////////////
  //---以下为root权限接口---//
  //////////////////////////
  @Get()
  @HttpCode(200)
  @Roles('root')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'ROOT:获取全部用户信息',
  })
  async findAll(@Query() query) {
    return await this.userService.findAll(query)
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles('root')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'ROOT:用户修改',
  })
  async update(@Param('id') uid: string, @Body() userParam: User) {
    return await this.userService.update(uid, userParam)
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles('root')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'ROOT:账号销毁',
  })
  async remove(@Param('id') uid: string) {
    return await this.userService.remove(uid)
  }
}
