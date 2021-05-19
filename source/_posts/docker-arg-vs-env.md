---
title: Docker ARG vs ENV
categories:
  - 技术
date: 2019-10-25 14:12:19
tags:
  - Docker
cover: https://cdn.pixabay.com/photo/2021/05/14/08/44/running-6252827_960_720.jpg
---

构建 Docker 镜像的的时候有两种环境变量 `ARG` 和 `ENV`, 一种是在运行 build 命令时通过 `--build-arg` 参数设置的 build-time variables 以及通过在 `dockerfile` 里面设置 `ENV` 指令配置的环境变量。

<!--more-->

## 前言

构建 Docker 镜像的的时候有两种环境变量 `ARG` 和 `ENV`, 一种是在运行 build 命令时通过 `--build-arg` 参数设置的 build-time variables 以及通过在 `dockerfile` 里面设置 `ENV` 指令配置的环境变量，本文说明它们之间的区别。

## ARG

Dockerfile 里面的 ARG 指令定义了一个变量，在运行 `docker build` 命令时使用 `--build-arg <varname> = <value>` 参数将其传递给构建器。

```dockerfile
ARG <name>[=<default value>]
```

这种变量只存在于镜像构建的时候，一旦镜像构建完成就失效了，不要使用构建时变量来传递诸如 github 密钥，用户凭据等机密数据，构建时变量值可以使用 docker history 命令查看。

## ENV

Dockerfile 里面的 ENV 指令将环境变量 <key> 设置为值 <value>，这个变量将在构建阶段中所有后续指令的环境中使用。

```dockerfile
ENV <key> <value>
ENV <key>=<value> ...
```

使用 ENV 设置的环境变量将一直存在于构建镜像时以及镜像容器运行时，可以使用 docker inspect 查看设置打的变量。也可以使用 `docker run --env <key> = <value>` 来更改它们。

## 结语

如果只是需要构建镜像时的环境变量，使用 `ARG`，如果这个变量在容器运行时也有用到就需要用 `ENV`，注意使用 `ENV` 指令定义的环境变量会覆盖同名的 `ARG` 指令定义的变量。
