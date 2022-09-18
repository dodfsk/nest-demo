import { MinioService } from '@/db/minio/minio.service';
import { Injectable, StreamableFile } from '@nestjs/common';

@Injectable()
export class AssestService {
    constructor(private readonly minioService:MinioService){}

    async findOne(param) {
        console.log(param);
        
        const isExist=await this.minioService.bucketExists('picture')
        if(!isExist){
            this.minioService.makeBucket('picture')
        }
        const objectName=`${param.user}/${param.file}`
        const res=await this.minioService.getObject('picture',objectName)
        const buf:any=res as Buffer
        // const buf64=buf.toString('base64')
        // const base64="data:image/png;base64,"+buf64
        
        return new StreamableFile(buf);

      }
}
