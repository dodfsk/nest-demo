import { Global, Module,Provider } from "@nestjs/common";
import { mongoose } from "@typegoose/typegoose";

const providers:Provider[]=[
    {
        provide:'MONGO_CONNECTION',
        useFactory: () => mongoose.connect(process.env.MONGO_DB)
    },
]

@Global()
@Module({
    providers,//providers:providers
    exports:providers,

})
export class MongoModule {}
