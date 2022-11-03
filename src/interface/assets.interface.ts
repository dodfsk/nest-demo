import {
  Prop,
  getModelForClass,
  modelOptions,
  Severity,
  Ref,
} from '@typegoose/typegoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { User } from './user.interface'


@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { collection: 'assets' },
})
export class Assets {
  @Prop({
    required: true,
    ref: () => User,
  })
  @ApiProperty({
    description: '发布者信息',
    example: 'admin',
  })
  public from: Ref<User>

  @Prop()
  @ApiProperty({
    description: '文件桶名',
    example: 'user/face/archive/video',
  })
  public bucketName: string

  @Prop()
  @ApiProperty({
    description: '分组名',
    example: 'uid/hid',
  })
  public subName: string

  @Prop({ required: true })
  @ApiProperty({
    description: '文件名',
    example: '文件名',
  })
  public fileName: string

  @Prop({ required: true })
  @ApiProperty({
    description: '文件大小',
    example: '114514',
  })
  public fileSize: Number

  @Prop({ required: true })
  @ApiProperty({
    description: '文件类型',
    example: 'image/jpeg',
  })
  public contentType: string

  @Prop({ required: true })
  @ApiProperty({
    description: '文件相对路径',
    example: '@oss/bucketName/subName/fileName',
  })
  public url: string


//   

  @Prop({
    default: () => new Date(),
  })
  @ApiProperty({
    description: '创建时间',
    example: '2022-08-14',
  })
  public createdAt: Date

  @Prop()
  @ApiProperty({
    description: '更新时间',
    example: '2022-08-14',
  })
  public updatedAt?: Date
}

// export const AssetsModel = getModelForClass(Assets)
// 同步存储方案-废弃