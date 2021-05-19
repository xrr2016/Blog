---
title: 分享两道面试题
date: 2019-11-15 10:33:15
categories:
  - 面试
tags:
  - Interview
cover: https://cdn.pixabay.com/photo/2020/04/13/22/55/sugar-5040276_960_720.jpg
---

前几天遇到两个前端面试题，要写代码的那种，然后我都没做对...记录一下

<!--more-->

前几天遇到两个前端面试题，要写代码的那种，然后我都没做对...记录一下

## 第一题

> JavaScript 采用原型继承，即一个对象继承自另外一个对象，另外一个对象再继承自别的对象，依此往复。请写一个通用的 JavaScript 函数，来找出某个对象身上的某个属性继承自哪个对象。

解答: 实际上是在考察如何判断一个对象上的属性是本身的还是通过继承来的，使用 `hasOwnProperty` 和 `getPrototypeOf` 方法即可

{% include_code lang:javascript get-prototype.js %}

相关文章

[继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

## 第二题

> `URLSearchParams()`  可以解析和处理URL参数，目前兼容性一般，请实现 `class URLSearchParams` 的 polyfill。
>
> ```js
> searchParams = new URLSearchParams("foo=1&bar=2")
> // 或者这样传入
> searchParams = new URLSearchParams({foo: "1", bar: "2"})
> // 实例支持 get()、set()、has()、append() 四个方法
>
> // 支持以下方式
> searchParams.get("foo") // 1
> searchParams.set("foo", "10")
> searchParams.has("bar")
> searchParams.append("foo", "100")
> ```

解答：简单实现了下，看了 Github 上 `URLSearchParams` 的 polyfill 代码，发现这个还是有点复杂的

{% include_code lang:javascript url-search-params.js %}

相关文章

[URLSearchParams docs](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)

[URLSearchParams polyfill](https://github.com/ungap/url-search-params)

## 总结

自己太菜了，基础知识由于没有去回顾所以忘的很多，继续加油吧。
