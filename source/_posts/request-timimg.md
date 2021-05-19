---
title: 浏览器请求耗时阶段解释
date: 2019-07-18T16:04:07+08:00
tags:
  - Browser
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/05/12/17/00/holly-blue-6248753_960_720.jpg
---

对于一个浏览器网络请求耗时阶段解释

<!--more-->

### Queueing

浏览器会在以下情况时将请求加入队列，有优先级更高的请求；当请求协议是 HTTP/1.0 和 HTTP/1.1 时，同一域名下已经有 6 个 TCP 链接；浏览器在分配磁盘缓存

### Stalled

由于排队中描述的任何原因，请求可能会停止

### DNS Lookup

浏览器正在解析请求的 IP 地址

### Proxy negotiation

浏览器与代理服务器协商请求

### Request sent

请求已经发出

### ServiceWorker Preparation

浏览器启动 service worker

### Request to ServiceWorker

请求已经向 service worker 发出

### Waiting (TTFB)

浏览器等待第一个字节返回，此时间包括 1 次往返延迟和服务器准备响应所用的时间。

### Content Download

浏览器接收响应，下载返回内容

### Receiving Push

浏览器收到通过 HTTP/2 Server Push 的响应

### Reading Push

浏览器正在读取之前获取存储到本地的数据
