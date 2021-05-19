---
title: 数据结构与算法之列表
date: 2019-08-08 22:14:05
tags:
  - DSA
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/04/27/15/04/wagtail-6211745_960_720.jpg
---

列表是一种常用的数据结构，如代办事项，十佳榜单等。当不需要在一个很长的序列中查找元素，或者对其排序时，列表显得尤其有用

<!--more-->

## 前言

列表是一种常用的数据结构，如代办事项，十佳榜单等。当不需要在一个很长的序列中查找元素，或者对其排序时，列表显得尤其有用

## 实现

使用 TypeScript 实现列表类，要实现的的列表类是

```ts
class List {
  pos: number // 列表当前位置
  listSize: number // 列表的元素个数
  data: [] // 列表的数据存储位置

  constructor() {
    this.pos = 0
    this.listSize = 0
    this.data = []
  }

  get length() {
    return this.listSize
  }

  // 清空列表中的所有元素
  clear() {}

  // 返回列表的字符串形式
  toString() {}

  // 返回当前位置的元素
  getElement() {}

  // 在现有元素后插入新元素
  insert() {}

  // 在列表的末尾添加新元素
  append() {}

  // 从列表中删除元素
  remove() {}

  // 将列表的当前位置移动到第一个元素
  front() {}

  // 将列表的当前位置移动到最后一个元素
  end() {}

  // 将当前位置向前移一位
  prev() {}

  // 将当前位置向后移一位
  next() {}

  // 判断是否有后一个元素
  hasNext() {}

  // 判断是否有前一个元素
  hasPrev() {}

  // 返回列表的当前位置
  currentPos() {}

  // 将列表的当前位置移动到指定位置
  moveTo() {}
}
```

将列表类实现后

```ts
class List {
  pos: number // 列表当前位置
  data: Array<any> // 列表的数据存储
  listSize: number // 列表的元素个数

  constructor() {
    this.pos = 0
    this.listSize = 0
    this.data = []
  }

  // 返回列表的长度
  get length() {
    return this.listSize
  }

  // 返回列表的当前位置
  get currentPos() {
    return this.pos
  }

  // 清空列表中的所有元素
  clear() {
    delete this.data
    this.data.length = this.listSize = this.pos = 0
  }

  // 返回列表的字符串形式
  toString() {
    return this.data.toString()
  }

  // 返回当前位置的元素
  getElement() {
    return this.data[this.pos]
  }

  // 在现有元素后插入新元素
  insert(element: any, after: any) {
    const index = this.findIndex(after)

    if (index > -1) {
      this.data.splice(index + 1, 0, element)
      this.listSize += 1
      return true
    }

    return false
  }

  // 在列表的末尾添加新元素
  append(element: any) {
    this.data.push(element)
    this.listSize += 1
  }

  // 从列表中删除元素
  remove(element: any) {
    const index = this.findIndex(element)

    if (index > -1) {
      this.data.splice(index, 1)
      this.listSize -= 1
      return true
    }
    return false
  }

  // 判断元素是否在列表中
  contains(element: any) {
    return this.data.includes(element)
  }

  // 将列表的当前位置移动到第一个元素
  front() {
    this.pos = 0
  }

  // 将列表的当前位置移动到最后一个元素
  end() {
    this.pos = this.listSize - 1
  }

  // 将当前位置向前移一位
  prev() {
    if (this.pos > 0) {
      this.pos -= 1
    }
  }

  // 将当前位置向后移一位
  next() {
    if (this.pos < this.listSize) {
      this.pos += 1
    }
  }

  // 判断是否有后一个元素
  hasNext() {
    return this.pos < this.listSize
  }

  // 判断是否有前一个元素
  hasPrev() {
    return this.pos > 0
  }

  // 将列表的当前位置移动到指定位置
  moveTo(position: number) {
    if (position > 0 && position < this.listSize) {
      this.pos = position
    }
  }

  // 查找元素位置
  private findIndex(element: any) {
    return this.data.findIndex(ele => element === ele)
  }
}
```

## 测试

```ts
const list = new List()

list.append('aaa')
list.append('bbb')
list.append('ccc')
list.append('ddd')
list.append('eee')

console.log('list :', list)
```

输出

```ts
list : List {
  pos: 0,
  listSize: 5,
  data: [ 'aaa', 'bbb', 'ccc', 'ddd', 'eee' ] }
```
