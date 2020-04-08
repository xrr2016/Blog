---
title: 解答《在阿里我是如何当面试官的》里面的面试题
categories:
  - 技术
tags:
  - Interview
date: 2020-03-29 17:46:00
---

<!--more-->

## 前言

尝试解答[《在阿里我是如何当面试官的》](https://juejin.im/post/5e6ebfa86fb9a07ca714d0ec)这篇文章里面的面试题

## HTML 篇

1. 在 HTML 中如何做 SEO 优化？

> SEO 目的是提高网站在搜索引擎上的排名，主要的做法有
> - `<title>` 添加网页的标题
> - `<a href="" >` 添加网站外链
> - `<meta name="description" content="">` 添加网页描述信息
> - `<meta name="keywords" content="">` 添加网页关键字信息
> - `<meta name="robots" content="noindex, nofollow">` 添加机器人爬虫标签
> - `<header> <main> <footer> <section> <firgrue> <article>` 使用语义化标签
> - `<link rel="">` 添加当前文档与外部资源的关系标签
> - `<img src="" alt="">` 添加图片的 `alt` 属性

2. 首屏和白屏时间如何计算？

> 首屏时间：用户打开网站到首屏内容渲染完成的时间。
> ![firstprint](http://coding.imweb.io/img/p6/firstscreen.png)
> 白屏时间：浏览器请求页面到页面开始显示内容的时间。
> ![loaded](https://images2017.cnblogs.com/blog/978149/201708/978149-20170817153956537-520597283.png)
> 使用 `window.performance` 计算
>
> 参考:
> [前端优化-如何计算白屏和首屏时间](https://www.cnblogs.com/longm/p/7382163.html)
> [PerformanceNavigationTiming](https://wiki.developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming)

## CSS 篇

3. 了解 Flex 布局么？平常有使用 Flex 进行布局么？

> flex 布局是一种一维布局模型，给元素添加 `dispaly: flex;` 样式可将这个元素变为 flex 布局的父元素。flex 布局由主轴和交叉轴控制子元素在父元素上的排布，`flex-direction` 定义主轴的方向为横向或纵向，使用 `justify-content` 和 `align-items` 决定 flex 元素在主轴和交叉轴上的排布方式。
>
> [flex 布局的基本概念](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)
> [使用 CSS 弹性盒子](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)

4. CSS 中解决浮动中高度塌陷的方案有哪些？

>  高度塌陷是因为父元素没有设置高度而子元素设置浮动脱离文档流，此时父元素的高度就没有子元素撑起，导致父元素的高度塌陷，使用 `::after` 给父元素插入伪元素并设置 `clear: both;` 属性或者给父元素添加 `overflow: hidden;` 样式。

5. Flex 如何实现上下两行，上行高度自适应，下行高度 200px？

```html
<div class="parent">
  <div class="first"></div>
  <div class="second"></div>
</div>

<style>
  .parent {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .first {
    flex: 1;
    background-color: blue;
  }

  .second {
    height: 200px;
    background-color: yellow;
  }
</style>
```

6. 如何设计一个 4 列等宽布局，各列之间的边距是 10px（考虑浏览器的兼容性）？

```html
<div class="box">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</div>

<style>
/* 网格布局 */
.box {
  display: grid;
  grid-column-gap: 10px;
  height: 100vh;
}

.item {
  grid-row: 1;
  background-color: bisque;
}
/* 浮动布局 */
.box {
  overflow: hidden;
}

.item {
  float: left;
  height: 100px;
  width: calc(25% - 10px);
  margin-right: 10px;
  box-sizing: border-box;
  border: 1px solid grey;
  background-color: bisque;
}

.item:last-of-type {
  margin-right: 0;
}
</style>

```

7. CSS 如何实现三列布局，左侧和右侧固定宽度，中间自适应宽度？

8. CSS 清除浮动的原理是什么？

9. BFC 的作用有哪些？

BFC 全称为块级格式化上下文 (Block Formatting Context) 。BFC是 W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行定位以及与其他元素的关系和相互作用，当涉及到可视化布局的时候，Block Formatting Context提供了一个环境，HTML元素在这个环境中按照一定规则进行布局。一个环境中的元素不会影响到其它环境中的布局。比如浮动元素会形成BFC，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。这里有点类似一个BFC就是一个独立的行政单位的意思。可以说BFC就是一个作用范围，把它理解成是一个独立的容器，并且这个容器里box的布局与这个容器外的box毫不相干。

[什么是BFC](https://juejin.im/post/5d690c726fb9a06b155dd40d#heading-6)

10. CSS 中的 vertical-align 有哪些值？它在什么情况下才能生效？

11. CSS 中选择器有哪些？CSS 选择器优先级是怎么去匹配？

12. 伪元素和伪类有什么区别？

13. CSS 中的 background 的 background-image 属性可以和 background-color 属性一起生效么？

14. 了解 CSS 3 动画的硬件加速么？在重绘和重流方面有什么需要注意的点？

15. CSS 可以做哪些优化工作?

16. 浮动元素和绝对定位元素的区别和应用?

17. CSS 中哪些属性可以继承？

## JavaScript/TypeScript 篇

## React 篇

略

React 和 Vue 的区别？

## Vue 篇

Vue CLI 3 有哪些特性？

## 组件篇

## 设计模式篇

## 工程化篇

## 性能优化篇

## 服务篇

## 框架篇

## HTTP 篇

## 测试篇

## 优化篇

## 业务篇

## 笔试篇

## 混沌篇
