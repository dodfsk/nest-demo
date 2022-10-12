import { Prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { hashSync } from 'bcryptjs';
import { Role } from '@/common/enums/role.enum';

//用户表结构
//@Prop定义表结构相关

@modelOptions({
  schemaOptions: { collection: 'user' },
}) //固定表名
export class User {
  @Prop({
    required: true,
    unique: true, //code:11000 字段已存在
  })
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  public username: string;

  @Prop({
    required: true,
    select: false, //默认查询中隐藏
    set(val: string) {
      return val ? hashSync(val, 10) : val;
    },
    // set 自定义数据处理，此处用bcrypt进行密码散列加密
    // 每次散列加密的效果不一样
    // 参数1:加密字符串,参数2:加密等级(次数)
  })
  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  public password: string;

  @Prop({
    default:()=>'user'
  })
  @ApiPropertyOptional({
    description: '角色权限',
    example: 'root',
  })
//   public role?: string;
  public role?: Role;

  @Prop()
  @ApiPropertyOptional({
    description: '手机号',
    example: '1145141919',
  })
  public phone?: string;

  @Prop()
  @ApiPropertyOptional({
    description: '邮箱地址',
    example: '114514@qq.com',
  })
  public email?: string;

  @Prop()
  @ApiPropertyOptional({
    description: '生日',
    example: '114514@qq.com',
  })
  public birth?: Date;

  @Prop()
  @ApiPropertyOptional({
    description: '头像地址',
    example: 'oss/user/avatar.png',
  })
  public avatar?: string;

  @Prop({
    default:()=>new Date()
  })
  @ApiProperty({
    description: '注册时间',
    example: Date.now(),
  })
  public createdAt: Date;

  @Prop()
  @ApiProperty({
    description: '修改时间',
    example: Date.now(),
  })
  public updateAt: Date;
}

export const UserModel = getModelForClass(User);
