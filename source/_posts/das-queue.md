---
title: 数据结构与算法之队列
date: 2019-08-18 22:18:36
tags:
  - DSA
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/01/29/14/41/wardrobe-5961193_960_720.jpg
---

队列是一种列表，只能在队尾插入元素，在队首删除元素。队列用于存储按顺序排列的的数据，先进先出，可以将队列想象成在饭店排队取餐的人群，在队伍前面的先取餐，后来的人后取餐

<!--more-->

## 前言

队列是一种列表，只能在队尾插入元素，在队首删除元素。队列用于存储按顺序排列的的数据，先进先出，可以将队列想象成在饭店排队取餐的人群，在队伍前面的先取餐，后来的人后取餐。

## 实现

用 TypeScript 实现队列

```ts
class Queue {
  data: Array<any> = []

  // 入队
  enqueue(element: any) {
    this.data.push(element)
  }

  // 出队
  dequeue() {
    return this.data.shift()
  }

  // 返回第一个元素
  front() {
    return this.data[0]
  }

  // 返回最后一个元素
  back() {
    return this.data[this.data.length - 1]
  }

  // 显示队列中所有元素
  toString() {
    return this.data.map(ele => `${ele}`).toString()
  }

  // 判断队列是否为空
  empty() {
    if (this.data.length) {
      return false
    }
    return true
  }
}
```

测试一下

```ts
const queue = new Queue()

queue.enqueue('a')
queue.enqueue('b')
queue.enqueue('c')
queue.enqueue('d')
queue.enqueue('e')

console.log('queue: ', queue)
console.log('front: ', queue.front())
console.log('back: ', queue.back())

queue.dequeue()
queue.dequeue()
queue.dequeue()
queue.dequeue()

console.log('queue: ', queue)

console.log('queue: ', queue.empty())
```

输出

```json
queue:  Queue { data: [ 'a', 'b', 'c', 'd', 'e' ] }

front: a

back:  e

queue:  Queue { data: [ 'e' ] }

queue:  false
```

## 优先队列

优先队列指的是在删除队列中元素的时候需要考虑元素的优先级，优先级高的元素先出队，优先级低的后出队，同等优先级的元素按原本的顺序出队。

首先需要一个具有优先级的元素

```ts
interface Element {
  data: any
  code: number // code 表示优先级，数值越小优先级越高，0 为最高
}
```

然后需要修改下队列的出队方法，找到队列中优先级最高的元素，然后将其移除队列

```ts
dequeue() {
  const codes = this.data.map(ele => ele.code)
  const minCode = Math.min.apply(null, codes)
  const index = this.data.findIndex(ele => ele.code === minCode)

  return this.data.splice(index, 1)
}
```

测试一下

```ts
const queue = new Queue()

queue.enqueue({ data: 'a', code: 5 })
queue.enqueue({ data: 'b', code: 4 })
queue.enqueue({ data: 'c', code: 3 })
queue.enqueue({ data: 'd', code: 2 })
queue.enqueue({ data: 'e', code: 1 })

console.log('queue: ', queue)

queue.dequeue()
queue.dequeue()
queue.dequeue()
queue.dequeue()

console.log('queue: ', queue)
```

输出

```json
queue:  Queue {
  data:
   [
     { data: 'a', code: 5 },
     { data: 'b', code: 4 },
     { data: 'c', code: 3 },
     { data: 'd', code: 2 },
     { data: 'e', code: 1 }
  ]
}

queue:  Queue {
  data:
    [
      { data: 'a', code: 5 },
      { data: 'b', code: 4 }
    ]
}
```

可以看到队列中剩下了优先级较低的元素
