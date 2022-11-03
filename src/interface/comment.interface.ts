import {
  Prop,
  Ref,
  getModelForClass,
  Severity,
  modelOptions,
} from '@typegoose/typegoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { User } from './user.interface'
import { AssetsList } from './room.interface'
//评论表结构

//二级评论区-废弃
export class Reply {
  @Prop({
    required: true,
    ref: () => User,
  })
  @ApiProperty({
    description: '发布者',
    example: 'admin',
  })
  public from: Ref<User>

  @Prop({ required: true })
  @ApiProperty({
    description: '内容',
    example: '这是二级评论内容',
  })
  public content: string

  @Prop({
    ref: () => User,
  })
  @ApiProperty({
    description: '回复给_id',
    example: 'admin',
  })
  public replyTo?: Ref<User>

  @Prop({
    default: () => new Date(),
  })
  @ApiProperty({
    description: '发布时间',
    example: '2022-08-14',
  })
  public createdAt?: Date

  @Prop()
  @ApiProperty({
    description: '更新时间',
    example: '2022-08-14',
  })
  public updatedAt?: Date
}
//数据统计表
export class CommentStats {
  @Prop({
    default: 0,
  })
  @ApiProperty({
    description: '点赞数',
    example: 0,
  })
  public like: number

}

//一级评论区
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { collection: 'comment' },
})
export class Comment {
  @Prop({ required: true })
  @ApiProperty({
    description: '关联主楼的id',
    example: '5FVl5gixDs',
  })
  public oid: string

  @Prop({ required: true })
  @ApiProperty({
    description: '内容',
    example: '这是评论内容',
  })
  public content: string

  @Prop({
    required: true,
    ref: () => User,
  })
  @ApiProperty({
    description: '发布者',
    example: 'admin',
  })
  public from: Ref<User>

  @Prop()
  @ApiProperty({
    description: '楼层',
    example: '#1',
  })
  public floor?: number

  @Prop({
    default: () => new Date(),
  })
  @ApiProperty({
    description: '发布时间',
    example: '2022-08-14',
  })
  public createdAt: Date

  @Prop()
  @ApiProperty({
    description: '更新时间',
    example: '2022-08-14',
  })
  public updatedAt?: Date

  @Prop({
    select: false,
    default: () => [],
  })
  @ApiPropertyOptional({
    description: '静态资源地址',
    example: '存放静态资源相关数据',
  })
  public assets?: AssetsList[]

  @Prop({
    ref: () => Comment,
  })
  @ApiProperty({
    description: '回复给某帖',
    example: '',
  })
  public replyTo?: Ref<Comment>

  //   @Prop({
  //     type: Reply,
  //   })
  //   @ApiProperty({
  //     description: '评论区',
  //     example: '[{},{}]',
  //   })
  //   public reply?: Reply[]

  @Prop({
    _id: false,
    type: CommentStats,
    default: {},
  })
  @ApiProperty({
    description: '统计表',
    example: '统计各种数据',
  })
  public stats: CommentStats
}

export const CommentModel = getModelForClass(Comment)
