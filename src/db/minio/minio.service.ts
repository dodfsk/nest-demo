import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Client, ClientOptions } from 'minio';

@Injectable()
export class MinioService {
  options: ClientOptions;
  minioClient: Client;
  constructor(private readonly config: ConfigService) {
    this.init();
  }

  init() {
    this.minioClient = new Minio.Client({
      ...this.options,
      endPoint: this.config.get<string>('MINIO_END_POINT'),
      //   endPoint: '127.0.0.1',
      accessKey: 'root',
      secretKey: 'Aa123456',
      port: 9000,
      useSSL: false,
      // region?: Region | undefined,
      // transport?: any,
      // sessionToken?: string | undefined,
      // partSize?: number | undefined,
      // pathStyle?: boolean | undefined,
    });
  }

  bucketExists(bucketName: string) {
    //如果存储桶存在的话err就是null，否则err.code是NoSuchBucket
    return new Promise((resolve, reject) => {
      this.minioClient.bucketExists(bucketName).then((res) => {
        console.log(res);

        resolve(res);
      });
    });
  }
  makeBucket(bucketName: string) {
    return new Promise((resolve, reject) => {
      this.minioClient.makeBucket(bucketName, 'cn-north-1', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(`${bucketName}, cn-north-1`);
        }
      });
    });
  }
  putObject(bucketName: string, objectName: string, fileStream, size: number) {
    return new Promise((resolve, reject) => {
      this.minioClient.putObject(
        bucketName,
        objectName,
        fileStream,
        size,
        (err, etag) => {
          if (err) {
            reject(err);
            // return console.log(err, etag); // err should be null
          }
          resolve(etag);
        },
      );
    });
  }
  getObject(bucketName: string, objectName: string) {
    return new Promise((resolve, reject) => {
      this.minioClient.getObject(
        bucketName,
        objectName,
        function (err, dataStream) {
          if (err) {
            reject(err);
          }
          let size = 0;
          let arraybuffer = new Array();
          dataStream.on('data', function (chunk) {
            size += chunk.length;
            arraybuffer.push(chunk);
          });
          dataStream.on('end', function () {
            console.log('End. Total size = ' + size);
            const buffer = Buffer.concat(arraybuffer, size);
            //Buffer.concat()合并缓冲区对象
            resolve(buffer);
          });
          dataStream.on('error', function (err) {
            console.log(err);
            reject(err);
          });
        },
      );
    });
  }
  presignedPutObject(bucketName: string, objectName: string) {
    const expiry = 24 * 60 * 60;
    return new Promise((resolve, reject) => {
    this.minioClient.presignedPutObject(
        bucketName,
        objectName,
        expiry,
        (err, presignedUrl) => {
          if (err) {
            // return err
            reject(err);
          }
        //   return presignedUrl
          resolve(presignedUrl);
        },
      );
    });
  }
  removeObject(bucketName: string, objectName: string){
    return new Promise((resolve, reject) => {
        this.minioClient.removeObject(bucketName, objectName, function(err) {
        if (err) {
            reject(err)
        }
            resolve('删除成功')
      })
    })
  }
}
