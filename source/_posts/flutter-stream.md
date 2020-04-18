---
title: 在 Flutter 里使用 Stream
categories:
  - 技术
tags:
  - Flutter
date: 2020-04-13 12:07:56
---

![stream](./images/flutter-stream/stream.png)

<!--more-->

## 前言

在 Flutter 中有两种处理异步操作的方式 `Future` 和 `Stream`，`Future` 用于处理单个异步操作，`Stream` 用来处理连续的异步操作。比如往水杯倒水，将一个水杯倒满水为一个 `Future`，连续的将多个水杯倒满水就是 `Stream`。

![water-fill](./images/flutter-stream/water-fill.png)


## Stream 详解

`Stream` 是一个抽象类，用于表示一序列异步数据的源。它是一种产生连续事件的方式，可以生成数据事件或者错误事件，以及流结束时的完成事件。

```dart
abstract class Stream<T> {
  Stream();
}
```

`Stream` 分单订阅流和广播流。

单订阅流在发送完成事件之前只允许设置一个监听器，并且只有在流上设置监听器后才开始产生事件，取消监听器后将停止发送事件。即使取消了第一个监听器，也不允许在单订阅流上设置其他的监听器。广播流则允许设置多个监听器，也可以在取消上一个监听器后再次添加新的监听器。

`Stream` 有同步流和异步流之分。

它们的区别在于同步流会在执行 `add`，`addError` 或 `close` 方法时立即向流的监听器 `StreamSubscription` 发送事件，而异步流总是在事件队列中的代码执行完成后在发送事件。

## `Stream` 家族

`StreamController`

带有控制流方法的流。 可以向它的流发送数据，错误和完成事件，也可以检查数据流是否已暂停，是否有监听器。`sync` 参数决定这个流是同步流还是异步流。

```dart
abstract class StreamController<T> implements StreamSink<T> {
  Stream<T> get stream;
  /// ...
}

StreamController _streamController = StreamController(
  onCancel: () {},
  onListen: () {},
  onPause: () {},
  onResume: () {},
  sync: false,
);
```

`StreamSink`

流事件的入口。提供 `add`，`addError`，`addStream` 方法向流发送事件。

```dart
abstract class StreamSink<S> implements EventSink<S>, StreamConsumer<S> {
  Future close();
  /// ...
  Future get done;
}
```

`StreamSubscription`

流的监听器。提供 `cacenl`、`pause`, `resume` 等方法管理。

```dart
abstract class StreamSubscription<T> {
  /// ...
}

StreamSubscription subscription = StreamController().stream.listen(print);
subscription.onDone(() => print('done'));
```

`StreamBuilder`

使用流数据渲染 UI 界面的部件。

```dart
StreamBuilder(
  // 数据流
  stream: stream,
  // 初始数据
  initialData: 'loading...',
  builder: (context, AsyncSnapshot snapshot) {
    // AsyncSnapshot 对象为数据快照，缓存了当前数据和状态
    // snapshot.connectionState
    // snapshot.data
    if (snapshot.hasData) {
      Map data = snapshot.data;
      return Text(data),
    }
    return CircularProgressIndicator();
  },
)
```

## 创建 Stream

在 Dart 有几种方式创建 `Stream`

1. 从现有的生成一个新的流 `Stream`，使用 `map`，`where`，`takeWhile` 等方法。

```dart
// 整数流
Stream<int> intStream = StreamController<int>().stream;
// 偶数流
Stream<int> evenStream = intStream.where((int n) => n.isEven);
// 两倍流
Stream<int> doubleStream = intStream.map((int n) => n * 2);
// 数字大于 10 的流
Stream<int> biggerStream = intStream.takeWhile((int n) => n > 10);
```

2. 使用 `async*` 函数。

```dart
Stream<int> countStream(int to) async* {
  for (int i = 1; i <= to; i++) {
    yield i;
  }
}

Stream stream = countStream(10);
stream.listen(print);
```

3. 使用 `StreamController`。

```dart
StreamController<Map> _streamController = StreamController(
  onCancel: () {},
  onListen: () {},
  onPause: () {},
  onResume: () {},
  sync: false,
);

Stream _stream = _streamController.stream;
```

4. 使用 `Future` 对象生成

```dart
Future<int> _delay(int seconds) async {
  await Future.delayed(Duration(seconds: seconds));
  return seconds;
}

List<Future> futures = [];
for (int i = 0; i < 10; i++) {
  futures.add(_delay(3));
}

Stream _futuresStream = Stream.fromFutures(futures);
```


## 应用 Stream

*Stream Counter*

把 Flutter 的默认项目改用 `Stream` 实现

<img src="./images/flutter-stream/stream-counter.gif" width="320" style="width: 320px;">

```dart
import 'dart:async';
import 'package:flutter/material.dart';

class StreamCounter extends StatefulWidget {
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
        title: Text('Stream Counter'),
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
                    style: Theme.of(context).textTheme.bodyText2,
                  );
                }

                int number = snapshot.data;
                return Text(
                  '$number',
                  style: Theme.of(context).textTheme.bodyText2,
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


*NetWork Status*

监听手机的网络链接状态，首先添加 `connectivity` 插件

```yml
dependencies:
  connectivity: ^0.4.8+2
