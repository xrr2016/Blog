---
title: Flutter 创建自定义路由过渡动画
date: 2019-12-10 16:37:52
categories:
  - 技术
tags:
  - Flutter
cover: ./images/transition.jpg
---

Flutter 应用进行路由跳转的时候有默认的过渡动画，但是自定义的跳转动画会让应用更具特色

<!--more-->

## TL;DR

1. 使用 `PageRouteBuilder` 创建自定义路由
2. 在 `transitionsBuilder` 方法里创建过渡动画
3. 过渡动画示例
4. 定义全局路由过渡动画
5. 封装自定义路由

## 前言

在 `Flutter` 中使用 `Navigator.of(context).push(Route route);` 方法进行路由跳转时就需要传一个 `Route` 对象，通常使用 `MaterialPageRoute(builder: () {});` 创建，使用时会在路由跳转过程中添加默认的过渡动画。当需要自定义路由过渡动画时，就要使用 `PageRouteBuilder`，它是 `Flutter` 提供的用来创建自定义的路由的一个类，实例化这个类会得到一个路由对象 `Route`，要做的就是创建一个自定义的 `Route`。

## PageRouteBuilder

使用 `PageRouteBuilder` 创建自定义路由过渡动画时需要传入两个回调函数作为参数，一个必要参数 `pageBuilder`，这个函数用来创建跳转的页面，另一个函数 `transitionsBuilder`，这个函数就是实现过渡动画的地方。

> `transitionsBuilder` 的 `child` 参数是 `pageBuilder` 函数返回的一个 `transitionsBuilder widget` 部件， `pageBuilder` 方法仅会在第一次构建路由的时候被调用，`Flutter` 能够自动避免做额外的工作，整个过渡期间 `child` 保存了同一个实例。

```dart
PageRouteBuilder(
  pageBuilder: (
      BuildContext context,
      Animation<double> animation,
      Animation<double> secondaryAnimation,
    ) {
      return widget;
    },
    transitionsBuilder: (
      BuildContext context,
      Animation<double> animation,
      Animation<double> secondaryAnimation,
      Widget child,
    ) {
      return child;
    },
);
```

创建自定义路由需要继承 `PageRouteBuilder`，然后实现自定义路由的构造函数。

```dart
// 定义
class YourRoute extends PageRouteBuilder {
  final Widget page;

  YourRoute(this.page)
      : super(
          pageBuilder: (
            context,
            animation,
            secondaryAnimation,
          ) {
            return page;
          },
          transitionsBuilder: (
            context,
            animation,
            secondaryAnimation,
            child,
          ) {
            return child;
          },
        );
}

// 使用
Navigator.of(context).push(YourRoute(NewPage()));
```

## 示例

使用 `FirstPage` 和 `SecondPage` 两个页面展示效果

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: FirstPage(),
    );
  }
}

class FirstPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('First Page'),
        elevation: 0.0,
        backgroundColor: Colors.purple,
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Center(
            child: RaisedButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => SecondPage()),
                );
              },
              child: Text('Next Page'),
            ),
          )
        ],
      ),
      backgroundColor: Colors.purple,
    );
  }
}

class SecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Second Page'),
        elevation: 0.0,
        backgroundColor: Colors.deepPurpleAccent,
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Center(
            child: RaisedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text('Go Back'),
            ),
          )
        ],
      ),
      backgroundColor: Colors.deepPurpleAccent,
    );
  }
}

```

### `FadeTransition`

```dart
class FadeRoute extends PageRouteBuilder {
  final Widget page;

  FadeRoute(this.page)
      : super(
          pageBuilder: (
            context,
            animation,
            secondaryAnimation,
          ) {
            return page;
          },
          transitionsBuilder: (
            context,
            animation,
            secondaryAnimation,
            child,
          ) {
            return FadeTransition(
              opacity: animation,
              child: child,
            );
          },
        );
}
```

<div>
  <video src="videos/fade_transition.mov" controls width="320" autoplay muted loop />
</div>

### `ScaleTransition`

```dart
class ScaleRoute extends PageRouteBuilder {
  final Widget page;

