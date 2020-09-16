---
title: 使用 Flutter 绘制图表（三）折线图📈
categories:
  - 技术
tags:
  - Flutter
date: 2020-09-09 22:00:00
---

<!--more-->

## 前言

本文继续讲解使用 `CustomPaint` 绘制图表，这篇将绘制折线图，效果如下

[在线查看](https://dartpad.dartlang.org/b8a2b88647fa75df5d31445a93cb390f)

## Path 对象

开始之前先来了解一下 `Path` 对象

## 绘制坐标轴

```dart
void _drawAxis(Canvas canvas, Size size) {
  final double sw = size.width;
  final double sh = size.height;

  // 设置绘制属性
  final paint = Paint()
    ..color = Colors.black87
    ..style = PaintingStyle.stroke
    ..strokeWidth = 1.0
    ..isAntiAlias = true;

  // 创建一个 Path 对象，并规定它的路线
  final Path path = Path()
    ..moveTo(0.0, 0.0)
    ..lineTo(0.0, sh)
    ..lineTo(sw, sh);
  // 绘制路径
  canvas.drawPath(path, paint);
}
```

## 绘制圆点

## 圆点动画

## 绘制折线

## 折线动画(核心点)

## 附言

准备写一系列关于用 Flutter 画图表的文章，用来分享这方面的知识，这篇文章是这个系列的第三篇，预计 6 篇。

1. [使用 Flutter 绘制图表（一）柱状图 📊](https://coldstone.fun/post/2020/05/31/flutter-bar-chart/)
2. [使用 Flutter 绘制图表（二）饼状图 🍪](https://coldstone.fun/post/2020/06/09/flutter-pie-chart/)
3. [使用 Flutter 绘制图表（三）折线图 📈]()(本文)
4. 使用 Flutter 绘制图表（四）雷达图 🎯
5. 使用 Flutter 绘制图表（五）环状图 🍩
6. 使用 Flutter 绘制图表（六）条形图 📏
