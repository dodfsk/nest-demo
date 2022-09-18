import { CacheModule, Global, Module,Provider } from "@nestjs/common";
import * as redisStore from 'cache-manager-redis-store';


@Global()
@Module({
    imports:[
        CacheModule.register({
            //module option
            isGlobal:true,
            //store
            store: redisStore,
            host: 'localhost',
            port: 6379,
            // auth_pass:1,
        }),//缓存模块 全局
    ],
    // providers,//providers:providers
    exports:[RedisModule],

})
export class RedisModule {}
