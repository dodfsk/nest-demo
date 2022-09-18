import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@/common/decorater/public.decorater';
import { UserInfo } from '@/common/decorater/user.decorater';

@Controller('assest')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() body,@UserInfo() userInfo,@UploadedFile() file) {
    return this.uploadService.create(body,file,userInfo);
  }

//   @Get()
//   @Public()
//   findAll() {
//     return this.uploadService.findAll();
//   }

//   @Get(':id')
//   @Public()
//   findOne(@Param('id') id: string,@Body() body,@UserInfo() userInfo) {
//     return this.uploadService.findOne(body,userInfo);
//   }
@Post('download')
@HttpCode(200)
  findOne(@Body() body,@UserInfo() userInfo) {
  return this.uploadService.findOne(body,userInfo);
}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
