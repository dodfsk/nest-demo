import {
  Prop,
  getModelForClass,
  modelOptions,
  Severity,
  Ref,
} from '@typegoose/typegoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { nanoid10 } from '@/common/utils/nanoid'
import { User } from './user.interface'

//资源表结构
export class AssetsList {
  @Prop({ required: true })
  @ApiProperty({
    description: '文件路径',
    example: '文件路径',
  })
  public url: string

  @Prop({ required: true })
  @ApiProperty({
    description: '内容',
    example: '文件名',
  })
  public fileName: string
}
//数据统计表
export class RoomStats {
  @Prop({
    default: 0,
  })
  @ApiProperty({
    description: '点赞数',
    example: 0,
  })
  public like: number

  @Prop({
    default: 0,
  })
  @ApiProperty({
    description: '查看数',
    example: 0,
  })
  public view: number

  @Prop({
    default: 0,
  })
  @ApiProperty({
    description: '总回复数',
    example: 0,
  })//每次被回复+1,并且当时的总回复数为该条回复的楼层数
  public reply: number
}

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { collection: 'room' },
})
export class Room {
  @Prop({
    required: true,
    unique: true, //code:11000 字段已存在
    immutable: true,//不可改变
    default: () => nanoid10(), //使用nanoid@3.3.4----Last commonJs supported version
  })
  @ApiProperty({
    description: 'hv号',
    example: 'hv000000',
  })
  public hid: string

  @Prop({
    required: true,
    ref: () => User,
  })
  @ApiPropertyOptional({
    description: '发布者信息',
    example: 'admin',
  })
  public from: Ref<User>

  @Prop()
  @ApiProperty({
    description: '标题',
    example: '这是一个title标题',
  })
  public title: string

  @Prop({
    select: false, //默认查询中隐藏
  })
  @ApiProperty({
    description: '内容',
    example: '存放富文本字符串',
  })
  public content: string

  @Prop()
  @ApiPropertyOptional({
    description: '简介',
    example: '这是一个简介',
  })
  public intro?: string

  @Prop()
  @ApiPropertyOptional({
    description: '封面',
    example: '存放封面图片地址',
  })
  public cover?: string

  @Prop({
    select: false,
    default:()=>[]
  })
  @ApiPropertyOptional({
    description: '静态资源地址',
    example: '存放静态资源相关数据',
  })
  public assets?: AssetsList[]

  @Prop({
    _id: false,
    type: RoomStats,
    default: {},
  })
  @ApiPropertyOptional({
    description: '统计表',
    example: '统计各种数据',
  })
  public stats: RoomStats

  @Prop({
    default: 0,
  })
  @ApiPropertyOptional({
    description: '状态:0草稿 1待审核 2已发布 3已删除',
    example: '0',
  })
  public status: number


  @Prop({
    default: () => new Date(),
  })
  @ApiPropertyOptional({
    description: '创建时间',
    example: '2022-08-14',
  })
  public createdAt: Date

  @Prop()
  @ApiPropertyOptional({
    description: '更新时间',
    example: '2022-08-14',
  })
  public updatedAt?: Date
}

export const RoomModel = getModelForClass(Room)

