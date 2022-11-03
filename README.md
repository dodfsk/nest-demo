# NestJS Demo
大体上是一个论坛系统的后端

本项目是由官方nestjs/cli开始从头构建,边写边学Node后端的产物。因为没有明确目标,所以一直在改需求和逻辑,寻找更优解。



## Description
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="68" alt="Nest Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://github.com/mongodb/mongo/raw/master/docs/leaf.svg" width="42" alt="Mongo Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://raw.githubusercontent.com/minio/minio/master/.github/logo.svg" width="142" height="70px" alt="Minio Logo" /></a>
</p>

##### 相关技术栈:
    基础框架:nestjs
    数据库:mongoDB
    ORM框架:typegoose
    缓存:redis
    对象存储:minio
    权限安全:bcryptjs passport-jwt passport-local

##### 目录:
    ────src
        ├── common      #装饰器、守卫、拦截器、过滤器、工具函数等
        ├── config      #全局配置
        ├── db          #数据库连接相关
        ├── interface   #存放数据库schema和ts类型
        └── module      #业务功能模块

##### 功能介绍:
除了实现了用户，文章，评论基本的增删改查,还有以下

权限安全相关：

    1. 用户注册使用bcryptjs对密码进行盐加密
    2. 用户登陆使用passport-local守卫策略,比对数据库中bcrypt加密后的密码,比对通过后将用户信息交给jwt生成token并存入redis进行缓存
    3. 没有@Public公共装饰器的接口都会通过jwt守卫,先经过jwt的一级验证,再比对redis缓存的最新登陆的token,实现单设备登陆。
    4. 通过jwt守卫的接口将获得token中对应的用户信息,为接口中的业务逻辑提供身份判定

接口相关:

    1. 用拦截器统一返回类型,该Response Type跟前端共享(res.data)
    2. 用异常过滤器捕获throw出的各种不同类型的异常,并统一外层code(res)为200,将业务code封入Response(res.data)内
    3. 使用mongoose的populate填充引入其他表的信息,比如from字段填入用户表信息


对象存储相关:

    1. 使用前端直传,对域名前缀使用正则替换的方案
    2. 在业务接口中对所有涉及文章封面cover,内容content,用户头像avatar字段的接口进行正则替换
    3. 考虑添加图片处理服务中间件,类似阿里云oss的图片处理服务


## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn nest

# production mode
$ yarn build
$ yarn start:prod
```
