import { UserInfo } from '@/common/decorater/user.decorater';
import { MinioService } from '@/db/minio/minio.service';
import { Injectable } from '@nestjs/common';
import { Blob } from 'buffer';

@Injectable()
export class UploadService {
    constructor(private readonly minioService:MinioService){}

async create(body,file,userInfo:UserInfo) {
    console.log(file);
    const { bucketName }=body
    const isExist=await this.minioService.bucketExists(bucketName)
    console.log(bucketName,isExist);
    if(!isExist){
        this.minioService.makeBucket(bucketName)
    }
    const objectName=`${userInfo.username}/${file.originalname}`
    const res=this.minioService.putObject(bucketName,objectName,file.buffer,file.size)
    return res;
  }

  async findAll() {
    // this.minioService.init()
    const res=await this.minioService.makeBucket('test2')
    return res;
  }

  async findOne(body,userInfo:UserInfo) {
    console.log(body);
    
    const { bucketName }=body
    // const isExist=await this.minioService.bucketExists(bucketName)
    // if(!isExist){
    //     this.minioService.makeBucket(bucketName)
    // }
    const objectName=`${userInfo.username}/${body.objectName}`
    const res=await this.minioService.getObject(bucketName,objectName)
    const buf:any=res as Buffer
    // const abuf=Uint8Array.from(buf).buffer;
    // const binbuf=Buffer.from(buf,'binary')

    console.log('buf',buf.buffer);
    // const length=buf.length
    // const buffer=new ArrayBuffer(length)
    // const view=new Uint8Array(buffer)
    // for(let i=0;i<length;i++){
    //     view[i]=buf.data[i]
    // }

    const blob=new Blob([buf.buffer])
    console.log(buf);
    console.log(res,blob);

    return blob;
  }

  update(id: number, updateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
