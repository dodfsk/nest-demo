import { Get,Body, Controller, HttpCode, Post, Param, Query, Res } from '@nestjs/common';
import { Public } from '@/common/decorater/public.decorater';
import { AssestService } from './assest.service';
import { createReadStream } from 'fs';
import * as mime from 'mime'

@Controller('assest')
export class AssestController {
  constructor(private readonly assestService: AssestService) {}

  @Get('picture/:user/:file')
  @Public()
  @HttpCode(200)
  getFile(@Param() param,@Res({passthrough:true}) res) {
    //将passthrough参数设置为true时,处理逻辑留给框架，
    const suffix:string=param.file.split('.')[1]
    const mimeType=mime.getType(suffix)//根据后缀识别mime类型
    console.log(suffix,mimeType);
    res.set({
        'Content-Type': `${mimeType}`,//设置mime内容类型
        // 'Content-Disposition': 'inline; filename='+param.file,
        });
    return this.assestService.findOne(param);
}


}
