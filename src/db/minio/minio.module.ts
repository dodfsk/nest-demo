import { Global, Module,Provider } from "@nestjs/common";
import { MinioService } from './minio.service';

@Global()
@Module({
  providers:[MinioService], 
  exports:[MinioService],
})
export class MinioModule {}
