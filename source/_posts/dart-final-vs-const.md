---
title: Dart 语言中的 final 与 const 的区别
tags:
  - Dart
date: '2019-07-16T17:23:06+08:00'
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/05/14/15/18/path-6253670_960_720.jpg
---

在 Dart 中有 `final` 和 `const` 两个关键字，貌似都是表示常量的，但是它们还是有区别的

<!--more-->

在 Dart 中有 `final` 和 `const` 两个关键字，貌似都是表示常量的，但是它们还是有区别的

final 变量的值只能被设置一次； const 变量在编译时就已经固定 (const 变量是隐式 final 的类型.) 最高级 final 变量或类变量在第一次使用时被初始化。

[官方文档](https://dart.dev/guides/language/language-tour#final-and-const)
