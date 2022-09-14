import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@/interface/common';
import { ROLES_KEY } from '@/common/decorater/roles.decorater';
import { User } from "@/interface/user.interface";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user,body }:{user:User,body:any} = context.switchToHttp().getRequest();
    // console.log(user,body)

    const userOwn=user.username==body.username
    const roomOwn=user.username==body.from

    const isOwn=userOwn||roomOwn
    const isAuthorization=requiredRoles.includes(user.role)
    // const isAuthorization=requiredRoles.some((role) => {user.role?.includes(role)});
    console.log('isOwn,isAllowed',isOwn,isAuthorization);
    const isAllowed=isOwn||isAuthorization
    if(isAllowed){
        return true
    }
    else{
        throw new ForbiddenException({
            message : '没有权限!',
            meta:'请登录管理员账户',
        });
    }
  }

}
