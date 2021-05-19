---
title: 理解 Flutter 应用和部件的生命周期
date: 2019-07-28T21:21:03+08:00
tags:
  - Flutter
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/05/15/04/49/lake-6254899_960_720.jpg
---

在 Flutter 里面部件以及应用本身都有自己的生命周期，本文分别说明它们的生命周期

<!--more-->

## 前言

在 Flutter 里面部件以及应用本身都有自己的生命周期，本文分别说明它们的生命周期

## 部件

在 Flutter 里面有两种部件 StatefulWidget 和 StatelessWidget，它们的生命周期分别是

### StatelessWidget

无状态部件的生命周期很简单，首先执行构造函数然后就执行 build 方法了

```
Constructor Function

build()
```

### StatefulWidget

有状态部件的生命周期会复杂一些，因为是多了状态变化。首先是构造函数，然后会初始化 State 在执行 build 方法，如果执行了 setState 方法，就要检查部件是否更新，在执行 build，最后部件销毁的时候执行 dispose 方法

```
Constructor Function

initState()

build()

setState()

didUpdateWidget()

build()

dispose()
```

## 应用

Flutter 应用本身也有自己的生命周期，要观察到这些状态的变化需要让一个有状态部件混入 `WidgetsBindingObserver`，然后在 `initState` 方法中创建一个观察者，当然部件销毁的时候需要把创建的观察者实现清除

- inactive 应用处于非活动状态，并且未接收用户输入

- paused 应用当前对用户不可见，不响应用户输入，并在后台运行

- resumed 应用可见并响应用户输入

- suspending 应用退出了

代码

```
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Lifecycle',
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with WidgetsBindingObserver {
  @override
  void initState() {
    WidgetsBinding.instance.addObserver(this);
    super.initState();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
	print(state);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold();
  }
}
```

可以看到在 Flutter 应用里面这些生命周期还是挺简单易懂的
