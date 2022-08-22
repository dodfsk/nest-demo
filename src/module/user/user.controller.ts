import { Controller,Get,Post,Body,Req, HttpCode, Patch, Param, Delete, Query,UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from './user.service';
import { User } from "@/interface/user.interface";
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags("用户模块")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: "用户登录",
  })
  async login(@Req() req) {
    const userInfo=req.user//local守卫验证后的结果
    console.log(userInfo);
    return await this.userService.login(userInfo);
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


  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findAll(@Query('id') username?: string) {
    if(username!=undefined){
        return await this.userService.findOne(username);
    }
    return await this.userService.findAll(username);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findOne(@Param('id') username: string) {
    return await this.userService.findOne(username);
  }

  @Patch()
  @HttpCode(200)
  @ApiOperation({
    summary: "用户修改",
  })
  async update(@Body()  userInfo: User) {
    return await this.userService.update(userInfo);
  }

  @Delete()
  async delete(@Query('id') username: string) {
    return await this.userService.remove(username);
  }

  @Delete(':id')
  async remove(@Param('id') username: string) {
    return await this.userService.remove(username);
  }

}
