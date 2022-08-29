import { Prop,getModelForClass, modelOptions } from "@typegoose/typegoose";
import { ApiProperty,ApiPropertyOptional } from "@nestjs/swagger";
import { customAlphabet } from "nanoid";
//资源表结构
const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid=customAlphabet(alphabet,10)//0~9,a~z,A~Z(去除-和_)  10位数

@modelOptions({ 
    schemaOptions: { collection: 'room' },
 })
export class Room {
  @Prop({
    required:true,
    unique:true,//code:11000 字段已存在
    default:()=>nanoid(),//使用nanoid@3.3.4----Last commonJs supported version
})
  @ApiProperty({
    description: "hv号",
    example: "hv000000",
  })
  public hid: string;

  @Prop()
  @ApiProperty({
    description: "标题",
    example: "这是一个title标题",
  })
  public title: string;

  @Prop({
    select: false, //默认查询中隐藏
  })
  @ApiProperty({
    description: "内容",
    example: "这是一个content内容",
  })
  public content?: string;

  @Prop()
  @ApiProperty({
    description: "描述",
    example: "这是一个description描述",
  })
  public description?: string;

  @Prop()
  @ApiProperty({
    description: "封面",
    example: "这是一个cover封面",
  })
  public cover?: string;

  @Prop()
  @ApiProperty({
    description: "静态资源地址",
    example: "这是一个静态资源地址",
  })
  public assets?: string;
  
  @Prop({
    required:true
  })
  @ApiProperty({
    description: "创建者username",
    example: "admin",
  })
  public from: string;

  @Prop({
    default:()=>new Date()
  })
  @ApiProperty({
    description: "创建时间",
    example: "2022-08-14",
  })
  public createdAt: Date;

  @Prop()
  @ApiProperty({
    description: "更新时间",
    example: "2022-08-14",
  })
  public updateAt?: Date;



}

export const RoomModel =getModelForClass(Room)

