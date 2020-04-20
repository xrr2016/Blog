---
title: 从零开始的 Flutter 动画
categories:
  - 技术
tags:
  - Flutter
  - Animation
date: 2020-04-20 10:00:00
---

本文讲解 Flutter 开发的核心之一动画

<!--more-->

## 前言

Flutter 中有多种类型的动画，合理运用动画能给应用用户带来更好的体验，下文说明这些不同种类的动画以及它们的效果。

## 基本的动画概念

动画可分为两类：

1. 补间动画

补间动画是一种定义了物体运动的起点和终点，以及物体的运动方式，运动时间，时间曲线，然后由框架计算出如何从起点过渡到终点的动画。

2. 物理动画

基于物理基础的动画是一种模拟现实世界运动的动画，通过建立物理运动模型来实现。例如一个篮球🏀从高处落下，需要根据其下落高度，重力加速度，地面反弹力等影响因素来建立运动模型。

## Flutter 中的动画

`Animation`

Flutter 中的动画系统基于类型化的 `Animation` 对象，它保存了当前动画的状态（开始、暂停、前进、倒退）和值，但不记录屏幕上显示的内容。UI 部件通过读取 `Animation` 对象的值和监听状态变化运行 `build` 函数，然后渲染到屏幕上，形成动画效果。

一个 `Animation` 对象在一段时间内会持续生成介于两个值之间的值，比较常见的动画类型是  `Animation<double>`，动画还可以插入除 `double` 以外的类型，比如 `Animation<Color>` 或者 `Animation<Size>`。


`AnimationController`

通过实例化一个 `controller` 来控制动画的启动，暂停，结束，设定动画运行时间等， `vsync` 参数防止后台动画消耗不必要的资源。

```dart
AnimationController controller = AnimationController(duration: const Duration(seconds: 2), vsync: this);
```

`CurvedAnimation`

动画的时间曲线默认是线性的, `CurvedAnimation` 可以将时间曲线定义为非线性曲线。

```dart
Animation animation = CurvedAnimation(parent: controller, curve: Curves.easeIn);
```

`Tween`

`Tween` 实例对象提供起始值和结束值， 是提供 evaluate(Animation<double> animation) 方法，将映射函数应用于动画当前值

```dart
tween = Tween<double>(begin: -200, end: 0);
```

动画通知
一个 Animation 对象可以有不止一个 Listener 和 StatusListener，用 addListener() 和 addStatusListener() 来定义。当动画值改变时调用 Listener。Listener 最常用的操作是调用 setState() 进行重建。当一个动画开始，结束，前进或后退时，会调用 StatusListener，用 AnimationStatus 来定义。下一部分有关于 addListener() 方法的示例，在 监控动画过程 中也有 addStatusListener() 的示例。


## 隐式动画

内置隐式动画指的是 Flutter 框架内置的动画部件，通过设置动画的起始值和最终值来触发，如 `PositionTransition`，

