import { UserInfo } from '@/common/decorater/user.decorater';
import { MinioService } from '@/db/minio/minio.service';
import { ResponseData } from '@/interface/common';
import { Injectable, StreamableFile } from '@nestjs/common';

@Injectable()
export class AssetsService {
  constructor(private readonly minioService: MinioService) {}
   //将本地oss预签名的endPoint+端口替换为nginx代理的oss地址
   preSignReplace=(data:string)=>{
    const regStr=`${process.env.ORIGI_OSS_MINIO}`
    const regex=new RegExp(regStr,'g')
    const nginx:string=process.env.NGINX_OSS_MINIO
    return data.replace(regex,nginx)
  }
  
  //后端中转下载-废弃
  async findOne(param) {
    console.log(param);
    const { bucket, user, file } = param; //存储桶名,用户名,文件名
    const isExist = await this.minioService.bucketExists(bucket);
    if (!isExist) {
      this.minioService.makeBucket(bucket);
    }
    const objectName = `${user}/${file}`;
    const res = await this.minioService.getObject(bucket, objectName);
    const buf: any = res as Buffer;
    // const buf64=buf.toString('base64')
    // const base64="data:image/png;base64,"+buf64

    return new StreamableFile(buf);
  }
  //后端中转上传-废弃
  async upload(body, userInfo: UserInfo, file) {
    console.log(file);
    const { bucketName } = body;
    const isExist = await this.minioService.bucketExists(bucketName);
    console.log(bucketName, isExist);
    if (!isExist) {
      this.minioService.makeBucket(bucketName);
    }
    const objectName = `${userInfo.username}/${file.originalname}`;
    const res = await this.minioService.putObject(
      bucketName,
      objectName,
      file.buffer,
      file.size,
    );
    if (!res) {
      return {
        code: 6000,
        message: '上传失败',
        data: {},
      };
    }
    const response: ResponseData = {
      code: 200,
      message: '上传成功',
      data: { url: res },
    };
    return response;
  }

  //预签名直传
  async getUploadUrl(body, userInfo: UserInfo) {
    console.log(body);
    //参数为桶名和文件名
    const { bucketName, fileName } = body;

    const isExist = await this.minioService.bucketExists(bucketName);
    if (!isExist) {
      this.minioService.makeBucket(bucketName);
    }

    const objectName = `${userInfo.username}/${fileName}`;
    const res = await this.minioService.presignedPutObject(
      bucketName,
      objectName,
    );
    console.log(res);
    if (!res) {
      return {
        code: 6000,
        message: '获取上传签名失败',
        data: {},
      };
    }
    const preSignUrl:string=this.preSignReplace(res as string)
    const response: ResponseData = {
      code: 200,
      message: '获取直传url成功',
      data: { url: preSignUrl },
    };
    return response;
  }
  //删除文件
  async removeOne(body, userInfo: UserInfo){
    console.log(body);
    //参数为桶名和文件名
    const { bucketName, fileName } = body;

    const isExist = await this.minioService.bucketExists(bucketName);
    if (!isExist) {
      this.minioService.makeBucket(bucketName);
    }

    const objectName = `${userInfo.username}/${fileName}`;
    const res = await this.minioService.removeObject(
      bucketName,
      objectName,
    );
    console.log(res);
    if (!res) {
      return {
        code: 6000,
        message: '删除失败',
        data: {},
      };
    }

    const response: ResponseData = {
      code: 200,
      message: '删除成功',
      data: {},
    };
    return response;
  }
}
