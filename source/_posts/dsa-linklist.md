---
title: 数据结构与算法之链表
date: 2019-08-25 12:49:36
tags:
  - DSA
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2015/10/09/00/55/lotus-978659_960_720.jpg
---

链表是一组节点组成的集合，每个节点都使用一个对象的引用指向它的下一个节点，指向节点的引用叫做链

<!--more-->

## 前言

链表是一组节点组成的集合，每个节点都使用一个对象的引用指向它的下一个节点，指向节点的引用叫做链。

## 实现

使用 LinkedListNode 类来表示节点，使用 LinkedList 来表示链表

```ts
class LinkedListNode {
  element: any
  next: LinkedListNode

  constructor(element: any) {
    this.element = element
    this.next = null
  }
}

class LinkedList {
  // 头节点
  head: LinkedListNode

  constructor() {
    this.head = new LinkedListNode('head')
  }

  // 查找
  find(element: any) {
    let currentNode: LinkedListNode = this.head

    while (currentNode.element !== element) {
      currentNode = currentNode.next
    }
    return currentNode
  }

  // 插入
  insert(element: any, item: any) {
    let newNode = new LinkedListNode(element)
    let currentNode = this.find(item)

    newNode.next = currentNode.next
    currentNode.next = newNode
  }

  // 移除
  remove(element: any) {
    let prevNode = this.findPrevNode(element)

    if (!(prevNode.next === null)) {
      prevNode.next = prevNode.next.next
    }
  }

  //
  findPrevNode(element: any) {
    let currentNode = this.head
    while (
      !(currentNode.next === null) &&
      currentNode.next.element !== element
    ) {
      currentNode = currentNode.next
    }
    return currentNode
  }

  // 显示
  display() {
    let currentNode = this.head

    while (!(currentNode.next === null)) {
      console.log(currentNode.next.element)
      currentNode = currentNode.next
    }
  }
}
```

测试

```ts
const foods = new LinkedList()

foods.insert('eggs', 'head')
foods.insert('apple', 'eggs')
foods.insert('bread', 'apple')
foods.insert('chese', 'bread')
foods.insert('rice', 'chese')
foods.display()
console.log('------------')
foods.remove('bread')
foods.display()
```

输出

```json
eggs
apple
bread
chese
rice
------------
eggs
apple
chese
rice
```

## 双向链表

要实现双向链表首先要为 LinkedListNode 类增加一个 prev 属性

```ts
class LinkedListNode {
  element: any
  prev: LinkedListNode
  next: LinkedListNode

  constructor(element: any) {
    this.element = element
    this.prev = null
    this.next = null
  }
}
```

然后修改 LinkedList 类的 insert, remove 方法

```ts
class LinkedList {
  // 头节点
  head: LinkedListNode = new LinkedListNode('head')

  // 查找
  find(element: any) {
    let currentNode = this.head

    while (currentNode.element !== element) {
      currentNode = currentNode.next
    }
    return currentNode
  }

  // 找到最后的节点
  findLast() {
    let currentNode = this.head

    while (currentNode.next !== null) {
      currentNode = currentNode.next
    }
    return currentNode
  }

  // 插入
  insert(element: any, item: any) {
    let newNode = new LinkedListNode(element)
    let currentNode = this.find(item)

    newNode.prev = currentNode
    newNode.next = currentNode.next
    currentNode.next = newNode
  }

  // 移除
  remove(element: any) {
    let currentNode = this.find(element)

    if (currentNode.next !== null) {
      currentNode.prev.next = currentNode.next
      currentNode.next.prev = currentNode.prev
      currentNode.next = null
      currentNode.prev = null
    }
  }

  // 显示
  display() {
    let currentNode = this.head

    while (!(currentNode.next === null)) {
      console.log(currentNode.next.element)
      currentNode = currentNode.next
    }
  }

  // 倒叙显示
  displayReverse() {
    let currentNode = this.findLast()

    while (currentNode.prev !== null) {
      console.log(currentNode.element)
      currentNode = currentNode.prev
    }
  }
}
```

测试一下

```ts
foods.insert('eggs', 'head')
foods.insert('apple', 'eggs')
foods.insert('bread', 'apple')
foods.insert('chese', 'bread')
foods.insert('rice', 'chese')
foods.display()
console.log('------------')
foods.remove('bread')
foods.display()
console.log('------------')
foods.displayReverse()
```

输出

```json
eggs
apple
bread
chese
rice
------------
eggs
apple
chese
rice
------------
rice
chese
apple
eggs
```

## 循环链表

创建循环链表需要让它的头节点的 next 属性指向本身， 然后修改 display 方法

```ts
this.head.next = this.head

 // 显示
display() {
  let currentNode = this.head

  while (currentNode.next !== null && currentNode.next.element !== 'head') {
    console.log(currentNode.next.element)
    currentNode = currentNode.next
  }
}
```

## 总结

链表是一种高效的数据结构，如果发现数组在使用时很慢，就可以考虑用链表替代它，但是如果需要对数据随机访问，数组任然是更优的选择