[Animation and motion widgets](https://flutter.cn/docs/development/ui/widgets/animation)

使用Flutter的动画库，您可以在UI中为小部件添加动作并创建视觉效果。 库中设置的一个小部件可以为您管理动画。 这些窗口小部件从它们实现的ImplicitlyAnimatedWidget 类派生而来统称为隐式动画或隐式动画小部件。 对于隐式动画，您可以通过设置目标值来设置小部件属性的动画。 每当目标值更改时，小部件就会将属性从旧值设置为新值。 通过这种方式，隐式动画为方便起见而对控件进行了交易-它们管理动画效果，因此您不必这样做。

这些小部件会自动为其属性进行动画更改。当您使用新的属性值（例如StatefulWidget的setState）重建窗口小部件时，该窗口小部件会处理将动画从以前的值驱动到新值的过程。

这些小部件称为隐式动画小部件。当您需要向应用程序中添加动画时，它们通常是您要做的第一件事。它们提供了一种在不增加额外复杂性的情况下添加动画的方法。

AnimatedContainer是一个功能强大的隐式动画小部件，因为它具有许多会影响其外观的属性，并且所有这些属性都会自动插值。

```dart
import 'package:flutter/material.dart';

const owl_url = 'https://raw.githubusercontent.com/flutter/website/master/src/images/owl.jpg';

class FadeInDemo extends StatefulWidget {
  _FadeInDemoState createState() => _FadeInDemoState();
}

class _FadeInDemoState extends State<FadeInDemo> {
  double opacityLevel = 0.0;

  @override
  Widget build(BuildContext context) {
    return Column(children: <Widget>[
      Image.network(owl_url),
      MaterialButton(
        child: Text(
          'Show details',
          style: TextStyle(color: Colors.blueAccent),
        ),
        onPressed: () => setState(() {
          opacityLevel = 1.0;
        }),
      ),
      AnimatedOpacity(
        duration: Duration(seconds: 3),
        opacity: opacityLevel,
        child: Column(
          children: <Widget>[
            Text('Type: Owl'),
            Text('Age: 39'),
            Text('Employment: None'),
          ],
        ),
      )
    ]);
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: Center(
          child: FadeInDemo(),
        ),
      ),
    );
  }
}

Future<void> main() async {
  runApp(
    MyApp(),
  );
}


```

```dart
import 'dart:math';

import 'package:flutter/material.dart';

const _duration = Duration(milliseconds: 400);

double randomBorderRadius() {
  return Random().nextDouble() * 64;
}

double randomMargin() {
  return Random().nextDouble() * 64;
}

Color randomColor() {
  return Color(0xFFFFFFFF & Random().nextInt(0xFFFFFFFF));
}

class AnimatedContainerDemo extends StatefulWidget {
  _AnimatedContainerDemoState createState() => _AnimatedContainerDemoState();
}

class _AnimatedContainerDemoState extends State<AnimatedContainerDemo> {
  Color color;
  double borderRadius;
  double margin;

  @override
  void initState() {
    super.initState();
    color = Colors.deepPurple;
    borderRadius = randomBorderRadius();
    margin = randomMargin();
  }

  void change() {
    setState(() {
      color = randomColor();
      borderRadius = randomBorderRadius();
      margin = randomMargin();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          children: <Widget>[
            SizedBox(
              width: 128,
              height: 128,
              child: AnimatedContainer(
                margin: EdgeInsets.all(margin),
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(borderRadius),
                ),
                duration: _duration,
              ),
            ),
            MaterialButton(
              color: Theme.of(context).primaryColor,
              child: Text(
                'change',
                style: TextStyle(color: Colors.white),
              ),
              onPressed: () => change(),
            ),
          ],
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: AnimatedContainerDemo(),
    );
  }
}

Future<void> main() async {
  runApp(
    MyApp(),
  );
}

```


## 显式动画

## Hero 动画

Hero 动画指的是同一个部件在页面切换时从旧页面运动到新页面的动画。

使用 `Hero` 部件包裹需要运动的部件，在不同页面分别使用两个 hero widgets，同时使用配对的标签来实现动画。
Hero 动画需要使用两个 Hero widgets 来实现：一个用来在原页面中描述 widget，另一个在目标页面中描述 widget。从用户角度来说，hero 似乎是分享的，只有程序员需要了解实施细节。

## 交织动画

动画被分解成较小的动作，其中一些动作被延迟。这些小动画可以是连续的，也可以部分或完全重叠。

## 物理动画



## Simple animations

[simple_animations](https://pub.flutter-io.cn/packages/simple_animations) 是 Flutter 社区里一个优秀的创建动画第三方库，可以简化创建自定义动画操作。


SchedulerBinding 是一个暴露出 Flutter 调度原语的单例类。


在这一节，关键原语是帧回调。每当一帧需要在屏幕上显示时，Flutter 的引擎会触发一个 “开始帧” 回调，调度程序会将其多路传输给所有使用 scheduleFrameCallback() 注册的监听器。所有这些回调不管在任意状态或任意时刻都可以收到这一帧的绝对时间戳。由于所有回调收到时间戳都相同，因此这些回调触发的任何动画看起来都是完全同步的，即使它们需要几毫秒才能执行。

运行器
Ticker 类挂载在调度器的 scheduleFrameCallback() 的机制上，来达到每次运行都会触发回调的效果。

一个 Ticker 可以被启动和停止. 启动时，它会返回一个 Future，这个 Future 在 Ticker 停止时会被改为完成状态。

每次运行, Ticker 都会为回调函数提供从 Ticker 开始运行到现在的持续时间。

因为运行器总是会提供在自它们开始运行以来的持续时间，所以所有运行器都是同步的。如果你在两帧之间的不同时刻启动三个运行器，它们都会被同步到相同的开始时间，并随后同步运行。

## 动画原理

Flutter 中的动画系统基于类型化的 Animation 对象。Widgets 既可以通过读取当前值和监听状态变化直接合并动画到 build 函数，也可以作为传递给其他 widgets 的更精细动画的基础。

Ticker run every frame

## 结语

## 参考

[动画效果介绍](https://flutter.cn/docs/development/ui/animations)

[在 Flutter 应用里实现动画效果](https://flutter.cn/docs/development/ui/animations/tutorial)
