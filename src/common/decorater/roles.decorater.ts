import { createParamDecorator,ExecutionContext } from "@nestjs/common";
import { User } from "@/interface/user.interface";
import { DocumentType } from "@typegoose/typegoose";
//自定义装饰器

import { SetMetadata } from '@nestjs/common';
import { Role } from '@/interface/common';

// export type UserInfo=DocumentType<User>

// export const UserInfo=createParamDecorator(
//     (data:string,ctx:ExecutionContext)=>{
//         const request=ctx.switchToHttp().getRequest()
//         const user:UserInfo= request.user;

//         return data?(user?.[data]):user
//     }
// )


export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
