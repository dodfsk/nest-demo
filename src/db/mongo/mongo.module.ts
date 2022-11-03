import { Global, Module,Provider } from "@nestjs/common";
import { mongoose } from "@typegoose/typegoose";
import { ConfigService } from '@nestjs/config';

const providers:Provider[]=[
    {
        inject: [ConfigService], //注入configService
        provide:'MONGO_CONNECTION',
        useFactory: (config: ConfigService) => mongoose.connect(config.get<string>('MONGO_DB'))
    },
]

@Global()
@Module({
    providers,//providers:providers
    exports:providers,

})
export class MongoModule {}
