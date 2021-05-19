---
title: 用 Flutter 实现探探卡片布局
categories:
  - 技术
tags:
  - Flutter
date: 2020-06-18 12:22:08
cover: ./images/flutter-tinder-card/cover.png
---

前几天写了一个 Fluter 插件 tcard，用来实现类似于探探卡片的布局。

<!--more-->

## 前言

前几天写了一个 Fluter 插件 [tcard](https://github.com/xrr2016/tcard)，用来实现类似于探探卡片的布局。效果如下，本文讲解如何使用 `Stack` 控件实现这个布局。

<img src="./images/flutter-tinder-card/images.gif" width="900" style="width: 500px">

[在线查看](https://dartpad.dev/efe152273d6835af5cec6d8f40ab0c58)

## 初识 Stack

`Stack` 是一个有多子项的控件，它会将自己的子项相对于自身边缘进行定位，后面的子项会覆盖前面的子项。通常用来实现将一个控件覆盖于另一个控件之上的布局，比如在一张图片上显示一些文字。子项的默认位置在 `Stack` 左上角，也可以用 `Align` 或者 `Positioned` 控件分别进行定位。

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

要使用 `Stack` 实现这个卡片布局的大致思路如下

1. 首先需要前，中，后三个子控件，使用 `Align` 控件定位在容器中。
2. 需要一个手势监听器 `GestureDetector` 监听手指滑动。
3. 监听手指在屏幕上滑动同时更新最前面卡片的位置。
4. 判断移动的横轴距离进行卡片位置变换动画或者卡片回弹动画。
5. 如果运行了卡片位置变换动画在动画结束后更新卡片的索引值。

## 卡片布局

1. 创建 `Stack` 容器以及前，中，后三个子控件

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

2. 对子控件分别定位并设置其尺寸

定位需要设置 `Align` 控件的 alignment 属性，传入一个 `Alignment(x, y)` 进行设置。设置尺寸需要使用 `LayoutBuilder` 获取当前父容器的尺寸，然后根据容器尺寸进行计算。

```dart
class _MyAppState extends State<MyApp> {
  //  前面的卡片，使用 Align 定位
  Widget _frontCard(BoxConstraints constraints) {
    return Align(
      alignment: Alignment(0.0, -0.5),
      // 使用 SizedBox 确定卡片尺寸
      child: SizedBox.fromSize(
        // 计算卡片尺寸，相对于父容器
        size: Size(constraints.maxWidth * 0.9, constraints.maxHeight * 0.9),
        child: Container(
          color: Colors.blue,
        ),
      ),
    );
  }

  // 中间的卡片，使用 Align 定位
  Widget _middleCard(BoxConstraints constraints) {
    return Align(
      alignment: Alignment(0.0, 0.0),
      child: SizedBox.fromSize(
        // 计算卡片尺寸，相对于父容器
        size: Size(constraints.maxWidth * 0.85, constraints.maxHeight * 0.9),
        child: Container(
          color: Colors.red,
        ),
      ),
    );
  }

  // 后面的卡片，使用 Align 定位
  Widget _backCard(BoxConstraints constraints) {
    return Align(
      alignment: Alignment(0.0, 0.5),
      child: SizedBox.fromSize(
        // 计算卡片尺寸，相对于父容器
        size: Size(constraints.maxWidth * 0.8, constraints.maxHeight * .9),
        child: Container(
          color: Colors.green,
        ),
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
            child: LayoutBuilder(
              builder: (context, constraints) {
                // 使用 LayoutBuilder 获取容器的尺寸，传个子项计算卡片尺寸
                return Stack(
                  children: [
                    // 后面的子项会显示在上面，所以前面的卡片放在最后
                    _backCard(constraints),
                    _middleCard(constraints),
                    _frontCard(constraints),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}

```

<img src="./images/flutter-tinder-card/align.png" width="560" style="width: 280px">

3. 更新最前面卡片位置

向 `Stack` 容器添加一个 `GestureDetector`，手指在屏幕上移动时更新最前面卡片的位置。

```dart
class _MyAppState extends State<MyApp> {
  // 保存最前面卡片的定位
  Alignment _frontCardAlignment = Alignment(0.0, -0.5);
  // 保存最前面卡片的旋转角度
  double _frontCardRotation = 0.0;

  //  前面的卡片，使用 Align 定位
  Widget _frontCard(BoxConstraints constraints) {
    return Align(
      alignment: _frontCardAlignment,
      // 使用 Transform.rotate 旋转卡片
      child: Transform.rotate(
        angle: (pi / 180.0) * _frontCardRotation,
        // 使用 SizedBox 确定卡片尺寸
        child: SizedBox.fromSize(
          size: Size(constraints.maxWidth * 0.9, constraints.maxHeight * 0.9),
          child: Container(
            color: Colors.blue,
          ),
        ),
      ),
    );
  }

  // 省略......

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
            child: LayoutBuilder(
              builder: (context, constraints) {
                // 使用 LayoutBuilder 获取容器的尺寸，传个子项计算卡片尺寸
                Size size = MediaQuery.of(context).size;
                double speed = 10.0;

                return Stack(
                  children: [
                    // 后面的子项会显示在上面，所以前面的卡片放在最后
                    _backCard(constraints),
                    _middleCard(constraints),
                    _frontCard(constraints),
                    // 使用一个占满父元素的 GestureDetector 监听手指移动
                    SizedBox.expand(
                      child: GestureDetector(
                        onPanDown: (DragDownDetails details) {},
                        onPanUpdate: (DragUpdateDetails details) {
                          // 手指移动就更新最前面卡片的 alignment 属性
                          _frontCardAlignment += Alignment(
                            details.delta.dx / (size.width / 2) * speed,
                            details.delta.dy / (size.height / 2) * speed,
                          );
                          // 设置最前面卡片的旋转角度
                          _frontCardRotation = _frontCardAlignment.x;
                          // setState 更新界面
                          setState(() {});
                        },
                        onPanEnd: (DragEndDetails details) {},
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
```

<img src="./images/flutter-tinder-card/pan.gif" width="260" style="width: 280px">

## 卡片动画

这个布局有三种动画，最前面卡片移开的动画；后面两张卡片位置和尺寸变化的动画；最前面卡片回到原位的动画。

1. 判断卡片横轴移动距离

在手指离开屏幕时判断卡片横轴的移动距离，如果最前面的卡片横轴移动距离超过限制就运行换位动画，否则运行回弹动画。

```dart
// 改变位置的动画
void _runChangeOrderAnimation() {}

// 卡片回弹的动画
void _runReboundAnimation(Offset pixelsPerSecond, Size size) {}

// 省略...

// 卡片横轴距离限制
final double limit = 10.0;

SizedBox.expand(
  child: GestureDetector(
    // 省略...
    onPanEnd: (DragEndDetails details) {
      // 如果最前面的卡片横轴移动距离超过限制就运行换位动画，否则运行回弹动画
      if (_frontCardAlignment.x > limit ||
          _frontCardAlignment.x < -limit) {
        _runChangeOrderAnimation();
      } else {
        _runReboundAnimation(
          details.velocity.pixelsPerSecond,
          size,
        );
      }
    },
  ),
),
```

2. 卡片回弹动画

首先实现卡片回弹的动画，使用 `AnimationController` 控制动画，在 `initState` 初始化动画控制器。创建一个 `AlignmentTween` 设置动画运动值，起始值是卡片当前位置，最终值是卡片的默认位置。然后将一个弹簧模拟 `SpringSimulation` 传递给动画控制器，让动画模拟运行。

```dart
class _MyAppState extends State<MyApp> with TickerProviderStateMixin {
  // 省略...
  // 卡片回弹动画
  Animation<Alignment> _reboundAnimation;
  // 卡片回弹动画控制器
  AnimationController _reboundController;

  // 省略...

  // 卡片回弹的动画
  void _runReboundAnimation(Offset pixelsPerSecond, Size size) {
    // 创建动画值
    _reboundAnimation = _reboundController.drive(
      AlignmentTween(
        // 起始值是卡片当前位置，最终值是卡片的默认位置
        begin: _frontCardAlignment,
        end: Alignment(0.0, -0.5),
      ),
    );
    // 计算卡片运动速度
    final double unitsPerSecondX = pixelsPerSecond.dx / size.width;
    final double unitsPerSecondY = pixelsPerSecond.dy / size.height;
    final unitsPerSecond = Offset(unitsPerSecondX, unitsPerSecondY);
    final unitVelocity = unitsPerSecond.distance;
    // 创建弹簧模拟的定义
    const spring = SpringDescription(mass: 30, stiffness: 1, damping: 1);
    // 创建弹簧模拟
    final simulation = SpringSimulation(spring, 0, 1, -unitVelocity);
    // 根据给定的模拟运行动画
    _reboundController.animateWith(simulation);
    // 重置旋转值
    _frontCardRotation = 0.0;
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    // 初始化回弹的动画控制器
    _reboundController = AnimationController(vsync: this)
      ..addListener(() {
        setState(() {
          // 动画运行时更新最前面卡片的 alignment 属性
          _frontCardAlignment = _reboundAnimation.value;
        });
      });
  }
  // 省略...
}
```

<img src="./images/flutter-tinder-card/rebound.gif" width="536" style="width: 280px">

3. 卡片换位动画

卡片换位动画就是将最前面的卡片移除可视区，将中间的卡片移动到最前面，将最后的卡片移动到中间，然后新建一个最后面的卡片。在卡片更换位置的同时需要改变卡片的尺寸，位置动画和尺寸动画同时进行。首先定义每个卡片运动时的动画值

```dart
/// 卡片尺寸
class CardSizes {
  static Size front(BoxConstraints constraints) {
    return Size(constraints.maxWidth * 0.9, constraints.maxHeight * 0.9);
  }

  static Size middle(BoxConstraints constraints) {
    return Size(constraints.maxWidth * 0.85, constraints.maxHeight * 0.9);
  }

  static Size back(BoxConstraints constraints) {
    return Size(constraints.maxWidth * 0.8, constraints.maxHeight * .9);
  }
}

/// 卡片位置
class CardAlignments {
  static Alignment front = Alignment(0.0, -0.5);
  static Alignment middle = Alignment(0.0, 0.0);
  static Alignment back = Alignment(0.0, 0.5);
}

/// 卡片运动动画
class CardAnimations {
  /// 最前面卡片的消失动画值
  static Animation<Alignment> frontCardDisappearAnimation(
    AnimationController parent,
    Alignment beginAlignment,
  ) {
    return AlignmentTween(
      begin: beginAlignment,
      end: Alignment(
        beginAlignment.x > 0
            ? beginAlignment.x + 30.0
            : beginAlignment.x - 30.0,
        0.0,
      ),
    ).animate(
      CurvedAnimation(
        parent: parent,
        curve: Interval(0.0, 0.5, curve: Curves.easeIn),
      ),
    );
  }

  /// 中间卡片位置变换动画值
  static Animation<Alignment> middleCardAlignmentAnimation(
    AnimationController parent,
  ) {
    return AlignmentTween(
      begin: CardAlignments.middle,
      end: CardAlignments.front,
    ).animate(
      CurvedAnimation(
        parent: parent,
        curve: Interval(0.2, 0.5, curve: Curves.easeIn),
      ),
    );
  }

  /// 中间卡片尺寸变换动画值
  static Animation<Size> middleCardSizeAnimation(
    AnimationController parent,
    BoxConstraints constraints,
  ) {
    return SizeTween(
      begin: CardSizes.middle(constraints),
      end: CardSizes.front(constraints),
    ).animate(
      CurvedAnimation(
        parent: parent,
        curve: Interval(0.2, 0.5, curve: Curves.easeIn),
      ),
    );
  }

  /// 最后面卡片位置变换动画值
  static Animation<Alignment> backCardAlignmentAnimation(
    AnimationController parent,
  ) {
    return AlignmentTween(
      begin: CardAlignments.back,
      end: CardAlignments.middle,
    ).animate(
      CurvedAnimation(
        parent: parent,
        curve: Interval(0.4, 0.7, curve: Curves.easeIn),
      ),
    );
  }

  /// 最后面卡片尺寸变换动画值
  static Animation<Size> backCardSizeAnimation(
    AnimationController parent,
    BoxConstraints constraints,
  ) {
    return SizeTween(
      begin: CardSizes.back(constraints),
      end: CardSizes.middle(constraints),
    ).animate(
      CurvedAnimation(
        parent: parent,
        curve: Interval(0.4, 0.7, curve: Curves.easeIn),
      ),
    );
  }
}
```

使用一个 `AnimationController` 控制动画运行，动画运行时在卡片上应用以上的动画值，否则使用卡片默认的位置和尺寸。

```dart
class _MyAppState extends State<MyApp> with TickerProviderStateMixin {

  // 省略...

  // 卡片位置变换动画控制器
  AnimationController _cardChangeController;

  //  前面的卡片，使用 Align 定位
  Widget _frontCard(BoxConstraints constraints) {
    // 判断动画是否在运行
    bool forward = _cardChangeController.status == AnimationStatus.forward;

    // 使用 Transform.rotate 旋转卡片
    Widget rotate = Transform.rotate(
      angle: (pi / 180.0) * _frontCardRotation,
      // 使用 SizedBox 确定卡片尺寸
      child: SizedBox.fromSize(
        size: CardSizes.front(constraints),
        child: Container(
          color: Colors.blue,
        ),
      ),
    );

    // 在动画运行时使用动画值
    if (forward) {
      return Align(
        alignment: CardAnimations.frontCardDisappearAnimation(
          _cardChangeController,
          _frontCardAlignment,
        ).value,
        child: rotate,
      );
    }

    // 否则使用默认值
    return Align(
      alignment: _frontCardAlignment,
      child: rotate,
    );
  }

  // 中间的卡片，使用 Align 定位
  Widget _middleCard(BoxConstraints constraints) {
    // 判断动画是否在运行
    bool forward = _cardChangeController.status == AnimationStatus.forward;
    Widget child = Container(color: Colors.red);

    // 在动画运行时使用动画值
    if (forward) {
      return Align(
        alignment: CardAnimations.middleCardAlignmentAnimation(
          _cardChangeController,
        ).value,
        child: SizedBox.fromSize(
          size: CardAnimations.middleCardSizeAnimation(
            _cardChangeController,
            constraints,
          ).value,
          child: child,
        ),
      );
    }

    // 否则使用默认值
    return Align(
      alignment: CardAlignments.middle,
      child: SizedBox.fromSize(
        size: CardSizes.middle(constraints),
        child: child,
      ),
    );
  }

  // 后面的卡片，使用 Align 定位
  Widget _backCard(BoxConstraints constraints) {
    // 判断动画是否在运行
    bool forward = _cardChangeController.status == AnimationStatus.forward;
    Widget child = Container(color: Colors.green);

    // 在动画运行时使用动画值
    if (forward) {
      return Align(
        alignment: CardAnimations.backCardAlignmentAnimation(
          _cardChangeController,
        ).value,
        child: SizedBox.fromSize(
          size: CardAnimations.backCardSizeAnimation(
            _cardChangeController,
            constraints,
          ).value,
          child: child,
        ),
      );
    }

    // 否则使用默认值
    return Align(
      alignment: CardAlignments.back,
      child: SizedBox.fromSize(
        size: CardSizes.back(constraints),
        child: child,
      ),
    );
  }

  // 改变位置的动画
  void _runChangeOrderAnimation() {
    _cardChangeController.reset();
    _cardChangeController.forward();
  }

  // 省略...

  @override
  void initState() {
    super.initState();
    // 省略...

    // 初始化卡片换位动画控制器
    _cardChangeController = AnimationController(
      duration: Duration(milliseconds: 1000),
      vsync: this,
    )
      ..addListener(() => setState(() {}))
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          // 动画运行结束后重置位置和旋转
          _frontCardRotation = 0.0;
          _frontCardAlignment = CardAlignments.front;
          setState(() {});
        }
      });
  }
  // 省略...
}
```

<img src="./images/flutter-tinder-card/foward.gif" width="260" style="width: 280px">

## 数据更新

可以看到动画运行之后三张卡片都恢复了默认的位置和尺寸，而需要的效果是当卡片换位动画完成后三张卡片的数据会改变，所以还需要在动画之后进行数据处理。

创建一个数组保存全部子项目，使用一个索引更新最前面卡片的子项索引，在卡片换位动画结束后索引值加一。

```dart
List<String> images = [
  'https://gank.io/images/5ba77f3415b44f6c843af5e149443f94',
  'https://gank.io/images/02eb8ca3297f4931ab64b7ebd7b5b89c',
  'https://gank.io/images/31f92f7845f34f05bc10779a468c3c13',
  'https://gank.io/images/b0f73f9527694f44b523ff059d8a8841',
  'https://gank.io/images/1af9d69bc60242d7aa2e53125a4586ad',
];

// 生成卡片数组
List<Widget> cards = List.generate(
  images.length,
  (int index) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        boxShadow: [
          BoxShadow(
            offset: Offset(0, 17),
            blurRadius: 23.0,
            spreadRadius: -13.0,
            color: Colors.black54,
          )
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16.0),
        child: Image.network(
          images[index],
          fit: BoxFit.cover,
        ),
      ),
    );
  },
);

void main() {
  // 使用生成的卡片数组
  runApp(MyApp(cards: cards));
}

class MyApp extends StatefulWidget {
  final List<Widget> cards;

  const MyApp({@required this.cards});

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with TickerProviderStateMixin {
  // 卡片列表
  final List<Widget> _cards = [];
  // 最前面卡片的索引
  int _frontCardIndex = 0;

  // 省略...

  //  前面的卡片，使用 Align 定位
  Widget _frontCard(BoxConstraints constraints) {
    // 判断是否还有卡片
    Widget card =
        _frontCardIndex < _cards.length ? _cards[_frontCardIndex] : Container();
    bool forward = _cardChangeController.status == AnimationStatus.forward;

    // 使用 Transform.rotate 旋转卡片
    Widget rotate = Transform.rotate(
      angle: (pi / 180.0) * _frontCardRotation,
      // 使用 SizedBox 确定卡片尺寸
      child: SizedBox.fromSize(
        size: CardSizes.front(constraints),
        // 使用数组中的子项
        child: card,
      ),
    );

   // 省略...
  }

  // 中间的卡片，使用 Align 定位
  Widget _middleCard(BoxConstraints constraints) {
    // 判断是否还有两张卡片
    Widget card = _frontCardIndex < _cards.length - 1
        ? _cards[_frontCardIndex + 1]
        : Container();
    // 省略...
  }

  // 后面的卡片，使用 Align 定位
  Widget _backCard(BoxConstraints constraints) {
    // 判断数组中是否还有三张卡片
    Widget card = _frontCardIndex < _cards.length - 2
        ? _cards[_frontCardIndex + 2]
        : Container();
    // 省略...
  }

  // 省略...

  @override
  void initState() {
    super.initState();
    // 初始化卡片数组
    _cards.addAll(widget.cards);

    // 省略...

    // 初始化卡片换位动画控制器
    _cardChangeController = AnimationController(
      duration: Duration(milliseconds: 1000),
      vsync: this,
    )
      ..addListener(() => setState(() {}))
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          // 动画结束后将最前面卡片的索引向前移动一位
          _frontCardIndex++;
          // 动画运行结束后重置位置和旋转
          _frontCardRotation = 0.0;
          _frontCardAlignment = CardAlignments.front;
          setState(() {});
        }
      });
  }

 // 省略...

return Stack(
  children: [
    // 省略...

    // 使用一个占满父元素的 GestureDetector 监听手指移动
    // 如果动画在运行中就不在响应手势
    _cardChangeController.status != AnimationStatus.forward
        ? SizedBox.expand(
            child: GestureDetector(
              // 省略...
            )
          )
        : IgnorePointer(),
  ],
}

```

至此整个布局就实现了 🎉

## 总结

这个布局的关键点在于
1. 三张卡片的定位
2. 监听手势更新最前面卡片的位置
3. 卡片的换位动画和回弹动画

作者已经封装了这个插件，地址是 https://pub.dev/packages/tcard 欢迎使用。

## 参考

[Stack class](https://api.flutter.dev/flutter/widgets/Stack-class.html)

[tinder_cards](https://github.com/Ivaskuu/tinder_cards)
