import {
  Controller,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@/common/decorater/public.decorater';
import { UserInfo } from '@/common/decorater/user.decorater';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

@Post()
@HttpCode(200)
@UseInterceptors(FileInterceptor('file'))
upload(@Body() body,@UserInfo() userInfo,@UploadedFile() file) {
    return this.uploadService.upload(body,userInfo,file);
}

@Post('getUrl')
@HttpCode(200)
  getUploadUrl(@Body() body,@UserInfo() userInfo) {
  return this.uploadService.getUploadUrl(body,userInfo);
}

}
