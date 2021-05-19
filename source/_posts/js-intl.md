---
title: 使用 Intl 对象进行日期时间格式化
date: 2019-10-05 12:04:00
tags:
  - JS
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2020/05/27/11/01/leaves-5226759_960_720.jpg
---

本文主要说明如何使用浏览器自带的 Intl 对象进行日期时间的格式化

<!--more-->

## 前言

平时项目中要对日期时间格式化通常会使用如 [dayjs](https://github.com/iamkun/dayjs)，[date-fns](https://github.com/date-fns/date-fns)，[moment](https://github.com/moment/moment) 这些第三方库，但是我们可能只需要某几个方法，却安装了一整个库，大大增加了项目的体积，具体可以看这篇文章的数据 [You-Dont-Need-Momentjs](https://github.com/you-dont-need/You-Dont-Need-Momentjs)。本文主要说明如何使用浏览器自带的 Intl 对象进行日期时间的格式化

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl)

> Intl 对象是 ECMAScript 国际化 API 的一个命名空间，它提供了精确的字符串对比、数字格式化，和日期时间格式化。Collator，NumberFormat 和 DateTimeFormat 对象的构造函数是 Intl 对象的属性。本页文档内容包括了这些属性，以及国际化使用的构造器和其他语言的方法等常见的功能。

## 日期时间格式化

要对日期时间格式化就要使用 `Intl.DateTimeFormat` 对象，它是根据语言来格式化日期和时间的构造函数。

### 语法

第一个参数是语言代码，第二个参数是构造函数的选项，都是可选的

```js
new Intl.DateTimeFormat([locales[, options]])
```

### 简单使用

```js
const date = new Date()

console.log(new Intl.DateTimeFormat('en-US').format(date))
// "10/8/2019"

console.log(new Intl.DateTimeFormat('zh-CN').format(date))
// "2019/10/8"

console.log(
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }).format(date)
)
// "2019年10月8日星期二 15:07:04"
```

### 详细使用

参考文档 [Intl.DateTimeFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)

## 相对时间格式化

使用 Intl.RelativeTimeFormat 对相对时间进行格式化

### 语法

同上，第一个参数是语言代码，第二个参数是构造函数的选项，都是可选的

```js
new Intl.RelativeTimeFormat([locales[, options]])
```

### 简单使用

```js
const rtf = new Intl.RelativeTimeFormat('zh-CN')

console.log(rtf.format(-3, 'day'))
// "3天前"

console.log(rtf.format(3, 'day'))
// "3天后"

console.log(rtf.format(3, 'minute'))
// "3分钟后"

console.log(rtf.format(-3, 'second'))
// "3秒钟前"
```

### 详细使用

参考文档 [Intl.RelativeTimeFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RelativeTimeFormat#%E5%8F%82%E6%95%B0)

## 参考

[Intl](https://www.zhangxinxu.com/wordpress/2019/09/js-intl-zh/)
[JS Intl 对象完整简介及在中文中的应用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl)
