---
title: 在 Flutter 里使用 Stream
categories:
  - 技术
tags:
  - Flutter
date: 2020-04-13 12:07:56
---

![cover](./images/flutter-stream/stream-cover.jpg)

<!--more-->

## 前言

在 Dart 中有两种表示异步操作的概念，`Future` 和 `Stream`，`Future` 用于表示单个异步运算的结果，而 `Stream` 则表示多个异步操作结果的序列。
举个例子说明，往水杯里面倒水，将一个水杯倒满水为一个为一个 `Future`，连续的将多个水杯倒满水就是 `Stream` 了。

## [Stream](https://api.flutter-io.cn/flutter/dart-async/Stream-class.html) 详解

`Stream` 是一个抽象类，用于表示一系列异步数据事件的源。它是一种接受连续事件的方式，数据事件或者错误事件，当 `Stream` 中的事件全部接受完成那么它会发送一个完成事件。

```dart
abstract class Stream<T> {
  Stream();
}
```

`Stream` 分单订阅流和广播流。

单订阅流在完成事件之前只允许一个监听器，只有在流上设置监听器后才开始产生事件，并且取消订阅后将停止发送事件，即使取消了第一个订阅，也不允许在单订阅流上收听两次。

广播流允许多个监听器，不论是否设置了监听器，广播流都将开始产生事件，同时也可以在取消上一个订阅后再次添加监听器。

`Stream` 也有同步流和异步流之分

默认创建的 `Stream` 是异步流，它们之间的区别在与


## 创建 Stream

在 Dart 中有中创建 `Stream` 的方式，简单的

```dart
abstract class Stream<T> {
  ///..
}
```

## `Stream` 家族

`StreamController`

创建一个 `Stream` 的简单方式，可以理解为带有控制方法的流。`StreamController` 可以在它的流上发送数据，错误和完成事件，也可以检查数据流是否已暂停，是否有监听器。

`sync` 参数表示这个流是同步流还是异步流

```dart
StreamController<Map> _streamController = StreamController(
    onCancel: () {},
    onListen: () {},
    onPause: () {},
    onResume: () {},
  );
```

