import { Injectable } from '@nestjs/common';
import { User, UserModel } from "@/interface/user.interface";
import { DocumentType } from '@typegoose/typegoose';
import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
  constructor(
    private jwtService:JwtService,//注入jwtService
    // private configService:ConfigService//configService
    ) {}

  //@Header('Cache-Control', 'none')
  public async login(userParam:DocumentType<User>){
    const {username,password}= userParam
    // bcrypt.compareSync(password,)
    // const res=await UserModel
    // .findOne({
    //     username,
    //     password
    // })
    // .select('+password')
    // const payload=String(userParam._id)
    const payload={_id:String(userParam._id)}
    const token=this.jwtService.sign(payload)
    // console.log(process.env.SECRET_KEY,this.configService.get<string>('SECRET_KEY'));
    
    // validate
        return {
            message:'登录成功',
            meta:'账户验证通过',
            status:'200',
            data:{
                token
            }
        }

  }

  public async register(userParam: User) {
    const { username }= userParam
    const res=await UserModel
    .findOne({
        username,
    })
    // validate
    if (res) {
        //   console.log("该用户已注册");
          return { 
			message:'该用户已注册!',
			meta:'请修改用户名',
			status:'6000',
            data:null
		  };
    }
    else {
        try {
        //   const password=bcrypt.hashSync(userParam.password, 10)
          const createUser = new UserModel(userParam);
          //save user
		  createUser.save()
          return {
            message:'注册成功!',
			status:'200',
            data:null
		  };
        } catch (error) {
            throw Error("存入数据库失败" + error);
        }
    }

  }

//   public async update(userParam:User){
//     const res=await this.userModel
//     .findOne({
//         username: userParam.username,
//         password: userParam.password
//     })
//     // validate
//     if(res){
//         return {
//             message:'登录成功',
//             status:'200',
//             data:{
//                 ...userParam
//             }
//         }
//     }
//     else{

//         return {
//             message:'登录失败!',
//             meta:'账号或密码错误',
//             status:'6000',
//             data:null
//         }
//     }
//   }

//   public async delete(userParam:User){
//     const res=await this.userModel
//     .findOne({
//         username: userParam.username,
//         password: userParam.password
//     })
//     // validate
//     if(res){
//         return {
//             message:'登录成功',
//             status:'200',
//             data:{
//                 ...userParam
//             }
//         }
//     }
//     else{

//         return {
//             message:'登录失败!',
//             meta:'账号或密码错误',
//             status:'6000',
//             data:null
//         }
//     }
//   }

  public async findAll(username:string) {
    const res=await UserModel.find()
    return res;
  }

  public async findOne(username: string) {
    const res=await UserModel
        .findOne({
            username
        })
    if(res){
        return res;
    }
    else{
        return {message:'无用户信息',status:'6000',};
    }
  }

  public async update(userInfo:User) {
    if(userInfo.username==undefined||null){
        return {message:'无用户信息',status:'6000',};
    }
    const res=await UserModel
        .findOneAndUpdate({
            username:userInfo.username
        },userInfo)
    return res;
  }

  public async remove(username: string) {
    if(username==undefined){
        return {message:'无用户信息',status:'6000',};
    }
    const res=await UserModel
        .findOneAndDelete({
            username
        })
    return res;
  }

}
