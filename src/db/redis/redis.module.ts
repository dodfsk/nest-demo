import { CacheModule, CacheStore, Global, Module,Provider } from "@nestjs/common";
import type { RedisClientOptions } from "redis";
import { redisStore } from 'cache-manager-redis-store';

@Global()
@Module({
    imports:[

        CacheModule.register<RedisClientOptions>({
            //module option
            isGlobal:true,
            //  @ts-ignore
            store: async()=>await redisStore({
                socket: {
                    host: 'localhost',
                    port: 6379,
                },
                password:'Aa123456',//--require密码
                ttl: 60 * 60 * 24 ,
            }),//忽略掉3.0.1版本redisStore的类型
        }),//缓存模块 全局

        // CacheModule.register<RedisClientOptions>({
        //     //module option
        //     isGlobal:true,
        //     //store
        //     store: redisStore,
        //     host: 'localhost',
        //     port: 6379,
        //     auth_pass:'Aa123456',//--require密码
        // }),//缓存模块 全局
    ],
    // providers,//providers:providers
    exports:[RedisModule],

})
export class RedisModule {}
