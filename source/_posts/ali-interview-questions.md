---
title: 阿里的三道面试题
categories:
  - 面试
tags:
  - Interview
date: 2020-07-22 16:54:41
---

<!--more-->

## 前言

前几天参加了一场阿里前端岗位的面试，做了三道面试题分享一下。

## 第一题
```
根据表达式计算字母数。
说明：
  给定一个描述字母数量的表达式，计算表达式里的每个字母实际数量
  表达式格式：
    字母紧跟表示次数的数字，如 A2B3
    括号可将表达式局部分组后跟上数字，(A2)2B
    数字为1时可缺省，如 AB3。
示例：
  countOfLetters('A2B3'); // { A: 2, B: 3 }
  countOfLetters('A(A3B)2'); // { A: 7, B: 2 }
  countOfLetters('C4(A(A3B)2)2'); // { A: 14, B: 4, C: 4 }

function countOfLetters(letters, res) {
  /** 代码实现 */
}
```

搜索了一下，发现是 https://leetcode-cn.com/problems/number-of-atoms/ 726. 原子的数量

## 第二题

```
实现一个`Foo`方法，接受函数`func`和时间`wait`，返回一个新函数，新函数即时连续多次执行，但也只限制在`wait`的时间执行一次。

function Foo(func, wait) {
  /* 代码实现 */
}
```

```js
let timeout
  let args = arguments

  return function(args) {
    if(timeout) {
      return
    }
    timeout = setTimeout(() => {
      func.call(this, args)
      clearTimeout(timeout)
    }, wait)
  }
```

## 第三题

```
对象扁平化
  说明：请实现 flatten(input) 函数，input 为一个 javascript 对象（Object 或者 Array），返回值为扁平化后的结果。
  示例：
    var input = {
      a: 1,
      b: [ 1, 2, { c: true }, [ 3 ] ],
      d: { e: 2, f: 3 },
      g: null,
    }
    var output = flatten(input);
    output如下
    {
      "a": 1,
      "b[0]": 1,
      "b[1]": 2,
      "b[2].c": true,
      "b[3][0]": 3,
      "d.e": 2,
      "d.f": 3,
      // "g": null,  值为null或者undefined，丢弃
   }

  function flatten(input) {
    /** 代码实现 */
  }
```

```js
function flatten(input, key, res, isObject = false) {
  res = res || {}

  for(k in input) {
    const val = input[k]

    if(typeof val === 'object') {
      let temp = key + k + '.'

      flatten(val, temp, res, true)
    } else if(Array.isArray(val)) {
      let temp = `${key}[${k}].`

      flatten(val, temp, res)
    } else {
      let temp = isObject ? `${key}.${k}`  : `${key}[${k}].`

      res[temp] = input[k]
    }
  }

  return res
}
```

## 后记

面试的时候第一题完全没思路，第二，三题勉强写出来了。意料之中面试没通过，哎😔。
