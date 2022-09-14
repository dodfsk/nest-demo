import { Controller,Get,Post,HttpCode,Param,Query,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from '@/common/guard/local.guard';
import { UserInfo } from '@/common/decorater/user.decorater';
import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { Public } from '@/common/decorater/public.decorater';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiOperation({
    summary: "用户登录",
  })
  async login(@UserInfo() userInfo) {
    const {token}=userInfo//local守卫验证后的结果
    return await this.authService.login(token);
  }

  @Get('isLogin')
  @ApiBearerAuth()
  async findOne() {
    return await this.authService.isLogin();
  }

}