  ScaleRoute(this.page)
      : super(
          pageBuilder: (
            context,
            animation,
            secondaryAnimation,
          ) {
            return page;
          },
          transitionsBuilder: (
            context,
            animation,
            secondaryAnimation,
            child,
          ) {
            return ScaleTransition(
              alignment: Alignment.bottomLeft,
              scale: Tween(
                begin: 0.0,
                end: 1.0,
              ).animate(
                CurvedAnimation(
                  parent: animation,
                  curve: Curves.easeInOut,
                ),
              ),
              child: child,
            );
          },
          transitionDuration: Duration(seconds: 1),
        );
}

Navigator.of(context).push(ScaleRoute(SecondPage()));
```

<div>
  <video src="videos/scale_transition.mov" controls width="320" autoplay muted loop />
</div>

### `RotationTransition`

```dart
class RotationRoute extends PageRouteBuilder {
  final Widget page;

  RotationRoute(this.page)
      : super(
          pageBuilder: (
            context,
            animation,
            secondaryAnimation,
          ) {
            return page;
          },
          transitionsBuilder: (
            context,
            animation,
            secondaryAnimation,
            child,
          ) {
            Animation myAnimation = CurvedAnimation(
              parent: animation,
              curve: Curves.easeInBack,
            );

            return RotationTransition(
              turns: myAnimation,
              child: child,
            );
          },
          transitionDuration: Duration(seconds: 1),
        );
}

Navigator.of(context).push(RotationRoute(SecondPage()));
```

<div>
  <video src="videos/rotation_transition.mov" controls width="320" autoplay muted loop />
</div>

### `ScaleRotationRoute`

结合两个过渡动画

```dart
class ScaleRotationRoute extends PageRouteBuilder {
  final Widget page;

  ScaleRotationRoute(this.page)
      : super(
          pageBuilder: (
            context,
            animation,
            secondaryAnimation,
          ) {
            return page;
          },
          transitionsBuilder: (
            context,
            animation,
            secondaryAnimation,
            child,
          ) {
            return ScaleTransition(
              scale: animation,
              child: RotationTransition(
                turns: Tween(
                  begin: 0.0,
                  end: 1.0,
                ).animate(
                  CurvedAnimation(parent: animation, curve: Curves.linear),
                ),
                child: child,
              ),
            );
          },
          transitionDuration: Duration(milliseconds: 800),
        );
}

Navigator.of(context).push(ScaleRotationRoute(SecondPage()));
```

<div>
  <video src="videos/scale_rotation_transition.mov" controls width="320" autoplay muted loop />
</div>

### `TransformRoute`

使用 `Transform` 部件创造 `3D` 效果

```dart
import 'dart:math' show pi;

class TransformRoute extends PageRouteBuilder {
  final Widget page;

  TransformRoute(this.page)
      : super(
          pageBuilder: (
            context,
            animation,
            secondaryAnimation,
          ) {
            return page;
          },
          transitionsBuilder: (
            context,
            animation,
            secondaryAnimation,
            child,
          ) {
            return Transform(
              transform: Matrix4.identity()
                // 类似于 CSS 里面 `perspective` 属性，确定 z=0 平面与用户之间的距离
                ..setEntry(3, 2, 0.0001)
                ..rotateX(animation.value * pi * 2)
                ..rotateY(animation.value * pi * 2),
              alignment: FractionalOffset.center,
              child: child,
            );
          },
          transitionDuration: Duration(seconds: 2),
        );
}

Navigator.of(context).push(TransformRoute(SecondPage()));
```

<div>
  <video src="videos/transform_transition.mov" controls width="320" autoplay muted loop />
</div>

### `EnterExitRoute`

同时为进入页面和退出页面添加动画

```dart
class EnterExitRoute extends PageRouteBuilder {
  final Widget enterPage;
  final Widget exitPage;

  EnterExitRoute(this.enterPage, this.exitPage)
      : super(
          pageBuilder: (
            context,
            animation,
            secondaryAnimation,
          ) {
            return exitPage;
          },
          transitionsBuilder: (
            context,
            animation,
            secondaryAnimation,
            child,
          ) =>
              Stack(
            children: [
              SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(0.0, 0.0),
                  end: Offset(-1.0, 0.0),
                ).animate(
                  CurvedAnimation(parent: animation, curve: Curves.easeIn),
                ),
                child: enterPage,
              ),
              SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(1.0, 0.0),
                  end: Offset.zero,
                ).animate(
                  CurvedAnimation(parent: animation, curve: Curves.easeInOut),
                ),
                child: exitPage,
              )
            ],
          ),
        );
}

