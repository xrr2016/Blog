---
title: 在 Egg.js 中使用 redis 缓存提升性能
date: 2019-08-31 13:20:56
tags:
  - Node
  - Redis
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2014/02/27/16/10/tree-276014_960_720.jpg
---

Redis 是一款开源的，基于 BSD 许可的，高级键值缓存和存储系统

<!--more-->

## 前言

Redis 是一款开源的，基于 BSD 许可的，高级键值缓存和存储系统。Redis 的键包括 string，hash，list，set，sorted set，bitmap 和 hyperloglog。你可以在这些类型上面运行原子操作，例如，追加字符串，增加哈希中的值，加入一个元素到列表，计算集合的交集、并集和差集，或者是从有序集合中获取最高排名的元素。

要在 Egg.js 中使用 redis，只需要执行 `npm i redis` 命令即可。

通过一个例子来验证一下，创建一个可以返回开源仓库在 Github 上的 star 数量的数据接口，来测试使用 Redis 后带来的提升，代码地址: [https://github.com/xrr2016/egg-redis-test](https://github.com/xrr2016/egg-redis-test)

## 开发

首先使用 Egg.js 创建一个项目

```bash
mkdir egg-redis-test && cd egg-redis-test

npm init egg --type=simple

npm i
```

安装 redis

```sh
npm i redis
```

启动项目

```bash
npm run dev

open http://localhost:7001
```

先创建 controller 和 service 目录，用来放处理请求和返回数据的方法，完成后的项目目录为

![folder](/images/egg-folder.jpg)

修改 router.js 文件，添加路由，然后在 controller/home.js 文件实现 stars 方法

```js
'use strict'

module.exports = app => {
  const { router, controller } = app

  router.get('/', controller.home.index)
  router.get('/stars', controller.home.stars)
}
```

修改 controller/home.js 文件，接收请求传过来的 query 参数向下传给 stars service 返回结果

```js
'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async stars() {
    const { ctx, service } = this
    const { owner, name } = ctx.query

    ctx.body = await service.home.stars(owner, name)
  }
}

module.exports = HomeController
```

在 service/home.js 里实现 stars 方法，需要做的就是通过 controller 传过来的 owner, name 参数，请求 Github 的接口，返回数据。

需要注意的是，这里请求的是 Github 的 graphql 接口，所以首先需要在 Github 上新建一个 token，token 不能直接写在代码里面，需要将 token 放在环境变量里，否则代码提交到 Github 后会失效。

![token](/images/redis-token.jpg)

创建 token 后使用 [dotenv](https://github.com/motdotla/dotenv#readme) 保存环境变量，先安装然后在项目目录创建一个 .env 文件

```bash
npm i dotenv
```

![token](/images/env.jpg)

然后就可以使用 egg.js 自带的 crul 方法向 Github 接口发送 post 请求，代码如下

```js
'use strict'

require('dotenv').config()
const Service = require('egg').Service

class HomeService extends Service {
  async stars(owner, name) {
    function setResponse(name, stars) {
      return { msg: `${name} has ${stars} stars.` }
    }

    const query = `
      query {
        repository(owner: ${owner}, name: ${name}) {
          stargazers {
            totalCount
          }
        }
      }
    `

    const result = await this.ctx.curl('https://api.github.com/graphql', {
      method: 'POST',
      dataType: 'json',
      headers: {
        Authorization: `token ${process.env.TOKEN}`
      },
      data: JSON.stringify({ query }),
      timeout: 10000
    })

    const data = result.data.data

    return setResponse(name, data.repository.stargazers.totalCount)
  }
}

module.exports = HomeService
```

使用 postman 测试一下接口

![folder](/images/redis-before.jpg)

耗时平均 1 秒左右，接下来就是使用 Redis 添加缓存，首先需要在本地安装 Redis，参考 [Redis download](https://redis.io/download)，Mac 可以直接使用 homebrew 安装

安装

```bash
brew install redis
```

启动

```bash
redis-server /usr/local/etc/redis.conf
```

进入 redis 命令行

```bash
redis-cli
```

缓存的主要逻辑就是，第一次请求完得到 Github 的数据将数据放到缓存中，再次请求的时候直接使用缓存中的数据，也需要给缓存设置一个过期时间，
需要从环境变量中拿到 token，post 请求的数据要用 JSON.stringify 方法传给 Github 接口，否则出现解析错误，代码如下

```js
'use strict'

require('dotenv').config()
const redis = require('redis')
const { promisify } = require('util')
const Service = require('egg').Service

const REDIS_PORT = process.env.PORT || 6379
const client = redis.createClient(REDIS_PORT)
const getAsync = promisify(client.get).bind(client)
const setexAsync = promisify(client.setex).bind(client)

class HomeService extends Service {
  async stars(owner, name) {
    const key = `${owner}/${name}`
    const stars = await getAsync(key)

    function setResponse(name, stars) {
      return { msg: `${name} has ${stars} stars.` }
    }

    if (stars !== null) {
      return setResponse(name, stars)
    }

    const query = `
      query {
        repository(owner: ${owner}, name: ${name}) {
          stargazers {
            totalCount
          }
        }
      }
    `

    const result = await this.ctx.curl('https://api.github.com/graphql', {
      method: 'POST',
      dataType: 'json',
      headers: {
        Authorization: `token ${process.env.TOKEN}`
      },
      data: JSON.stringify({ query }),
      timeout: 10000
    })

    const data = result.data.data

    await setexAsync(key, 10, data.repository.stargazers.totalCount)
    return setResponse(name, data.repository.stargazers.totalCount)
  }
}

module.exports = HomeService
```

再次测试，首先把 Redis 里面的缓存清空，使用 Redis 的命令行运行

```bash
FLUSHALL
```

发送请求，第一次的耗时还是一秒多，然后在失效时间内请求，可以看到使用缓存的数据后耗时大大减少了，性能提升效果显著，实际项目可以设置一个较长的缓存失效时间

![folder](/images/redis-after.jpg)

当然缓存过期后又要重新向 Github 发送请求了，因为 Redis 已经把数据删除了

![folder](/images/redis-vue.jpg)

## 参考

[Redis documentation](https://redis.io/documentation)

[Node Redis](https://github.com/noderedis/node_redis)
