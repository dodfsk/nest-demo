import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MinioModule } from '@/db/minio/minio.module';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: join(__dirname, '../../assets'),
    //     filename: (_req, file, callback) => {
    //       const fileName = `${
    //         new Date().getTime() + extname(file.originalname)
    //       }`;
    //       return callback(null, fileName);
    //     },
    //   }),
    // }),
    // MinioModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
