import { Prop,getModelForClass, modelOptions } from "@typegoose/typegoose";
import { ApiProperty,ApiPropertyOptional } from "@nestjs/swagger";

//资源表结构

@modelOptions({ 
    schemaOptions: { collection: 'room' },
 })
export class Room {
  @Prop({required:true,unique:true})
  @ApiProperty({
    description: "hv号",
    example: "hv000000",
  })
  public hid!: string;

  @Prop()
  @ApiProperty({
    description: "标题",
    example: "这是一个title标题",
  })
  public title: string;

  @Prop()
  @ApiProperty({
    description: "内容",
    example: "这是一个title标题",
  })
  public content?: string;

  @Prop({required:true})
  @ApiProperty({
    description: "创建者username",
    example: "admin",
  })
  public from!: string;

  @Prop()
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
  public updateAt: Date;



}

export const RoomModel =getModelForClass(Room)

