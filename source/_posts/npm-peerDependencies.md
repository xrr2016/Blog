---
title: 什么是 peerDependencies
categories:
  - 技术
tags:
  - npm
date: 2020-11-29 19:30:00
---

`package.json` 里面的 `peerDependencies` 是什么意思

<!--more-->

## 前言

众所周知 `dependencies` 是项目的依赖包，`devDependencies` 项目开发阶段的依赖包，这些依赖包会在 `npm install` 过程中自动安装。

假设项目本身依赖 package A, 但是另一个 package B 同时依赖 package A，为了避免冲突，这时候就需要将 package A 设置为 package B 的
`peerDependencies`。

## 示例

假设项目 A 依赖 package B

```
{
  "dependencies": {
    "b": "^1.0.0"
  }
}
```

package B 有一个 `peerDependencies` package c

```
{
  "peerDependencies": {
    "c": "^1.x"
  }
}
```

那么在项目 A 安装 package B 的时候, 要求同时安装 package C 作为 A 的 `dependencies`。

总而言之 `peerDependencies` 是`宿主`项目安装给其他依赖包使用的 package。

> 注意: npm 1 和 2 版本会自动安装 peerDependencies。从 npm@3 开始将不再自动安装，而是得到一个警告，告知 `peerDependency` 没有被安装。

## 参考

[What are peer dependencies in a Node module?](https://flaviocopes.com/npm-peer-dependencies/)