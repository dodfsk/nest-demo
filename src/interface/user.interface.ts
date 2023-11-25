import { Prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Role } from '@/common/enums/role.enum'
import { nanoid7 } from '@/common/utils/nanoid'
import { useHashSync } from '@/common/utils/hashSync'

export interface ChangePasswordType {
  oldPassword: string
  newPassword: string
}
//数据统计表
export class UserStats {
  @Prop({
    default: 0,
  })
  @ApiProperty({
    description: '关注数',
    example: 0,
  })
  public follows: number

  @Prop({
    default: 0,
  })
  @ApiProperty({
    description: '关注者数量',
    example: 0,
  })
  public fans: number

  @Prop({
    default: 0,
  })
  @ApiProperty({
    description: '发帖数',
    example: 0,
  })
  public rooms: number
}
//用户表结构
//@Prop定义表结构相关
@modelOptions({
  schemaOptions: { collection: 'user' },
}) //固定表名
export class User {
  @Prop({
    required: true,
    unique: true, //code:11000 字段已存在
    immutable: true, //不可改变
    default: () => nanoid7(), //使用nanoid@3.3.4----Last commonJs supported version
  })
  @ApiProperty({
    description: '用户uid',
    example: 'hv000000',
  })
  public uid: string

  @Prop({
    required: true,
    unique: true, //code:11000 字段已存在
  })
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  public username: string

  @Prop({
    required: true,
    select: false, //默认查询中隐藏
    set(val: string) {
      return useHashSync(val)
      //   return val ? hashSync(val, 10) : val
    },
    // set 自定义数据处理，此处用bcrypt进行密码散列加密
    // 每次散列加密的效果不一样
    // 参数1:加密字符串,参数2:加密等级(次数)
  })
  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  public password: string

  @Prop({
    default: () => 'user',
  })
  @ApiPropertyOptional({
    description: '角色权限',
    example: 'root',
  })
  //   public role?: string;
  public role?: Role

  @Prop()
  @ApiPropertyOptional({
    description: '签名',
    example: '1145141919',
  })
  public sign?: string

  @Prop()
  @ApiPropertyOptional({
    description: '性别',
    example: '男',
  })
  public sex?: string

  @Prop()
  @ApiPropertyOptional({
    description: '手机号',
    example: '1145141919',
  })
  public phone?: string

  @Prop()
  @ApiPropertyOptional({
    description: '邮箱地址',
    example: '114514@qq.com',
  })
  public email?: string

  @Prop()
  @ApiPropertyOptional({
    description: '生日',
    example: '114514@qq.com',
  })
  public birth?: Date

  @Prop()
  @ApiPropertyOptional({
    description: '头像地址',
    example: '@oss/user/avatar.png',
  })
  //数据库中存入以@oss前缀的相对地址
  public avatar?: string

  @Prop({
    _id: false,
    type: UserStats,
    default: {},
  })
  @ApiProperty({
    description: '统计表',
    example: '统计各种数据',
  })
  public stats: UserStats

  @Prop({
    default: () => new Date(),
  })
  @ApiProperty({
    description: '注册时间',
    example: Date.now(),
  })
  public createdAt: Date

  @Prop()
  @ApiProperty({
    description: '修改时间',
    example: Date.now(),
  })
  public updatedAt: Date
}

export const UserModel = getModelForClass(User)
