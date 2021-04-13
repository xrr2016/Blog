---
title: JS 检查元素是否在视口内
categories:
  - 技术
tags:
  - WEB
  - JS
  - Viewport
date: 2021-04-13 10:50:51
---


![cover](./images/js-check-element/cover.jpg)

<!--more-->

## 前言

分享两个监测元素是否在视口内的方法

## 1. 位置计算


- 使用 `Element.getBoundingClientRect()` 方法返回元素相对于视口的位置

```javascript
const isElementVisible = (el) => {
	const rect = el.getBoundingClientRect();
};
```

- 获取浏览器窗口的宽高

```javascript
const isElementVisible = (el) => {
	const rect = el.getBoundingClientRect();
  const vWidth = window.innerWidth || document.documentElement.clientWidth;
  const vHeight = window.innerHeight || document.documentElement.clientHeight;
};
```

- 判断元素是否在视口内，如图所示
  
![Xnip2021-04-13_10-23-24.jpg](https://cdn.nlark.com/yuque/0/2021/jpeg/224563/1618280613646-4e71c246-5d11-45cc-9fb4-b2da5c557249.jpeg#align=left&display=inline&height=600&margin=%5Bobject%20Object%5D&name=Xnip2021-04-13_10-23-24.jpg&originHeight=600&originWidth=800&size=333703&status=done&style=none&width=800)

```javascript
const isElementVisible = (el) => {
  const rect = el.getBoundingClientRect()
  const vWidth = window.innerWidth || document.documentElement.clientWidth
  const vHeight = window.innerHeight || document.documentElement.clientHeight

  
  if (
    rect.right < 0 ||
    rect.bottom < 0 ||
    rect.left > vWidth ||
    rect.top > vHeight
  ) {
    return false
  }
}

```

## 2. Intersection Observer 


> The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's [viewport](https://developer.mozilla.org/en-US/docs/Glossary/Viewport).


Intersection Observer API提供了一种异步检测目标元素与祖先元素或 [viewport](https://developer.mozilla.org/en-US/docs/Glossary/Viewport) 相交情况变化的方法。在目标元素与视口或者其他指定元素发生交集时和触发配置的回调函数。


```javascript
// 获取要监测的元素
const boxes = document.querySelectorAll('.box')

// 创建观察者，配置回调函数
// 通过 isIntersecting 属性判断元素与视口是否相交
const observer = new IntersectionObserver((entries, observer) => {
 entries.forEach((entry) => {
    console.log(
      entry.target,
      entry.isIntersecting ? "visible" : "invisible"
    );
  });
})

boxes.forEach((box) => {
  observer.observe(box);
});
```

## 示例

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="xrr2016" data-slug-hash="ExZQOGL" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="js check element in viewport">
  <span>See the Pen <a href="https://codepen.io/xrr2016/pen/ExZQOGL">
  js check element in viewport</a> by Cold Stone (<a href="https://codepen.io/xrr2016">@xrr2016</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


## 参考

[how-to-check-an-element-is-in-viewport-4bcl](https://dev.to/narendersaini32/how-to-check-an-element-is-in-viewport-4bcl)

[Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)