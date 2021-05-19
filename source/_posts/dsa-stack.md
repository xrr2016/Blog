---
title: 数据结构与算法之栈
date: 2019-08-10 23:12:09
tags:
  - DSA
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/04/24/05/41/beach-6203278_960_720.jpg
---

栈是一种高效的数据结构，因为它只能在栈顶添加或删除，这样的操作很快，它是被称之为后入先出（LIFO，last in first out）的数据结构。可以将栈想象成一叠装菜的盘子，用的时候先拿最上面的，洗好的盘子又会放到最上面

<!--more-->

## 前言

栈是一种高效的数据结构，因为它只能在栈顶添加或删除，这样的操作很快，它是被称之为后入先出（LIFO，last in first out）的数据结构。可以将栈想象成一叠装菜的盘子，用的时候先拿最上面的，洗好的盘子又会放到最上面。

## 实现

用 TypeScript 实现栈

```ts
class Stack {
  top: number = 0
  data: Array<any> = []

  get length() {
    return this.top
  }

  // 向栈中压入一个新元素
  push(element: any) {
    this.data.push(element)
    this.top += 1
  }

  // 返回栈顶元素, 同时将 top 值减 1
  pop() {
    this.top -= 1
    return this.data.pop()
  }

  // 返回栈顶元素
  peek() {
    if (!this.data.length) {
      return false
    }

    return this.data[this.top - 1]
  }

  // 清空栈
  clear() {
    this.top = 0
  }
}
```

## 测试

```ts
const stack = new Stack()

stack.push('aaa')
stack.push('bbb')
stack.push('ccc')
stack.push('ddd')

console.log('执行 push 方法后\n', stack)

stack.pop()

console.log('执行 pop 方法后\n', stack)

console.log('执行 peek 方法后返回：', stack.peek())

stack.clear()

console.log('执行 clear 方法后\n', stack)

执行 push 方法后
 Stack { data: [ 'aaa', 'bbb', 'ccc', 'ddd' ], top: 4 }
执行 pop 方法后
 Stack { data: [ 'aaa', 'bbb', 'ccc' ], top: 3 }
执行 peek 方法后返回： ccc
执行 clear 方法后
 Stack { data: [ 'aaa', 'bbb', 'ccc' ], top: 0 }
```

## 应用

### 将 10 进制的数转化为另一种进制

此算法只针对基数为 2 ～ 9 的情况

```ts
function mulBase(num: number, base: number) {
  const stack = new Stack()

  while (num > 0) {
    stack.push(num % base)
    num = Math.floor((num /= base))
  }
  let converted = ''
  while (stack.length > 0) {
    converted += stack.pop()
  }

  return converted
}

console.log('num = 2 base = 2：', mulBase(2, 2)) // 10

console.log('num = 32 base = 2：', mulBase(32, 2)) // 100000

console.log('num = 125 base = 8：', mulBase(125, 8)) // 175
```

### 判断回文

```ts
function isPalindrome(word: string) {
  let rword = ''
  const stack = new Stack()

  word.split('').forEach(w => stack.push(w))

  while (stack.length > 0) {
     rword += stack.pop()
  }

  if(word === rword) {
    return true
  }

  return false
}


console.log('hello', isPalindrome('hello'));

console.log('bob', isPalindrome('bob'));

console.log('racecar', isPalindrome('racecar'));

hello false
bob true
racecar true
```
