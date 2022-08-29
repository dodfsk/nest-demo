import { Global, Module,Provider } from "@nestjs/common";
import { mongoose } from "@typegoose/typegoose";

const providers:Provider[]=[
    {
        provide:'DB_CONNECTION',
        useFactory: () => mongoose.connect(process.env.DB),
    },
]

@Global()
@Module({
    providers,//providers:providers
    exports:providers,

})
export class DbModule {}