/**
 *带有其控制的流的控制器。
 *
 *此控制器允许在以下位置发送数据，错误和已完成事件
 *其[流]。
 *此类可用于创建其他人可以访问的简单流
 *可以监听，并将事件推送到该流。
 *
 *可以检查流是否已暂停以及是否已暂停
 *它是否具有订阅者，以及在有
 *这些变化。

 StreamSink

/**
 *一个对象，它可以同步和异步地接受流事件。
 *
 *[StreamSink]结合了[StreamConsumer]和[EventSink]中的方法。
 *
 *调用[addStream]时不能使用[EventSink]方法。
 *[addStream]的[Future]一旦完成一个值，
 *[EventSink]方法可以再次使用。
 *
 *如果在任何[EventSink]方法之后调用[addStream]，它将
 *延迟到基础系统消耗完由
 *[EventSink]方法。
 *
 *当使用[EventSink]方法时，[完成] [未来]可用于
 *捕获任何错误。
 *
 *当调用[关闭]时，它将返回[完成] [未来]。


StreamSubscription

## 应用 Stream

*Stream Counter*

把 Flutter 的默认项目改用 `Stream` 实现

```dart
import 'dart:async';

import 'package:flutter/material.dart';

class StreamCounter extends StatefulWidget {
  final String title;
  StreamCounter({this.title});

  @override
  _StreamCounterState createState() => _StreamCounterState();
}

class _StreamCounterState extends State<StreamCounter> {
  // 创建一个 StreamController
  StreamController<int> _counterStreamController = StreamController<int>(
    onCancel: () {
      print('cancel');
    },
    onListen: () {
      print('listen');
    },
  );

  int _counter = 0;
  Stream _counterStream;
  StreamSink _counterSink;

  // 使用 StreamSink 向 Stream 发送事件，当 _counter 大于 9 时触发 close 事件，关闭流。
  void _incrementCounter() {
    if (_counter > 9) {
      _counterSink.close();
      return;
    }
    _counter++;
    _counterSink.add(_counter);
  }

  // 主动关闭流
  void _closeStream() {
    _counterStreamController.close();
  }

  @override
  void initState() {
    super.initState();
    _counterSink = _counterStreamController.sink;
    _counterStream = _counterStreamController.stream;
  }

  @override
  void dispose() {
    super.dispose();
    _counterSink.close();
    _counterStreamController.close();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text('You have pushed the button this many times:'),
            // 使用 StreamBuilder 显示和更新 UI
            StreamBuilder<int>(
              stream: _counterStream,
              initialData: _counter,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.done) {
                  return Text(
                    'Done',
                    style: Theme.of(context).textTheme.display1,
                  );
                }

                int number = snapshot.data;
                return Text(
                  '$number',
                  style: Theme.of(context).textTheme.display1,
                );
              },
            ),
          ],
        ),
      ),
      floatingActionButton: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          FloatingActionButton(
            onPressed: _incrementCounter,
            tooltip: 'Increment',
            child: Icon(Icons.add),
          ),
          SizedBox(width: 24.0),
          FloatingActionButton(
            onPressed: _closeStream,
            tooltip: 'Close',
            child: Icon(Icons.close),
          ),
        ],
      ),
    );
  }
}

```

效果如下

![stream-counter](./images/flutter-stream/stream-counter.gif)

*NetWork Status*

监听手机的网络链接状态，首先添加 `connectivity` 插件

```yml
dependencies:
  connectivity: ^0.4.8+2
```

```dart
import 'dart:async';

import 'package:connectivity/connectivity.dart';
import 'package:flutter/material.dart';

class NetWorkStatus extends StatefulWidget {
  @override
  _NetWorkStatusState createState() => _NetWorkStatusState();
}

class _NetWorkStatusState extends State<NetWorkStatus> {
  StreamController<ConnectivityResult> _streamController = StreamController();
  StreamSink _streamSink;
  Stream _stream;
  String _result;

  void _checkStatus() async {
    final ConnectivityResult result = await Connectivity().checkConnectivity();

    if (result == ConnectivityResult.mobile) {
      _result = 'mobile';
    } else if (result == ConnectivityResult.wifi) {
      _result = 'wifi';
    } else if (result == ConnectivityResult.none) {
      _result = 'none';
    }

    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    _stream = _streamController.stream;
    _streamSink = _streamController.sink;
    _checkStatus();
    Connectivity().onConnectivityChanged.listen(
      (ConnectivityResult result) {
        _streamSink.add(result);
      },
    );
  }

  @override
  dispose() {
    super.dispose();
    _streamSink.close();
    _streamController.close();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Network Status'),
      ),
      body: Center(
        child: StreamBuilder<ConnectivityResult>(
          stream: _stream,
          builder: (context, AsyncSnapshot snapshot) {
            if (snapshot.hasData) {
              if (snapshot.data == ConnectivityResult.mobile) {
                _result = 'mobile';
              } else if (snapshot.data == ConnectivityResult.wifi) {
                _result = 'wifi';
              } else if (snapshot.data == ConnectivityResult.none) {
                return Text('还没有链接网络');
              }
            }

            if (_result == null) {
              return CircularProgressIndicator();
            }

            return ResultText(_result);
          },
        ),
      ),
    );
  }
}

class ResultText extends StatelessWidget {
  final String result;

  const ResultText(this.result);

  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        style: TextStyle(color: Colors.black),
        text: '正在使用',
        children: [
          TextSpan(
            text: ' $result ',
            style: TextStyle(
              color: Colors.red,
              fontSize: 20.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          TextSpan(text: '链接网络'),
        ],
      ),
    );
  }
}

```

效果如下





## 结语

## 参考

[异步编程：使用 stream](https://dart.cn/tutorials/language/streams)

[在 Dart 里使用 Stream](https://dart.cn/articles/libraries/creating-streams)

[全面深入理解Stream](https://guoshuyu.cn/home/wx/Flutter-11.html)

[Building a Widget with StreamBuilder](https://codingwithjoe.com/flutter-building-a-widget-with-streambuilder/)

[StreamBuilder (Flutter 本周小部件)](https://youtu.be/MkKEWHfy99Y)

[Dart Streams - 聚焦 Flutter](https://youtu.be/nQBpOIHE4eE)
