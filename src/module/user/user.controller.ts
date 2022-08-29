import { Controller,Get,Post,Body,Req, HttpCode, Patch, Param, Delete, Query,UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from './user.service';
import { User } from "@/interface/user.interface";
import { LocalAuthGuard } from '@/common/guard/local.guard';
import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { UserInfo } from '@/common/decorater/user.decorater';

@Controller('user')
@ApiTags("用户模块")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: "用户登录",
  })
  async login(@Req() req) {
    const {token}=req.user//local守卫验证后的结果
    return await this.userService.login(token);
  }
//   async login(@Body( ) userInfo:User) {    
//     return await this.userService.login(userInfo);
//   }

  @Post('register')
  @HttpCode(200)
  @ApiOperation({
    summary: "用户注册",
  })
  async register(@Body() userInfo: User) {
    return await this.userService.register(userInfo);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') username: string,@UserInfo() userInfo:User) {
    return await this.userService.findOne(username);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: "用户修改",
  })
  async update(@Body()  userInfo: User) {
    return await this.userService.update(userInfo);
  }

  @Delete(':id')
  async remove(@Param('id') username: string) {
    return await this.userService.remove(username);
  }

}
