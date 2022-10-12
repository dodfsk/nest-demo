import { Controller,Get,Post,Body,Req, HttpCode, Patch, Param, Delete, Query,UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from './user.service';
import { User } from "@/interface/user.interface";
import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { UserInfo } from '@/common/decorater/user.decorater';
import { Public } from '@/common/decorater/public.decorater';
import { RolesGuard } from '@/common/guard/roles.guard';
import { Roles } from '@/common/decorater/roles.decorater';

@Controller('user')
@ApiTags("用户模块")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(200)
  @Public()
  @ApiOperation({
    summary: "用户注册",
  })
  async register(@Body() userParam: User) {
    return await this.userService.register(userParam);
  }

  @Get(':id')
  @HttpCode(200)
//   @Roles('root')
//   @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') uname: string,@UserInfo() userInfo:User) {
    return await this.userService.findOne(uname);
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles('root')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "用户修改",
  })
  async update(@Param('id') uname: string,@Body()  userParam: User) {
    return await this.userService.update(uname,userParam);
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles('root')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "销毁账号",
  })
  async remove(@Param('id') uname: string) {
    return await this.userService.remove(uname);
  }

}