```

<img src="./images/flutter-stream/network-status.gif" width="320" style="width: 320px;">

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

`Random Article`

请求网络数据创建流

```yml
dependencies:
  dio: ^3.0.9
  flutter_html: ^0.11.1
```

<img src="./images/flutter-stream/random-article.gif" width="320" style="width: 320px;">

```dart
import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';

class RandomArticle extends StatefulWidget {
  @override
  _RandomArticleState createState() => _RandomArticleState();
}

class _RandomArticleState extends State<RandomArticle> {
  static Dio _dio = Dio(
    BaseOptions(baseUrl: 'https://interface.meiriyiwen.com'),
  );

  static Future<Map> _getArticle() async {
    Response response = await _dio.get(
      '/article/random',
      queryParameters: {"dev": 1},
    );

    final data = response.data['data'];
    return data;
  }

  Stream<Map> _futuresStream;

  @override
  void initState() {
    List<Future<Map>> futures = [];
    for (int i = 0; i < 10; i++) {
      // 添加 Future
      futures.add(_getArticle());
    }

    // 创建 Stream
    _futuresStream = Stream<Map>.fromFutures(futures);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Random Article')),
      body: SingleChildScrollView(
        child: Center(
          child: StreamBuilder<Map>(
            stream: _futuresStream,
            builder: (context, AsyncSnapshot snapshot) {
              if (snapshot.hasData) {
                Map article = snapshot.data;

                return Container(
                  child: Column(
                    children: <Widget>[
                      SizedBox(height: 24.0),
                      Text(
                        article['title'],
                        style: TextStyle(fontSize: 24.0),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(
                          top: 12.0,
                          left: 12.0,
                          right: 12.0,
                          bottom: 60.0,
                        ),
                        child: Html(
                          data: article['content'],
                        ),
                      ),
                    ],
                  ),
                );
              }
              return CircularProgressIndicator();
            },
          ),
        ),
      ),
    );
  }
}

```

`Broadcast Stream`

使用广播流

<img src="./images/flutter-stream/broadcast-stream.gif" width="320" style="width: 320px;">

```dart
import 'dart:async';

import 'package:flutter/material.dart';

class BroadcastStream extends StatefulWidget {
  @override
  _BroadcastStreamState createState() => _BroadcastStreamState();
}

class _BroadcastStreamState extends State<BroadcastStream> {
  StreamController<int> _streamController = StreamController<int>.broadcast();
  StreamSubscription _subscription1;
  StreamSubscription _subscription2;
  StreamSubscription _subscription3;

  int _count = 0;
  int _s1 = 0;
  int _s2 = 0;
  int _s3 = 0;

  @override
  void initState() {
    _subscription1 = _streamController.stream.listen((n) {
      setState(() {
        _s1 += 1;
      });
    });

    _subscription2 = _streamController.stream.listen((n) {
      setState(() {
        _s2 += 2;
      });
    });

    _subscription3 = _streamController.stream.listen((n) {
      setState(() {
        _s3 -= 1;
      });
    });

    super.initState();
  }

  void _add() {
    if (_count > 10) {
      // 大于 10 时停止第一个订阅
      _subscription1.cancel();
    }
    _count++;
    _streamController.add(_count);
  }

  @override
  void dispose() {
    super.dispose();
    _streamController.close();
    _subscription1.cancel();
    _subscription2.cancel();
    _subscription3.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Broadcast Stream'),
      ),
      body: Container(
        width: double.infinity,
        height: MediaQuery.of(context).size.height,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text('Count: $_count'),
            SizedBox(height: 12.0),
            Text('S1: $_s1'),
            SizedBox(height: 12.0),
            Text('S2: $_s2'),
            SizedBox(height: 12.0),
            Text('S3: $_s3'),
            SizedBox(height: 12.0),
            FloatingActionButton(
              onPressed: _add,
              child: Icon(Icons.plus_one),
            ),
          ],
        ),
      ),
    );
  }
}

```

## 总结

`Stream` 是处理异步编程的方式之一，它提供一个了异步的事件序列，并在你准备好接受时发送。在 Dart 中流分为同步流和异步流，以及单订阅流和广播流，有多种方式创建 `Stream`。

## 参考

[异步编程：使用 stream](https://dart.cn/tutorials/language/streams)

[在 Dart 里使用 Stream](https://dart.cn/articles/libraries/creating-streams)

[全面深入理解Stream](https://guoshuyu.cn/home/wx/Flutter-11.html)

[Building a Widget with StreamBuilder](https://codingwithjoe.com/flutter-building-a-widget-with-streambuilder/)

[StreamBuilder (Flutter 本周小部件)](https://youtu.be/MkKEWHfy99Y)

[Dart Streams - 聚焦 Flutter](https://youtu.be/nQBpOIHE4eE)
