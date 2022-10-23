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
} from '@nestjs/common';
import { Public } from '@/common/decorater/public.decorater';
import { AssetsService } from './assets.service';
import { createReadStream } from 'fs';
import * as mime from 'mime';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserInfo } from '@/common/decorater/user.decorater';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get(':bucket/:user/:file')
  @Public()
  @HttpCode(200)
  getFile(@Param() param, @Res({ passthrough: true }) res) {
    //将passthrough参数设置为true时,处理逻辑留给框架，
    const suffix: string = param.file.split('.')[1];
    const mimeType = mime.getType(suffix); //根据后缀识别mime类型
    console.log(suffix, mimeType);
    res.set({
      'Content-Type': `${mimeType}`, //设置mime内容类型
      // 'Content-Disposition': 'inline; filename='+param.file,
    });
    return this.assetsService.findOne(param);
  }

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  upload(@Body() body, @UserInfo() userInfo, @UploadedFile() file) {
    return this.assetsService.upload(body, userInfo, file);
  }

  @Post('upload/getUrl')
  @HttpCode(200)
  getUploadUrl(@Body() body, @UserInfo() userInfo) {
    return this.assetsService.getUploadUrl(body, userInfo);
  }

  @Delete('delete')
  removeFile(@Body() body, @UserInfo() userInfo) {
    return this.assetsService.removeOne(body, userInfo);
  }
}
