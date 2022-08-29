import { createParamDecorator,ExecutionContext } from "@nestjs/common";
import { User } from "@/interface/user.interface";
import { DocumentType } from "@typegoose/typegoose";
//Request自定义装饰器

export type UserInfo=DocumentType<User>

export const UserInfo=createParamDecorator(
    (data:string,ctx:ExecutionContext)=>{
        const request=ctx.switchToHttp().getRequest()
        const user:UserInfo= request.user;

        return data?(user?.[data]):user
    }
)