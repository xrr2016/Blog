---
title: 从零开始的 Flutter 动画
categories:
  - 技术
tags:
  - Flutter
  - Animation
date: 2020-04-20 10:00:00
---

<!--more-->

## 前言

动画本质是在一段时间内不断改变屏幕上显示的内容，从而让人产生[视觉暂留](https://zh.wikipedia.org/wiki/%E8%A6%96%E8%A6%BA%E6%9A%AB%E7%95%99) 现象。

动画一般可分为两类：

**补间动画**：补间动画是一种预先定义物体运动的起点和终点，物体的运动方式，运动时间，时间曲线，然后从起点过渡到终点的动画。

**基于物理的动画**：基于物理的动画是一种模拟现实世界运动的动画，通过建立运动模型来实现。例如一个篮球🏀从高处落下，需要根据其下落高度，重力加速度，地面反弹力等影响因素来建立运动模型。

## Flutter 中的动画

Flutter 中有多种类型的动画，先从一个简单的例子开始，使用一个 `AnimatedContainer` 控件，然后设置动画时长 `duration`，最后调用 `setState` 方法改变需要动画的属性值，一个动画就创建了。

<img src="./images/flutter-animation-from-zero/animated-container.gif" alt="animated-container" style="width: 240px;" width="240">

代码如下

```dart
import 'package:flutter/material.dart';

class AnimatedContainerPage extends StatefulWidget {
  @override
  _AnimatedContainerPageState createState() => _AnimatedContainerPageState();
}

class _AnimatedContainerPageState extends State<AnimatedContainerPage> {
  // 初始的属性值
  double size = 100;
  double raidus = 25;
  Color color = Colors.yellow;

  void _animate() {
    // 改变属性值
    setState(() {
      size = size == 100 ? 200 : 100;
      raidus = raidus == 25 ? 100 : 25;
      color = color == Colors.yellow ? Colors.greenAccent : Colors.yellow;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Animated Container')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 在 AnimatedContainer 上应用属性值
            AnimatedContainer(
              width: size,
              height: size,
              curve: Curves.easeIn,
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(raidus),
              ),
              duration: Duration(seconds: 1),
              child: FlutterLogo(),
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _animate,
        child: Icon(Icons.refresh),
      ),
    );
  }
}

```

这是一个隐式动画，除此之外还有显式动画，Hreo 动画，交织动画。

## Flutter 动画基本概念

`Animation`

Flutter 中的动画系统基于 `Animation` 对象， 它是一个抽象类，保存了当前动画的值和状态（开始、暂停、前进、倒退），但不记录屏幕上显示的内容。UI 元素通过读取 `Animation` 对象的值和监听状态变化，然后运行 `build` 函数渲染到屏幕上形成动画效果。

一个 `Animation` 对象在一段时间内会持续生成介于两个值之间的值，比较常见的类型是 `Animation<double>`，除 `double` 类型之外还有 `Animation<Color>` 或者 `Animation<Size>` 等。

```dart
abstract class Animation<T> extends Listenable implements ValueListenable<T> {
  /// ...
}
```

`AnimationController`

带有控制方法的 `Animation` 对象，用来控制动画的启动，暂停，结束，设定动画运行时间。

```dart
class AnimationController extends Animation<double>
  with AnimationEagerListenerMixin, AnimationLocalListenersMixin, AnimationLocalStatusListenersMixin {
  /// ...
}
```

`Tween`

用来生成不同类型和范围的动画值。

```dart
// double 类型
Tween<double> tween = Tween<double>(begin: -200, end: 200);

// color 类型
ColorTween colorTween = ColorTween(begin: Colors.blue, end: Colors.yellow);

// border radius 类型
BorderRadiusTween radiusTween = BorderRadiusTween(
  begin: BorderRadius.circular(0.0),
  end: BorderRadius.circular(150.0),
);
```

`Curved`

Flutter 动画的默认运动过程是匀速的，线性的, 使用 `CurvedAnimation` 可以将时间曲线定义为非线性曲线。

```dart
Animation animation = CurvedAnimation(parent: controller, curve: Curves.easeIn);
```

`Ticker`

`Ticker` 用来添加每次屏幕刷新的回调函数 `TickerCallback`，每次屏幕刷新都会调用。类似于 Web 里面的 `requestAnimationFrame` 方法。

```dart
class Ticker {
  /// Creates a ticker that will call the provided callback once per frame while
  /// running.
  ///
  /// An optional label can be provided for debugging purposes. That label
  /// will appear in the [toString] output in debug builds.
  Ticker(this._onTick, { this.debugLabel }) {
    assert(() {
      _debugCreationStack = StackTrace.current;
      return true;
    }());
  }
  /// ...
}
```

## 隐式动画

隐式动画使用 Flutter 框架内置的动画部件创建，通过设置动画的起始值和最终值来触发。当使用 `setState` 方法改变部件的动画属性值时，框架会自动计算出一个从旧值过渡到新值的动画。

比如 `AnimatedOpacity` 部件，改变它的 `opacity` 值就可以触发动画。



<img src="./images/flutter-animation-from-zero/opacity-toggle.gif" alt="opacity-toggle" style="width: 240px;" width="240">

```dart
import 'package:flutter/material.dart';

class OpacityChangePage extends StatefulWidget {
  @override
  _OpacityChangePageState createState() => _OpacityChangePageState();
}

class _OpacityChangePageState extends State<OpacityChangePage> {
  double _opacity = 1.0;

  void _toggle() {
    _opacity = _opacity > 0 ? 0.0 : 1.0;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('隐式动画')),
      body: Center(
        child: AnimatedOpacity(
          opacity: _opacity,
          duration: Duration(seconds: 1),
          child: Container(
            width: 200,
            height: 200,
            color: Colors.blue,
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _toggle,
        child: Icon(Icons.play_arrow),
      ),
    );
  }
}

```

除了 `AnimatedOpacity` 外，还有其他的内置隐式动画部件如：`AnimatedContainer`, `AnimatedPadding`, `AnimatedPositioned`, `AnimatedSwitcher`， `AnimatedAlign` 等。

## 显式动画

显式动画是需要定义 `AnimationController` 的动画

## Hero 动画

Hero 动画指的是在页面切换时一个元素从旧页面运动到新页面的动画。Hero 动画需要使用两个 `Hero` 控件实现：一个用来在旧页面中，另一个在新页面。两个 `Hero` 控件需要使用相同的 `tag` 属性，并且不能与其他`tag`重复。

<img src="./images/flutter-animation-from-zero/hero-animation.gif" alt="hero-animation" style="width: 240px;" width="240">

代码如下

```dart
// 页面 1
import 'package:flutter/material.dart';

import 'hero_animation_page2.dart';

String cake1 = 'assets/images/cake01.jpg';
String cake2 = 'assets/images/cake02.jpg';

class HeroAnimationPage1 extends StatelessWidget {
  GestureDetector buildRowItem(context, String image) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(builder: (ctx) {
            return HeroAnimationPage2(image: image);
          }),
        );
      },
      child: Container(
        width: 100,
        height: 100,
        child: Hero(
          tag: image,
          child: ClipOval(child: Image.asset(image)),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('页面 1')),
      body: Column(
        children: <Widget>[
          SizedBox(height: 40.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: <Widget>[
              buildRowItem(context, cake1),
              buildRowItem(context, cake2),
            ],
          ),
        ],
      ),
    );
  }
}

// 页面 2
import 'package:flutter/material.dart';

class HeroAnimationPage2 extends StatelessWidget {
  final String image;

  const HeroAnimationPage2({@required this.image});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: <Widget>[
          SliverAppBar(
            expandedHeight: 400.0,
            title: Text('页面 2'),
            backgroundColor: Colors.grey[200],
            flexibleSpace: FlexibleSpaceBar(
              collapseMode: CollapseMode.parallax,
              background: Hero(
                tag: image,
                child: Container(
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage(image),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildListDelegate(
              <Widget>[
                Container(height: 600.0, color: Colors.grey[200]),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


```

## 交织动画

交织动画是由一系列的小动画组成的动画。每个小动画可以是连续或间断的，也可以相互重叠。其关键点在于使用 `Interval` 部件给每个小动画设置一个时间间隔，以及为每个动画的设置一个取值范围 `Tween`。最后使用一个 `AnimationController` 控制总体的动画状态。

`Interval` 继承至 `Curve` 类，通过设置属性 `begin` 和 `end` 来确定

```dart
class Interval extends Curve {
  /// ...

  /// 动画起始点
  final double begin;
  /// 动画结束点
  final double end;
  /// 动画缓动曲线
  final Curve curve;

  /// ...
}

```

一个例子

<img src="./images/flutter-animation-from-zero/staggered-animation.gif" alt="staggered-animation" style="width: 240px;" width="240">

这是一个由 5 个小动画组成的交织动画，宽度，高度，颜色，圆角，边框，每个动画都有自己的动画区间。

![staggered-animation-timeline](./images/flutter-animation-from-zero/staggered-animation-timeline.png)

代码如下

```dart
import 'package:flutter/material.dart';

class StaggeredAnimationPage extends StatefulWidget {
  @override
  _StaggeredAnimationPageState createState() => _StaggeredAnimationPageState();
}

class _StaggeredAnimationPageState extends State<StaggeredAnimationPage>
    with SingleTickerProviderStateMixin {
  AnimationController _controller;
  Animation<double> _width;
  Animation<double> _height;
  Animation<Color> _color;
  Animation<double> _border;
  Animation<BorderRadius> _borderRadius;

  void _play() {
    if (_controller.isCompleted) {
      _controller.reverse();
    } else {
      _controller.forward();
    }
  }

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: 5),
    );

    _width = Tween<double>(
      begin: 100,
      end: 300,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(
          0.0,
          0.2,
          curve: Curves.ease,
        ),
      ),
    );

    _height = Tween<double>(
      begin: 100,
      end: 300,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(
          0.2,
          0.4,
          curve: Curves.ease,
        ),
      ),
    );

    _color = ColorTween(
      begin: Colors.blue,
      end: Colors.yellow,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(
          0.4,
          0.6,
          curve: Curves.ease,
        ),
      ),
    );

    _borderRadius = BorderRadiusTween(
      begin: BorderRadius.circular(0.0),
      end: BorderRadius.circular(150.0),
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(
          0.6,
          0.8,
          curve: Curves.ease,
        ),
      ),
    );

    _border = Tween<double>(
      begin: 0,
      end: 25,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.8, 1.0),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('交织动画')),
      body: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (BuildContext context, Widget child) {
            return Container(
              width: _width.value,
              height: _height.value,
              decoration: BoxDecoration(
                color: _color.value,
                borderRadius: _borderRadius.value,
                border: Border.all(
                  width: _border.value,
                  color: Colors.orange,
                ),
              ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _play,
        child: Icon(Icons.refresh),
      ),
    );
  }
}

```





## 物理动画

物理动画是模拟现实世界物体运动的动画。需要建立物体的运动模型，以一个物体下落为例，这个运动受到物体的下落高度，重力加速度，地面的反作用力等因素的影响。

<img src="./images/flutter-animation-from-zero/throw-animation.gif" alt="throw-animation" style="width: 240px;" width="240">

```dart
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

class ThrowAnimationPage extends StatefulWidget {
  @override
  _ThrowAnimationPageState createState() => _ThrowAnimationPageState();
}

class _ThrowAnimationPageState extends State<ThrowAnimationPage> {
  // 球心高度
  double y = 70.0;
  // Y 轴速度
  double vy = -10.0;
  // 重力
  double gravity = 0.1;
  // 地面反弹力
  double bounce = -0.5;
  // 球的半径
  double radius = 50.0;
  // 地面高度
  final double height = 700;

  // 下落方法
  void _fall(_) {
    y += vy;
    vy += gravity;

    // 如果球体接触到地面，根据地面反弹力改变球体的 Y 轴速度
    if (y + radius > height) {
      y = height - radius;
      vy *= bounce;
    } else if (y - radius < 0) {
      y = 0 + radius;
      vy *= bounce;
    }

    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    // 使用一个 Ticker 在每次更新界面时运行球体下落方法
    Ticker(_fall)..start();
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(title: Text('物理动画')),
      body: Column(
        children: <Widget>[
          Container(
            height: height,
            child: Stack(
              children: <Widget>[
                Positioned(
                  top: y - radius,
                  left: screenWidth / 2 - radius,
                  child: Container(
                    width: radius * 2,
                    height: radius * 2,
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(child: Container(color: Colors.blue)),
        ],
      ),
    );
  }
}

```


## 动画原理

Flutter 中的动画系统基于类型化的 Animation 对象。Widgets 既可以通过读取当前值和监听状态变化直接合并动画到 build 函数，也可以作为传递给其他 widgets 的更精细动画的基础。


Ticker run every frame

SchedulerBinding 是一个暴露出 Flutter 调度原语的单例类。


在这一节，关键原语是帧回调。每当一帧需要在屏幕上显示时，Flutter 的引擎会触发一个 “开始帧” 回调，调度程序会将其多路传输给所有使用 scheduleFrameCallback() 注册的监听器。所有这些回调不管在任意状态或任意时刻都可以收到这一帧的绝对时间戳。由于所有回调收到时间戳都相同，因此这些回调触发的任何动画看起来都是完全同步的，即使它们需要几毫秒才能执行。

运行器
Ticker 类挂载在调度器的 scheduleFrameCallback() 的机制上，来达到每次运行都会触发回调的效果。

一个 Ticker 可以被启动和停止. 启动时，它会返回一个 Future，这个 Future 在 Ticker 停止时会被改为完成状态。

每次运行, Ticker 都会为回调函数提供从 Ticker 开始运行到现在的持续时间。

因为运行器总是会提供在自它们开始运行以来的持续时间，所以所有运行器都是同步的。如果你在两帧之间的不同时刻启动三个运行器，它们都会被同步到相同的开始时间，并随后同步运行。

## 总结一下

Flutter 中的动画有

- 隐式动画
- 显式动画
- Hero 动画
- 交织动画

## 参考

[动画效果介绍](https://flutter.cn/docs/development/ui/animations)

[在 Flutter 应用里实现动画效果](https://flutter.cn/docs/development/ui/animations/tutorial)
