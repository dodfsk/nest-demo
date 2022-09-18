//自定义环境变量
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

const providers: Provider[] = [
  {
    provide: 'CONFIG',
    useValue: {
        TZ: 'Asia/Shanghai',
        MONGO_DB: 'mongodb://localhost:27017/hmmm',
        SECRET_KEY: 'JWT_TEST_KEY',
        JWT_TIMEOUT: '72000s',
    },
  },
];
// interface Options {
//   default: string;
//   test: string;
// }
@Global()
@Module({
  providers,
  exports: providers,
})
export class ConfigModule {
//   static forRoot(options: Options): DynamicModule {
//     return {
//       module: ConfigModule,
//       providers,
//     };
//   }
}
