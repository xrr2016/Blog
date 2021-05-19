---
title: 在服务器上搭建 npm 私服
date: 2019-08-08 15:33:00
tags:
  - Node
  - Docker
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/05/11/21/31/duckling-6246834_960_720.jpg
---

部门需要建一个 npm 私服，我查了一下发现有一个很好用的开源工具 Verdaccio，有 3 中方式可以在自己的服务器上搭建，以 Centos 为例

<!--more-->

## 前言

部门需要建一个 npm 私服，我查了一下发现有一个很好用的开源工具 [Verdaccio](https://github.com/verdaccio/verdaccio)，有 3 中方式可以在自己的服务器上搭建，以 Centos 为例

## 使用 Node.js 环境

首先需要在服务器上安装 node 环境

```bash
curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
```

```bash
sudo yum install nodejs
```

安装后检查 node 是否正确安装

```bash
node -v
```

然后安装 Verdaccio

```bash
npm install -g verdaccio
```

安装完成就可以使用了， 如果使用的是 root 用户会提示你不要使用 root 账户

```bash
verdaccio
```

但是这样退出后服务就停止了，所以需要 pm2 进行启动

全局安装 pm2

```bash
npm install -g pm2
```

使用 pm2 启动 Verdaccio

```bash
pm2 start verdaccio
```

## 使用 Docker

首先需要在服务器上安装 Docker，有了 Docker 之后就很简单了

拉取镜像

```bash
docker pull verdaccio/verdaccio
```

运行容器

```bash
docker run -d --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

## 使用 Cloudron

这种方式没试过，因为上面两种已经很方便了

链接 https://cloudron.io/button/org.eggertsson.verdaccio.html

## 访问

私服安装完成后可以通过 ip 地址+端口号的形式访问了 xxx.xxx.xxx.xxx:4873

要用域名访问的话就需要将自己的域名解析到服务器上去

## 参考文档

https://verdaccio.org/docs/en/installation
