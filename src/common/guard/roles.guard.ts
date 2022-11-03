import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@/interface/common';
import { ROLES_KEY } from '@/common/decorater/roles.decorater';
import { UserInfo } from '@/common/decorater/user.decorater'

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
    
    const { user,body }:{user:UserInfo,body:any} = context.switchToHttp().getRequest();
    console.log(user,body)

    // const isOwn=user._id==body.from._id////无法保证body中_id的有效性,待修改----已废弃

    const isAuthorization=requiredRoles.includes(user.role)
    // const isAuthorization=requiredRoles.some((role) => {user.role?.includes(role)});
    console.log('roles守卫状态-isAllowed',isAuthorization);
    const isAllowed=isAuthorization
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
