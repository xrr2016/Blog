---
title: '了解 <link> 标签上 rel=prexxx 的作用'
date: '2019-07-22T17:39:27+08:00'
tags:
  - HTML
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/05/06/16/05/clouds-6233856_960_720.jpg
---

在 HTML 中 <link> 标签指定了当前文档与外部资源之间的关系，本文说明 <link> 标签的 rel 属性分别设置 dns-prefetch，preconnect，prefetch，preload，prerender 的时候有说明作用

<!--more-->

在 HTML 中 <link> 标签指定了当前文档与外部资源之间的关系
本文说明 <link> 标签的 rel 属性分别设置 dns-prefetch，preconnect，prefetch，preload，prerender 的时候有说明作用

dns-prefetch：向浏览器提示需要资源，允许浏览器在用户单击链接之前进行 DNS 查找和协议握手

preconnect：向浏览器提供提示，建议它提前打开与链接网站的连接，而不泄露任何私人信息或下载任何内容，以便在遵循链接时可以更快地获取链接的内容

prefetch：建议浏览器提前获取链接资源，因为它可能是用户请求的。 从 Firefox 44 开始，将考虑 crossorigin 属性的值，从而可以进行匿名预取

preload：告诉浏览器下载资源，因为稍后在当前导航期间将需要此资源

prerender：建议浏览器提前获取链接资源，并且它还在屏幕外渲染预取内容，以便在需要时可以快速呈现给用户

## 参考

[link_types](https://devdocs.io/html/link_types)

[preconnect-vs-dns-prefetch-resource-hints](https://stackoverflow.com/questions/47273743/preconnect-vs-dns-prefetch-resource-hints)
