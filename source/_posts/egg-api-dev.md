---
title: Egg.js 上传接口开发总结
categories:
  - 技术
tags:
  - Node
  - Egg.js
date: 2019-12-5 20:00:00
cover: ./images/egg.jpg
---

总结一下之前用 Egg.js 开发的文件上传接口的任务

<!--more-->

## 需求

要在浏览器端将文件上传到阿里的 OSS 对象存储，需要用到阿里云提供的 [SDK](https://github.com/ali-sdk/ali-oss)，但是这样会在前端暴露 OSS 的 `accessKeyId` 和 `accessKeySecret`，这是不安全的。所以需要一个文件上传接口把前端传过来的文件上传到对象存储里面，最初只支持阿里云，之后可能会支持其它的云服务商比如七牛云。

## 开发

后端框架用的是 Egg.js，因为比较熟悉。然后这只是一个文件上传的服务，一个路由就行。

```js
router.post(`/${app.name}/v1/upload`, controller.oss.upload)
```

然后实现对应的 `OssController` 的 `upload` 方法，一般的实践是在 `Controller` 层进行参数校验，这里用内置的是 `egg-validate` 插件进行校验。假如有两个参数 `folder` 和 `bucket` 代表文件上传的目录和 `bucket`，那么验证代码如下

```js
const body = ctx.request.body

const rules = {
  folder: { type: 'string', required: false, default: '/', trim: true },
  bucket: { type: 'string', required: false, default:  'you-bucket-name' },
}

await ctx.validate(rules, body)
```

接受前端的上传文件用的是 [egg-multipart](https://github.com/eggjs/egg-multipart) 插件，这个插件有两种模式 `file` 和 `stream`，`file` 模式适合简单的文件上传，这种模式会先将前端传来的图片存到服务器上，执行完操作后需要用 `ctx.cleanupRequestFiles()` 方法将文件删除。 `stream` 模式适合在对上传文件进一步处理的时候使用，如压缩，解压等，如果上传文件是图片那么可以将这个流传递给处理图片的库进行处理。

在 `config.default.js` 配置 `egg-multipart` 插件，在 `fileExtensions` 新增需要添加的文件类型扩展名，`cleanSchedule` 配置定时清除零时保存的文件。

```ts
config.multipart = {
  mode: 'file',
  fileSize: '50mb',
  tmpdir: path.join(os.tmpdir(), 'egg-multipart-tmp', appInfo.name),
  cleanSchedule: {
    cron: '0 30 4 * * *',
  },
  fileExtensions: [ '.pdf', '.doc', '.docx' ],
}
```

然后用 `ctx.request.files` 获取请求过来的文件，这里也需要进行验证请求是否有文件，校验好请求参数后就把请求参数传到 `Services` 层里

```js
const files = ctx.request.files
const body = ctx.request.body
...
ctx.body = await ctx.service.oss.upload(body, files)
```

对应的 `OssService` 是负责主要的任务地方，新建 `OSS` 实例对象，上传文件，设置上传文件的请求头，返回上传结果。

```ts
import * as fs from 'fs'
import * as OSS from 'ali-oss'

const ONE_YEAR = 3600 * 24 * 365

/**
 * OssService
 */
export default class OssService extends Service {
  private client

  private createClient(option) {
      this.client = new OSS({})
    }
  }

  private async uploadFile(dir, file) {
    let result

    const filename = file.filename.replace(/\.(\w+)$/, `-${Date.now()}.$1`)

    try {
      result = await this.client.put(`${dir}${filename}`, file.filepath, {
        headers: { 'Cache-Control': `max-age=${ONE_YEAR}`, 'Content-Disposition': '' },
      })
    } catch (e) {
      this.ctx.logger.error(new Error(e.message))
      throw new Error(e.message)
    } finally {
      fs.unlink(file.filepath, () => true)
    }

    return result
  }

  public async upload(parmas, files) {
    this.createClient(parmas)

    let result

    if (files.length > 1) {
      result = []

      for (const file of files) {
        const res = await this.uploadFile(parmas.dir, file)

        result.push({ url: res.url })
      }

    } else {
      const file = files[0]
      const res = await this.uploadFile(parmas.dir, file)

      result = { url: res.url }
    }

    return result
  }
}
```

至此上传文件到 OSS 接口基本完成了

## 测试

Egg.js 集成了 [SuperTest](https://github.com/visionmedia/supertest) 测试框架，所以写接口的单元测试很方便。这个接口主要是对 `Controller` 层请求参数进行测试。测试代码写在项目目录 `test/app/controller/oss.test.ts` 文件内。

```ts
import { app, assert } from 'egg-mock/bootstrap'

describe('测试 oss controller', () => {
  it('不再白名单的 bucket 名返回错误', async () => {
    const result = await app.httpRequest()
      .post('/upload-server/v1/upload')
      .set('Content-type', 'multipart/form-data; boundary=--------------------------820317025826519383208825')
      .field('bucket', 'wrong-bucket')
      .expect(403)

    assert(result.body)
  })

  it('上传文件成功', async () => {
    const result = await app.httpRequest()
      .post('/upload-server/v1/upload')
      .set('Content-type', 'multipart/form-data; boundary=--------------------------820317025826519383208825')
      .field('dir', 'images')
      .attach('avatar', 'test/app/controller/avatar.png')
      .expect(200)

    assert(result.body)
  })
})

```

## 部署

Egg.js 本身部署十分的方便，只需要在服务器上运行以下命令即可

```bash
egg-scripts start --daemon --env=prod --title=upload-server
```

但是将这个服务变成一个 `Docker` `iamge` 就更方便了

> 注意:
> 要用 `Docker` 运行 Egg 服务需要将 `package.json` 中 `scripts` 的 `start` 命令去掉 `--daemon` 参数，变成
> `egg-scripts start --env=prod --title=upload-server`
> 因为在 `Docker` 运行 Egg 应用需要是前台模式运行

```dockerfile
FROM node:lts-alpine

# 设置时区
RUN apk --update add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

WORKDIR /upload-server

COPY package*.json ./

RUN npm install --registry=https://registry.npm.taobao.org

COPY . /upload-server

RUN npm run tsc && npm prune --production

EXPOSE 7001

CMD npm start
```

有了镜像后，写一个运行容器的脚本，添加可执行的权限，之后启动服务就可以只用运行这个脚本即可。

```sh
#!/bin/bash

set -e

IMAGE_NAME="upload-server"
CONTAINER_NAME="upload-server"

echo '拉取代码'

git pull origin master

echo '运行容器'

docker rm -f ${CONTAINER_NAME} || true

docker build -t ${IMAGE_NAME} .

docker run -d -p 7001:7001 --env-file .env --name=${CONTAINER_NAME} ${IMAGE_NAME}

exit
EOF
```

```bash
chmod +x ./deploy.sh
```

运行脚本

```bash
./deploy.sh
```

## 请求频率限制

为了防止接口被滥用需要限制请求接口的频率，在 Github 找到一个 [koa-ratelimit](https://github.com/koajs/ratelimit) 的仓库，由于 Egg.js 支持 Koa 的插件，所以也适合。

参考这个仓库的文档，在项目 `middleware` 文件添加一个 `ratelimit.ts`，用这个中间件来控制，一开始使用的 `redis` 作为 `driver` 可是遇到一个 `docker-compose` 网络链接问题始终无法解决，遂放弃，改用内存模式。

```ts
import * as Redis from 'ioredis'
import * as ratelimit from 'koa-ratelimit'

const db = new Map();

export default () => {
  return ratelimit({
    db: db,
    driver: 'memory',
    duration: 60000,
    errorMessage: '请求次数超过限制',
    id: ctx => ctx.ip,
    headers: {
      remaining: 'Upload-Limit-Remaining',
      reset: 'Uplaod-Limit-Reset',
      total: 'Upload-Limit-Total',
    },
    max: 300,
    disableHeader: false,
  })
}
```

## 遇到的问题

***上传到 OSS 的图片在浏览器无法预览变为下载***

首先阿里云规定

> 对于图片文件（在未修改文件http头的情况下）：
> 若您的Bucket是2019年9月23日前创建的，使用OSS默认访问域名或自有域名生成的文件URL从浏览器访问时可以预览文件内容。
> 若您的Bucket是2019年9月23日后创建的，使用OSS默认域名生成的文件URL从浏览器访问时会以附件形式下载；使用自有域名生成的文件URL访问时，可以预览> 文件内容。绑定自有域名步骤请参见绑定自定义域名。

然后是上传的图片不能添加 `Content-Disposition` 返回头信息，给文件添加了这个 http 返回头，也会让图片变成下载。

---

***`egg-multipart` 插件使用 `stream` 模式无法获取请求体传过来的参数***

用 `file` 模式能够正确的拿到 `ctx.request.body` 里的请求参数，但是将使用 `stream` 模式就无法获取，搜索了一下后发现使用 `stream` 模式需要将上传文件放到表单的最后一项去，不然拿不到其它参数。

> https://eggjs.org/zh-cn/basics/controller.html#%E8%8E%B7%E5%8F%96%E4%B8%8A%E4%BC%A0%E7%9A%84%E6%96%87%E4%BB%B6
> 只支持上传一个文件。
> 上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。

---

***Redis 无法链接问题***

用以下的 `docker-compose.yml` 文件启动 Egg.js 应用和一个 `Redis` 服务，然后想在上传接口的请求频率限制的中间件中使用这个 `Redis` 服务，然后一直报链接失败...Google 之后试了几种方法依然没有成功 :sad:

```yml
version: "3"

services:
  redis:
    image: redis:alpine
    container_name: redis
    restart: always
    hostname: redis
    ports:
      - "6379:6379"
    networks:
       - upload-server-network

  upload_server:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: upload_server
    restart: always
    environment:
      - EGG_SERVER_ENV:prod
    ports:
      - 7001:7001
    depends_on:
      - redis
    networks:
      - upload-server-network

networks:
  upload-server-network:
    driver: bridge

````

---

***Egg.js 全局错误处理返回格式问题***

Egg.js 本身有一个全局错误处理的插件 [egg-onerror](https://github.com/eggjs/egg-onerror)，但是用这个插件在处理上传文件的异常时，直接 `throw` 错误，返回给前端的数据格式是文本类型的，不是 json 格式，除非前端在发送请求的添加 `Accept: application/json` 请求头信息。
只能在 `config.default.js` 使用 `all` 进行捕获异常，然后用 `JSON.stringify` 方法在处理一遍，这样 `throw new Error(e.message)` 的时候返回给前端的才是 json。

```js
config.onerror = {
  all(err, ctx) {
    ctx.status = err.status || 500

    ctx.body = JSON.stringify({
      code: ctx.status,
      success: false,
      message: err.message,
    })
  },
}
```

最终还是没有使用这个插件，自己添加了一个方法，进行异常捕获。

```ts
private error(msg) {
  const { ctx } = this

  ctx.status = 400
  ctx.body = {
    code: ctx.status,
    success: false,
    message: msg,
  }
}
...

this.error('错误的 bucket')
return
```

---
