import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common'
import { Comment, CommentModel, Reply } from '@/interface/comment.interface'
import { Room, RoomModel } from '@/interface/room.interface'
import { UserInfo } from '@/common/decorater/user.decorater'
import { ResponseData } from '@/interface/common'
import { User } from '@/interface/user.interface'
import { ImgToOss, UrlToOss, UrlReplace } from '@/common/utils/ossReplace'
// import { mongoose } from '@typegoose/typegoose'

@Injectable()
export class CommentService {
  async create(commentParam: Comment, userInfo: UserInfo) {
    commentParam.from = userInfo._id
    //替换@oss,后续将添加全局flag是否启用
    if (commentParam.content) {
      commentParam.content = ImgToOss(commentParam.content)
    }
    if (commentParam.assets) {
      commentParam.assets.forEach((item) => {
        item.url = UrlToOss(item.url)
      })
    }
    const roomData = await RoomModel.findOneAndUpdate(
      { hid: commentParam.oid },
      { $inc: { 'stats.reply': 1 } }, //回复数+1
      { returnDocument: 'after' }, //返回更新后的文档
    )
    commentParam.floor = roomData.stats.reply //楼层数为主楼总回复数
    if (roomData.status == 0) {
      throw new BadRequestException('不允许对未发布状态主题进行回复')
    }

    const createComment = new CommentModel(commentParam)
    //save comment
    const res = await createComment
      .save()
      .then((res) => {
        // console.log(res)
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('发表评论失败' + err)
      })

    return <ResponseData>{
      message: '发表评论成功!',
      code: 200,
      data: res,
    }
  }

  //   async findAll() {
  //     return `This action returns all comment`
  //   }
  async findOne(_id: string) {
    const res = await CommentModel.findOne({ _id })

    return <ResponseData>{ message: '查找评论详情成功', code: 200, data: res }
  }

  async update(_id: string, commentParam: Comment, userInfo: UserInfo) {
    const pre = await CommentModel.findOne({ _id })
    if (!userInfo._id.equals(pre.from)) {
      throw new BadRequestException('只能修改自己创建的评论')
    }

    let { oid, from, floor, stats, createdAt, ...updateParam } = commentParam

    updateParam.updatedAt = new Date()

    const res = await CommentModel.findOneAndUpdate({ _id }, updateParam, {
      returnDocument: 'after',
    }) //返回更新后的文档
      .select('+assets')
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('更新comment失败' + err)
      })

    return <ResponseData>{ message: '更新成功', code: 200, data: res }
  }

  async remove(_id: string, userInfo: UserInfo) {
    const pre = await CommentModel.findOne({ _id })
    if (!userInfo._id.equals(pre.from)) {
      throw new BadRequestException('只能删除自己创建的评论')
    }

    const res = await CommentModel.findOneAndDelete({
        _id,
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new UnprocessableEntityException('删除comment失败' + err)
      })
    return <ResponseData>{ message: '删除成功', code: 200, data: res }
  }

  async findCommentList(hid: string, query) {
    const { page = 0, size = 0, order = 1, sort = 'floor' } = query

    const total = await CommentModel.find({ oid: hid }).count()
    const commentList = await CommentModel.find({ oid: hid })
      .sort({ [sort]: order })
      .skip(page > 0 ? (page - 1) * size : 0)
      .limit(size)
      .populate<{ from: User }>({
        path: 'from',
        select: 'uid username avatar',
      })
      .populate<{ replyTo: Comment }>({
        path: 'replyTo',
        select: '_id from content floor',
        populate: {
          path: 'from',
          select: 'uid username',
        },
      })
      .then((res) => {
        //替换@oss,后续将添加全局flag是否启用
        res.forEach((item) => {
          if (item.from && item.from.avatar)
            item.from.avatar = UrlReplace(item.from.avatar)
        })
        return res
      })

    return <ResponseData>{
      message: '查询评论成功!',
      code: 200,
      data: {
        total,
        commentList,
      },
    }
  }

  //  二级评论方案-废弃(aggregate聚合管道例子)
  //   async findReplyList(_id: string, query) {
  //     const {
  //       page = 0,
  //       size = 0,
  //       order = 1,
  //       sort = 'createdAt',
  //     }: { page: number; size: number; order: 1 | -1; sort: string } = query
  //     const pageParam = Number(page > 0 ? (page - 1) * size : 0)
  //     const sizeParam = Number(size)
  //     const orderParam = Number(order)

  //     // const total = await CommentModel.findOne({ _id },{ reply:1 }).count()
  //     const aggregate = await CommentModel.aggregate([
  //       {
  //         $match: {
  //           _id: new mongoose.Types.ObjectId(_id),
  //         },
  //       },
  //       {
  //         $project: {
  //           total: {
  //             $size: '$reply',
  //           },
  //           reply: 1,
  //         },
  //       },
  //       {
  //         $set: {
  //           reply: {
  //             $slice: [
  //               {
  //                 $sortArray: {
  //                   input: '$reply',
  //                   sortBy: { createdAt: orderParam },
  //                 },
  //               },
  //               pageParam,
  //               sizeParam,
  //             ],
  //           },
  //         },
  //       },
  //       //   {
  //       //     $lookup: {
  //       //         from: 'user',
  //       //         localField: 'from',
  //       //         foreignField: '_id',
  //       //         as: 'from'
  //       //     }
  //       //   },
  //     ])
  //     const commentDetail = await CommentModel.populate(aggregate, {
  //       path: 'reply.from reply.replyTo',
  //       select: 'username avatar',
  //     }).then((res) => {
  //       //替换@oss,后续将添加全局flag是否启用

  //       // res.forEach((item) => {
  //       //   if (item.from && item.from.avatar)
  //       //     item.from.avatar = UrlReplace(item.from.avatar)
  //       //   item.reply.forEach((i) => {
  //       //     if (i.from && i.from.avatar)
  //       //       i.from.avatar = UrlReplace(i.from.avatar)
  //       //     if (i.replyTo && i.replyTo.avatar)
  //       //       i.replyTo.avatar = UrlReplace(i.replyTo.avatar)
  //       //   })
  //       // })

  //       return res
  //     })

  //     console.log(commentDetail)

  //     return <ResponseData>{
  //       message: '查询二级评论成功!',
  //       code: 200,
  //       data: {
  //         ...commentDetail[0],
  //       },
  //     }
  //   }

  //   async addReply(_id: string, replyParam: Reply, userInfo: UserInfo) {
  //     replyParam.from = userInfo._id
  //     console.log(replyParam)

  //     const res = await CommentModel.findOneAndUpdate(
  //       { _id },
  //       {
  //         $push: {
  //           reply: replyParam,
  //         },
  //       },
  //       { returnDocument: 'after' }, //返回更新后的文档
  //     )
  //       .then((res) => {
  //         return res
  //       })
  //       .catch((err) => {
  //         throw Error('新增回复失败' + err)
  //       })

  //     return <ResponseData>{ message: '新增回复成功', code: 200, data: res }
  //   }

  //   async removeReply(_id: string, replyParam: Reply, userInfo: UserInfo) {
  //     replyParam.from = userInfo._id

  //     const res = await CommentModel.findOneAndUpdate(
  //       { _id },
  //       {
  //         $pull: {
  //           reply: replyParam,
  //         },
  //       },
  //       { returnDocument: 'after' }, //返回更新后的文档
  //     )
  //       .then((res) => {
  //         return res
  //       })
  //       .catch((err) => {
  //         throw Error('删除回复失败' + err)
  //       })

  //     return <ResponseData>{ message: '删除回复成功', code: 200, data: res }
  //   }
}
