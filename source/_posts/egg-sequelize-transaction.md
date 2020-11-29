---
title: 如何在 Egg.js 中使用 Sequelize 的事务 Transaction
date: 2019-08-22 14:07:14
tags:
  - Egg.js
categories:
  - 技术
---

Egg.js 框架使用事务
<!--more-->

## 前言

在查了几遍 [Sequelize](https://sequelize.org/) 关于 [Transactions](https://sequelize.org/master/manual/transactions.html) 的文档，看了大佬同事的代码后，我终于弄懂怎么在 egg.js 框架里面使用事务了 😓

## 实践

Sequelize 关于事务的示例代码是这样滴，首先通过 `sequelize.transaction` 方法创建了一个事务后，把这个事务传给需要进行操作的函数，如新增用户，给用户加属性等，但是看上去代码比较难懂

```js
return sequelize.transaction().then(t => {
  return User.create(
    {
      firstName: 'Bart',
      lastName: 'Simpson'
    },
    { transaction: t }
  )
    .then(user => {
      return user.addSibling(
        {
          firstName: 'Lisa',
          lastName: 'Simpson'
        },
        { transaction: t }
      )
    })
    .then(() => {
      return t.commit()
    })
    .catch(err => {
      return t.rollback()
    })
})
```

实际使用的话需要用 `async/await` 语法让代码看起来更加清晰一点，在 egg.js 中使用的示例如下，首先需要用当前上下文中的 model 对象（就是对数据表的映射对象）创建一个事务，然后在 `try/catch` 中执行所要进行的操作，如果操作抛出了异常，那么就会回滚

```js
const transaction = await this.ctx.model.transaction()

try {
  await this.ctx.model.create(this.ctx.request.body, { transaction })
  await this.ctx.service.user.find(userId, { transaction });
  await this.ctx.service.product.destory(productId, { transaction });
  ...
  await transaction.commit()
} catch (err) {
  await transaction.rollback()
  throw err
}
```

用了 `async/await` 语法，代码确实清晰了很多
