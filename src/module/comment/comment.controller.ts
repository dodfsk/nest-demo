import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CommentService } from './comment.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Comment, Reply } from '@/interface/comment.interface'
import { UserInfo } from '@/common/decorater/user.decorater'
import { Public } from '@/common/decorater/public.decorater'
import { RolesGuard } from '@/common/guard/roles.guard'
import { Roles } from '@/common/decorater/roles.decorater'

@Controller('comment')
@ApiTags('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: '发表评论',
  })
  async create(@Body() commentParam: Comment, @UserInfo() userInfo: UserInfo) {
    return await this.commentService.create(commentParam, userInfo)
  }

  //   @Get()
  //   findAll() {
  //     return this.commentService.findAll()
  //   }
  @Get(':id')
  async findList(@Param('id') id: string) {
    return await this.commentService.findList(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: '修改评论',
  })
  async update(
    @Param('id') id: string,
    @Body() commentParam: Comment,
    @UserInfo() userInfo: UserInfo,
  ) {
    return await this.commentService.update(id, commentParam, userInfo)
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: '删除评论',
  })
  async remove(@Param('id') id: string, @UserInfo() userInfo: UserInfo) {
    return await this.commentService.remove(id, userInfo)
  }

  @Get('list/:id')
  @HttpCode(200)
  @Public()
  @ApiOperation({
    summary: '评论列表分页',
  })
  async findCommentList(@Param('id') id: string, @Query() query) {
    return await this.commentService.findCommentList(id, query)
  }

  ///  二级评论方案-废弃
  //   @Get('reply/:id')
  //   @HttpCode(200)
  //   @Public()
  //   @ApiOperation({
  //     summary: "二级评论列表分页",
  //   })
  //   findReplyList(@Param('id') id: string, @Query() query) {
  //     return this.commentService.findReplyList(id,query)
  //   }

  //   @Post('reply/:id')
  //   @HttpCode(200)
  //   @ApiOperation({
  //     summary: "新增二级评论",
  //   })
  //   addReply(@Param('id') id: string,@Body() replyParam: Reply,@UserInfo() userInfo: UserInfo) {
  //     return this.commentService.addReply(id,replyParam,userInfo)
  //   }

  //   @Post('removeReply')
  //   @HttpCode(200)
  //   @ApiOperation({
  //     summary: "删除二级评论",
  //   })
  //   removeReply(@Param('id') id: string,@Body() replyParam: Reply,@UserInfo() userInfo: UserInfo) {
  //     return this.commentService.removeReply(id,replyParam,userInfo)
  //   }
}
