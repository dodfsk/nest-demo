import { Prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
//评论表结构

//二级评论区
export class Reply {
  @Prop({ required: true })
  @ApiProperty({
    description: '发布者username',
    example: 'admin',
  })
  public from: string;

  @Prop({ required: true })
  @ApiProperty({
    description: '内容',
    example: '这是二级评论内容',
  })
  public content: string;

  @Prop()
  @ApiProperty({
    description: '回复给username',
    example: 'admin',
  })
  public replyTo?: string;

  @Prop({
    default:()=>new Date()
  })
  @ApiProperty({
    description: '发布时间',
    example: '2022-08-14',
  })
  public createdAt: Date;

  @Prop()
  @ApiProperty({
    description: '更新时间',
    example: '2022-08-14',
  })
  public updateAt?: Date;
}

//一级评论区
@modelOptions({
  schemaOptions: { collection: 'comment' },
})
export class Comment {
  @Prop({ required: true,unique:true })
  @ApiProperty({
    description: 'hv号',
    example: 'hv000000',
  })
  public hid: string;

  @Prop({ required: true })
  @ApiProperty({
    description: '内容',
    example: '这是评论内容',
  })
  public content!: string;

  @Prop({ required: true })
  @ApiProperty({
    description: '发布者username',
    example: 'admin',
  })
  public from!: string;

  @Prop({
    default:()=>new Date()
  })
  @ApiProperty({
    description: '发布时间',
    example: '2022-08-14',
  })
  public createdAt: Date;

  @Prop()
  @ApiProperty({
    description: '更新时间',
    example: '2022-08-14',
  })
  public updateAt?: Date;

  @Prop()
  @ApiProperty({
    description: '评论区',
    example: '[{},{}]',
  })
  public reply:Reply[]
}

export const CommentModel = getModelForClass(Comment);
