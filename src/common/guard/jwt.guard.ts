import { CACHE_MANAGER, ExecutionContext, ForbiddenException, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { User, UserModel } from '@/interface/user.interface';
import { Cache } from 'cache-manager';
/**jwt策略 */
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManage:Cache,//注入缓存管理器
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY, //设置secret
      ignoreExpiration: false, //是否忽略过期时间
      passReqToCallback: true,//返回传递token
    } as StrategyOptions);
  }
  /**
   * @descriptionredis redis二级验证,jwt验证通过才会执行
   * 
   */
  async validate(req,payload: any) {
    console.log(`jwt策略被守卫调用一级验证-通过`, payload);
    const user = await UserModel.findById(payload);

    const headersToken:string = req.headers['authorization'].split(' ')[1];
    const redisToken=await this.cacheManage.get<string>(payload._id)
    console.log(
        'redis中的token-',redisToken
    );
    if(headersToken==redisToken){
        console.log('redis缓存通过');
        return user;
    }
    else{
      throw new UnauthorizedException({
        message:'token已失效!',
        meta:'请重新登录',
      });
    }
  }
}
/**jwt守卫 */
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // console.log('context',context.switchToHttp().getResponse());
      return super.canActivate(context);
    }
  
    handleRequest(err, user, info) {
        // console.log('err, user, info',err, user, info);
      if (err || !user) {
        console.log(`redis缓存二级验证-未通过`);
        throw err || new ForbiddenException({
            message : '没有访问权限!',
            meta:'请登录账户',
        });
      }
      return user;
    }
  }
