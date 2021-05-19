---
title: 数据结构与算法之字典
date: 2019-08-28 21:09:13
tags:
  - DSA
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2014/04/14/20/11/pink-324175_960_720.jpg
---

字典是一种以键值对形式存储数据的数据结构，键用来查找，值用来保存数据

<!--more-->

## 前言

字典是一种以键值对形式存储数据的数据结构，键用来查找，值用来保存数据

## 实现

```ts
class Dictionary {
  data: any[] = []

  // 添加元素
  add(key: any, value: any) {
    this.data[key] = value
  }

  // 查找元素
  find(key: any) {
    return this.data[key]
  }

  // 删除元素
  remove(key: any) {
    delete this.data[key]
  }

  // 显示元素
  show() {
    Object.entries(this.data).forEach(item => {
      console.log('key:', item[0], ' value:', item[1])
    })
  }

  // 元素个数
  count() {
    let n = 0
    Object.keys(this.data).forEach(_ => {
      n += 1
    })
    return n
  }

  // 清空元素
  clear() {
    Object.keys(this.data).forEach((key: any) => {
      delete this.data[key]
    })
  }
}
```

测试

```ts
const dictionary = new Dictionary()

dictionary.add('a', 'a')
dictionary.add('b', 'b')
dictionary.add('c', 'c')
dictionary.add('d', 'd')
dictionary.add('e', 'e')

dictionary.show()

console.log('count: ', dictionary.count())

dictionary.clear()

console.log('clear: ', dictionary.count())
```

输出

```textmate
key: a  value: a
key: b  value: b
key: c  value: c
key: d  value: d
key: e  value: e
count:  5
clear:  0
```

排序字典的输出，需要重新定义 show 方法

```ts
// 显示元素
show() {
  Object.entries(this.data)
	.sort()
	.forEach(item => {
	  console.log('key:', item[0], ' value:', item[1])
	})
}
```

测试一下

```ts
const dictionary = new Dictionary()

dictionary.add('c', 'c')
dictionary.add('a', 'a')
dictionary.add('d', 'd')
dictionary.add('e', 'e')
dictionary.add('b', 'b')

dictionary.show()
```

输出

```textmate
key: a  value: a
key: b  value: b
key: c  value: c
key: d  value: d
key: e  value: e
```

使用 Object.keys 方法拿到字典的 keys 数组后，在用 sort 方法就可以显示有序的字典输出了