Navigator.of(context).push(
  EnterExitRoute(FirstPage(), SecondPage()),
);
```

<div>
  <video src="videos/enter_exist_transition.mov" controls width="320" autoplay muted loop />
</div>

## 使用 `Navigator.pushNamed` 方法跳转

在 `onGenerateRoute` 对跳转路由的 `name` 进行判断，对特定的路由添加过渡动画。

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: FirstPage(),
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/second':
            return ScaleRoute(SecondPage());
            break;
          default:
            return null;
        }
      },
    );
  }
}

Navigator.pushNamed(context, '/second', arguments: {});
```

## 设置全局的路由过渡动画

`Flutter` 的默认路由过渡动画是由 `buildTransitions` 方法创建的，它使用的是 `Theme.of(context).pageTransitionsTheme`方法，因此可以定义全局的路由跳转过渡动画。

```dart
@override
Widget buildTransitions(context, animation, secondaryAnimation, child) {
    final PageTransitionsTheme theme = Theme.of(context).pageTransitionsTheme;
    return theme.buildTransitions<T>(this, context, animation, secondaryAnimation, child);
}
```

首先自定义一个 `TransitionBuilder`， `buildTransitions` 方法返回跳转页面。然后配置 `theme` 的 `pageTransitionsTheme`，设置对应的平台，最后在使用 `MaterialPageRoute` 或者 `CupertinoPageRoute` 进行页面跳转时就会有自定义的过渡动画了。

```dart
class ScaleTransitionBuilder extends PageTransitionsBuilder {
  @override
  Widget buildTransitions<T>(
    route,
    context,
    animation,
    secondaryAnimation,
    child,
  ) {
    return ScaleTransition(
      scale: CurvedAnimation(parent: animation, curve: Curves.easeIn),
      child: child,
    );
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: FirstPage(),
      theme: ThemeData(
        pageTransitionsTheme: PageTransitionsTheme(
          builders: {
            TargetPlatform.android: ScaleTransitionBuilder(),
            TargetPlatform.iOS: ScaleTransitionBuilder(),
          },
        ),
      ),
    );
  }
}

Navigator.push(context, MaterialPageRoute(builder: (ctx) => SecondPage()));
```

## 将动画封装成一个库

将自定义的路由过渡动画封装起来方便使用。

```dart
enum TransitionType {
  fade,
  scale,
  rotate,
  transform,
}

class PageTransition extends PageRouteBuilder {
  PageTransition(TransitionType type, Widget page, Duration time)
      : super(
          pageBuilder: (
            context,
            animation,
            secondaryAnimation,
          ) {
            return page;
          },
          transitionsBuilder: (
            context,
            animation,
            secondaryAnimation,
            child,
          ) {
            switch (type) {
              case TransitionType.fade:
                return FadeTransition(opacity: animation, child: child);
                break;
              case TransitionType.scale:
                return ScaleTransition(
                  scale: Tween(begin: 0.0, end: 1.0).animate(
                    CurvedAnimation(parent: animation, curve: Curves.easeInOut),
                  ),
                  child: child,
                );
                break;
              case TransitionType.rotate:
                return RotationTransition(
                  turns: CurvedAnimation(
                    parent: animation,
                    curve: Curves.easeInBack,
                  ),
                  child: child,
                );
                break;
              case TransitionType.transform:
                return Transform(
                  transform: Matrix4.identity()
                    ..setEntry(3, 2, 0.0001)
                    ..rotateX(animation.value * pi * 2)
                    ..rotateY(animation.value * pi * 2),
                  alignment: FractionalOffset.center,
                  child: child,
                );
                break;
              default:
                return child;
            };
          },
          transitionDuration: time,
        );
}

// 使用
Navigator.push(
  context,
  PageTransition(
    TransitionType.rotate,
    SecondPage(),
    Duration(milliseconds: 800),
  ),
}
```

## 参考文章

[为页面切换加入动画效果](https://flutter.cn/docs/cookbook/animation/page-route-animation)

[Everything you need to know about Flutter page route transition](https://medium.com/flutter-community/everything-you-need-to-know-about-flutter-page-route-transition-9ef5c1b32823)

[Perspective on Flutter](https://medium.com/flutter/perspective-on-flutter-6f832f4d912e)
