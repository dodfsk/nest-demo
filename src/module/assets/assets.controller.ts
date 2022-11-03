import {
  Get,
  Res,
  Body,
  Controller,
  HttpCode,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { Public } from '@/common/decorater/public.decorater'
import { AssetsService } from './assets.service'
import { createReadStream } from 'fs'
import * as mime from 'mime'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserInfo } from '@/common/decorater/user.decorater'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/common/decorater/roles.decorater'
import { RolesGuard } from '@/common/guard/roles.guard'

@Controller('assets')
@ApiTags('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}
  //   @Get(':bucket/:user/:file')//后端中转下载-废弃
  //   @Public()
  //   @HttpCode(200)
  //   getFile(@Param() param, @Res({ passthrough: true }) res) {
  //     //将passthrough参数设置为true时,处理逻辑留给框架，
  //     const suffix: string = param.file.split('.')[1];
  //     const mimeType = mime.getType(suffix); //根据后缀识别mime类型
  //     console.log(suffix, mimeType);
  //     res.set({
  //       'Content-Type': `${mimeType}`, //设置mime内容类型
  //       // 'Content-Disposition': 'inline; filename='+param.file,
  //     });
  //     return this.assetsService.findOne(param);
  //   }

  //   @Post('upload')//后端中转上传-废弃
  //   @HttpCode(200)
  //   @UseInterceptors(FileInterceptor('file'))
  //   upload(@Body() body, @UserInfo() userInfo, @UploadedFile() file) {
  //     return this.assetsService.upload(body, userInfo, file);
  //   }
  /////////////////////////////////////////////////
  @Post('upload/getUrl')
  @HttpCode(200)
//   @Roles('root')
//   @UseGuards(RolesGuard)
  getPreSignedUrl(@Body() body, @UserInfo() userInfo) {
    return this.assetsService.getPreSignedUrl(body, userInfo)
  }

  @Delete('delete')
  @HttpCode(200)
//   @Roles('root')
//   @UseGuards(RolesGuard)
  removeFile(@Body() body, @UserInfo() userInfo) {
    return this.assetsService.removeOne(body, userInfo)
  } //需要新增带鉴权的接口
}
