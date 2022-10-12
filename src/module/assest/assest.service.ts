import { MinioService } from '@/db/minio/minio.service';
import { Injectable, StreamableFile } from '@nestjs/common';

@Injectable()
export class AssestService {
    constructor(private readonly minioService:MinioService){}

    async findOne(param) {
        console.log(param);
        const { bucket,user,file }=param//存储桶名,用户名,文件名
        const isExist=await this.minioService.bucketExists(bucket)
        if(!isExist){
            this.minioService.makeBucket(bucket)
        }
        const objectName=`${user}/${file}`
        const res=await this.minioService.getObject(bucket,objectName)
        const buf:any=res as Buffer
        // const buf64=buf.toString('base64')
        // const base64="data:image/png;base64,"+buf64
        
        return new StreamableFile(buf);

      }
}
