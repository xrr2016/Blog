---
title: 数据结构与算法之集合
date: 2019-10-01 10:46:48
tags:
  - DSA
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2020/11/26/20/20/barn-owl-5780100_960_720.jpg
---

集合是一种包含不同元素的数据结构，集合中的元素称之为成员。集合有两个重要的特性，一是集合中的成员是无序的，其次集合中不存在相同的成员。

<!--more-->

## 前言

集合是一种包含不同元素的数据结构，集合中的元素称之为成员。集合有两个重要的特性，一是集合中的成员是无序的，其次集合中不存在相同的成员。

## 关于集合

不包含任何成员的集合称为空集，全集则是包含可能一切成员的集合。
如果两个集合的成员完全相等，则两个集合相等。
如果一个集合的所有成员都属于另一个集合，则认为这个集合是另一个集合的子集。
并集-将两个集合的成员合并的操作。
交集-将两个集合共有的成员组成一个新的集合。
补集-属于一个集合而不属于另一个集合的成员。

## 实现集合

```ts
class MySet {
  data = <any>[]

  get size() {
    return this.data.length
  }

  add(element: any) {
    if (this.data.indexOf(element) > -1) {
      return false
    }

    this.data.push(element)
  }

  remove(element: any) {
    const index = this.data.indexOf(element)

    if (index > -1) {
      this.data.splice(index, 1)
      return true
    }

    return false
  }

  contains(element: any) {
    if (this.data.indexOf(element) > -1) {
      return true
    }
    return false
  }

  // 并集
  uinon(set: MySet) {
    const newSet = new MySet()

    this.data.forEach((e: any) => newSet.add(e))

    for (let index = 0; index < set.data.length; index++) {
      const ele = set.data[index]
      if (!newSet.contains(ele)) {
        newSet.add(ele)
      }
    }

    return newSet
  }

  // 交集
  intersect(set: MySet) {
    const newSet = new MySet()

    this.data.forEach((ele: any) => {
      if (set.contains(ele)) {
        newSet.add(ele)
      }
    })
    return newSet
  }

  // 判断是否是补集
  subset(set: MySet) {
    if (this.size > set.size) {
      return false
    } else {
      for (let index = 0; index < this.data.length; index++) {
        const element = this.data[index]

        if (!set.contains(element)) {
          return false
        }
      }

      return true
    }
  }

  // 返回集合中不同的成员
  difference(set: MySet) {
    const newSet = new MySet()

    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index]
      if (!set.contains(element)) {
        newSet.add(element)
      }
    }

    return newSet
  }

  show() {
    return this.data.forEach((e: any) => console.log(e))
  }
}
```

## 测试

```ts
const setOne = new MySet()

setOne.add('a')
setOne.add('b')
setOne.add('c')

const setTwo = new MySet()

setTwo.add('c')
setTwo.add('d')
setTwo.add('e')
setTwo.add('f')

const setThree = setOne.uinon(setTwo)
console.log('合集')
setThree.show()

// 合集
// a b c d e f

const setFour = setOne.intersect(setTwo)
console.log('交集')
setFour.show()

// 交集
// c

const isSubset = setOne.subset(setTwo)
console.log('是否是补集', isSubset)

// 是否是补集 false

const setSix = setOne.difference(setTwo)
console.log('查看集合中不同的成员')
setSix.show()

// 查看集合中不同的成员
// a b
```
