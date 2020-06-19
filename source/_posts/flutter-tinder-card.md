---
title: 用 Flutter 实现探探卡片布局
categories:
  - 技术
tags:
  - Flutter
date: 2020-06-18 12:22:08
---

![cards](./images/flutter-tinder-card/cover.png)

<!--more-->

## 前言

前几天写了一个 Fluter 插件 [tcard](https://pub.dev/packages/tcard)，用来实现类似于探探卡片的布局。效果如下

<img src="./images/flutter-tinder-card/colors.gif" width="520" style="width: 260px">

本文讲解如何使用 `Stack` 控件实现这个布局。

## 初识 Stack

`Stack` 是一个有多子项的控件，它会将子项相对于自身边缘进行定位，后面的子项会覆盖前面的子项。通常用来实现将一个控件覆盖于另一个控件之上的布局，比如在一张图片上显示一些文字。子项的默认位置在 `Stack` 左上角，也可以用 `Align` 或者 `Positioned` 控件分别进行定位。

<img src="https://flutter.github.io/assets-for-api-docs/assets/widgets/stack.png" style="width: 520px">

```dart
Stack(
  children: <Widget>[
    Container(
      width: 100,
      height: 100,
      color: Colors.red,
    ),
    Container(
      width: 90,
      height: 90,
      color: Colors.green,
    ),
    Container(
      width: 80,
      height: 80,
      color: Colors.blue,
    ),
  ],
)
```

[Stack (Flutter Widget of the Week)](https://youtu.be/liEGSeD3Zt8)

## 布局思路

实现这个卡片布局的大致思路如下

1. 首先需要前，中，后三个子控件，使用 `Align` 控件定位在容器中。
2. 需要一个手势监听器 `GestureDetector` 监听手指滑动。
3. 根据手指在屏幕上滑动时更新最前面卡片的位置。
4. 判断移动的横轴距离进行卡片位置变换动画或者卡片回弹动画。
5. 如果运行了卡片位置变换动画在动画结束后更新卡片的索引值。

## 卡片布局

第一步创建 `Stack` 容器以及前，中，后三个子控件。

```dart
class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  //  前面的卡片，使用 Align 定位
  Widget _frontCard() {
    return Align(
      child: Container(
        color: Colors.blue,
      ),
    );
  }

  // 中间的卡片，使用 Align 定位
  Widget _middleCard() {
    return Align(
      child: Container(
        color: Colors.red,
      ),
    );
  }

  // 后面的卡片，使用 Align 定位
  Widget _backCard() {
    return Align(
      child: Container(
        color: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TCards demo',
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: Center(
          child: SizedBox(
            width: 300,
            height: 400,
            child: Stack(
              children: [
                // 后面的子项会显示在上面，所以前面的卡片放在最后
                _backCard(),
                _middleCard(),
                _frontCard(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

<img src="./images/flutter-tinder-card/stack.png" width="560" style="width: 280px">

## 卡片运动

## 卡片动画

## 动画之后

## 总结

插件地址 https://github.com/xrr2016/tcard

## 参考

[Stack class](https://api.flutter.dev/flutter/widgets/Stack-class.html)

[tinder_cards](https://github.com/Ivaskuu/tinder_cards)
