---
title: 对 Egg.js 进行单元测试
categories:
  - 技术
date: 2019-11-01 12:35:00
tags:
  - Node
  - Egg
cover: https://cdn.pixabay.com/photo/2021/05/06/13/16/bee-6233397_960_720.jpg
---

优秀的代码需要有单元测试进行质量保证，每个测试用例都给应用的稳定性提供了一层保障，本文说一下如何对使用 egg.js 写的接口进行单元测试

<!--more-->

## 前言

优秀的代码需要有单元测试进行质量保证，每个测试用例都给应用的稳定性提供了一层保障。

## 实践

egg.js 工程的测试代码都是放在工程的 test 目录下，命名的方式为 `${filename}.test.js`，比如我想测试项目的 `user` `controller` 就在 `test` 目录下新建一个 `controller/user.test.js`，同理要测 `service` 就是创建一个 `service` 目录，然后就是写具体的测试代码了。

假设现在需要对一个 `UserService` 进行测试，首先在 `user.test.js` 中引入 `egg-mock` 模块用来创建一个 `app` 实例以及一个 `ctx` 对象，一般在请求接口的时候会在 `ctx` 对象上携带这次请求的参数和是用户信息，需要在创建 `ctx` 的时候添加所要的数据，最好的方式是 `before` 函数中，将这些数据附加到 `ctx` 上。

```js
const { app, assert } = require('egg-mock/bootstrap')

let ctx

before(() => {
  ctx = app.mockContext({
    user: {
      name: 'your-name'
    }
  })
})
```

如果还需要添加请求头信息，比如用户的 `token` 可以这样添加

```js
ctx.request.headers = {
  authorization: yourToken
}
```

准备完毕，接下来编写具体的测试代码了，假如 `UserService` 有一个 `create` 方法，作用是创建一个新的 `user`，参数是请求体传过来的新建用户数据，那么可以这样写测试代码

```js
it('create 方法返回新增用户成功信息', async () => {
  const data = {
    name: 'user name' + Date.now(),
    age: parseInt(Math.random() * 60),
    gender: Math.random() > 0.5 ? 'male' : 'female'
  }

  const response = await ctx.service.user.create(data)

  assert(response.success === true)
  assert(response.payload.length > 0)
})
```

完整的代码

{% include_code lang:javascript user.test.js %}

断言返回值的 `success` 为 `true`，`payload` 的 `length` 属性长度大于 0，当然这需要根据具体的业务来写，一个 `service` 可能会有很多的方法，需要尽可能多的对这些方法进行测试。

最后就是执行测试代码了

```sh
npm run test
```

通过命令 `npm run test` 执行 `egg-bin test`，或者在 `Idea` 添加一个测试的 `configuration` 点击执行即可，这样 `test` 目录下的所有测试都会运行。运行全部的测试耗时可能会很长或者有时只需要对一个测试文件进行测试，这时通过指定测试文件的路径即可

```sh
npm run test <TestFilePath>
```

运行测试的时候会加载 `config.unittest.js` 里面的配置，运行完毕，没有通过的测试会显示具体的错误信息，可以方便的定位错误，如果测试都通过了就会出现测试通过的以及耗时信息

![test](images/egg-test.jpg)

## 参考

[单元测试](https://eggjs.org/zh-cn/core/unittest.html)
