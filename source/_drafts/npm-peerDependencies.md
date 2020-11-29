---
title: 什么是 peerDependencies
categories:
  - 技术
tags:
  - npm
date: 2020-11-26 14:20:02
---


`dependencies` 项目中的依赖包
`devDependencies` 项目开发阶段使用到的依赖包
`peerDependencies` 不会自动安装，而是要求使用这个 package 的项目安装这个依赖包

假设package A 依赖 B

```json
{
  "dependencies": {
    "b": "1.x"
  }
}
```

package B 有一个 peerDependencies c

```
{
  "peerDependencies": {
    "c": "1.x"
  }
}
```

那么在安装 B 的时候回要求同时安装 C 作为 A 的依赖。