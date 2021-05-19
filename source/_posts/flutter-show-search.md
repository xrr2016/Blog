---
title: 为 Flutter 应用添加搜索功能
categories:
  - 技术
tags:
  - Flutter
date: 2020-01-26 17:34:54
cover: https://cdn.pixabay.com/photo/2021/01/21/15/54/books-5937716_960_720.jpg
---

使用 `SearchDelegate` 给 Flutter 应用添加搜索功能

<!--more-->

## 前言

`SearchDelegate` 是 Flutter 框架提供的一个实现搜索功能的类，使用它可以快速实现搜索功能，本文说明如何使用它来实现搜索功能。

最终效果如下

<div>
  <video src="videos/show_search.mov" controls width="240" autoplay muted loop />
</div>

创建新项目，初始化代码如下

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Search App',
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Search App'),
      ),
    );
  }
}

```

## 显示搜索页面

`showSearch` 方法是 Flutter 里用来显示一个搜索页面的方法，这个页面由一个带有搜索框的 `AppBar` 和显示搜索建议或搜索结果的 `body` 组成。它有两个必要参数 `context` 和 `delegate`，`context` 即为当前的应用上下文，`delegate` 是一个实现了 `SearchDelegate` 抽象类自定义的部件，这个自定义部件定义了如何显示搜索页面，关闭搜索页面时返回用户选择的搜索结果。

在 `AppBar` 的 `actions` 数组里面添加一个 `IconButton`，按下时调用 `showSearch` 方法，进入搜索页面。

```dart
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Search App'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              showSearch(context: context, delegate: CustomSearchDelegate());
            },
          )
        ],
      ),
    );
  }
}
```

初始化一个继承了 `SearchDelegate` 的 `CustomSearchDelegate`，类的名字是自定义的。

```dart
class CustomSearchDelegate extends SearchDelegate {
  @override
  List<Widget> buildActions(BuildContext context) {
    // TODO: implement buildActions
    throw UnimplementedError();
  }

  @override
  Widget buildLeading(BuildContext context) {
    // TODO: implement buildLeading
    throw UnimplementedError();
  }

  @override
  Widget buildResults(BuildContext context) {
    // TODO: implement buildResults
    throw UnimplementedError();
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    // TODO: implement buildSuggestions
    throw UnimplementedError();
  }
}

```

## 实现 `CustomSearchDelegate`

自定义的 `CustomSearchDelegate` 需要实现四个方法

- `buildLeading`     显示在输入框之前的部件，一般显示返回前一个页面箭头按钮
- `buildActions`     显示在输入框之后的部件
- `buildResults`     显示搜索结果
- `buildSuggestions` 显示搜索建议

先实现 `buildActions` 和 `buildLeading`，`buildActions` 显示一个清除按钮，可以把当前的 `query` 查询参数清空，并显示搜索建议。`buildLeading` 显示一个箭头的按钮，使用 `close` 方法关闭搜索页面，`close` 方法第二个参数是选定的搜索结果，如果使用系统后退按钮关闭搜索页面，则返回 `null` 值。

```dart
List<Widget> buildActions(BuildContext context) {
  return [
    IconButton(
      tooltip: 'Clear',
      icon: const Icon(Icons.clear),
      onPressed: () {
        query = '';
        showSuggestions(context);
      },
    )
  ];
}

@override
Widget buildLeading(BuildContext context) {
  return IconButton(
    tooltip: 'Back',
    icon: AnimatedIcon(
      icon: AnimatedIcons.menu_arrow,
      progress: transitionAnimation,
    ),
    onPressed: () {
      close(context, null);
    },
  );
}

@override
Widget buildResults(BuildContext context) {
  return ListView();
}

@override
Widget buildSuggestions(BuildContext context) {
  return ListView();
}
```

<img src="images/search_01.png" width="240" style="width: 240px;">

然后实现 `buildResults` 和 `buildSuggestions`，这两个方法用来展示搜索页面内容，可以使用不同的部显示，这里使用 `ListView` 部件。

```dart
@override
Widget buildResults(BuildContext context) {
  return ListView.builder(
    itemCount: Random().nextInt(10),
    itemBuilder: (context, index) {
      return ListTile(
        title: Text('result $index'),
      );
    },
  );
}

@override
Widget buildSuggestions(BuildContext context) {
  return ListView(
    children: <Widget>[
      ListTile(title: Text('Suggest 01')),
      ListTile(title: Text('Suggest 02')),
      ListTile(title: Text('Suggest 03')),
      ListTile(title: Text('Suggest 04')),
      ListTile(title: Text('Suggest 05')),
    ],
  );
}

```

搜索结果

<img src="images/search_result.png" width="240" style="width: 240px;">

搜索建议

<img src="images/search_suggestion.png" width="240" style="width: 240px;">


## 获取远程数据

搜索功能一般需要请求后端的搜索接口来获取数据，此时可以使用 `FutureBuilder` 部件来请求数据然后渲染结果。首先需要定义一个请求接口的方法，返回一个 `Future`，然后在 `buildResults` 方法中使用 `FutureBuilder` 来展示结果。

先添加 `http` 包，用来发送 http 请求，然后引入需要的依赖包

```yml
dependencies:
  http: <latest_version>
```

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
```

将键盘输入类型设置为数字，定义一个 `_fetchPosts` 方法用来获取远端数据，在 `buildResults` 方法里使用 `FutureBuilder` 渲染搜索结果。

```dart
@override
TextInputType get keyboardType => TextInputType.number;

Future _fetchPosts() async {
  http.Response response =
      await http.get('https://jsonplaceholder.typicode.com/posts/$query');
  final data = await json.decode(response.body);
  return data;
}

@override
Widget buildResults(BuildContext context) {
  if (int.tryParse(query) >= 100) {
    return Center(child: Text('请输入小于 100 的数字'));
  }

  return FutureBuilder(
    future: _fetchPosts(),
    builder: (context, AsyncSnapshot snapshot) {
      if (snapshot.hasData) {
        final post = snapshot.data;

        return ListTile(
          title: Text(post['title'], maxLines: 1),
          subtitle: Text(post['body'], maxLines: 3),
        );
      }
      return Center(child: CircularProgressIndicator());
    },
  );
}
```

<img src="images/search_server.png" width="240" style="width: 240px;">

使用 `FutureBuilder` 部件获取了远程的数据，但是遇到一个问题，搜索结果可能是分页显示的，一开始只获取了第一页的数据，想追加下一页数据时需要像 `stateFullWidget` 那样使用 `setState` 方法更新页面，但是在 `SearchDelegate` 里无法使用...暂时没想到解决方法。

## 完整代码

```dart
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Search App',
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Search App'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              showSearch(context: context, delegate: CustomSearchDelegate());
            },
          )
        ],
      ),
    );
  }
}

class CustomSearchDelegate extends SearchDelegate {
  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        tooltip: 'Clear',
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = '';
          showSuggestions(context);
        },
      )
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      tooltip: 'Back',
      icon: AnimatedIcon(
        icon: AnimatedIcons.menu_arrow,
        progress: transitionAnimation,
      ),
      onPressed: () {
        this.close(context, null);
      },
    );
  }

  @override
  TextInputType get keyboardType => TextInputType.number;

  Future _fetchPosts() async {
    http.Response response =
        await http.get('https://jsonplaceholder.typicode.com/posts/$query');
    final data = await json.decode(response.body);

    return data;
  }

  @override
  Widget buildResults(BuildContext context) {
    if (int.parse(query) >= 100) {
      return Center(child: Text('请输入小于 100 的数字'));
    }

    return FutureBuilder(
      future: _fetchPosts(),
      builder: (context, AsyncSnapshot snapshot) {
        if (snapshot.hasData) {
          final post = snapshot.data;

          return ListTile(
            title: Text(post['title'], maxLines: 1),
            subtitle: Text(post['body'], maxLines: 3),
          );
        }

        return Center(child: CircularProgressIndicator());
      },
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return ListView(
      children: <Widget>[
        ListTile(title: Text('Suggest 01')),
        ListTile(title: Text('Suggest 02')),
        ListTile(title: Text('Suggest 03')),
        ListTile(title: Text('Suggest 04')),
        ListTile(title: Text('Suggest 05')),
      ],
    );
  }
}

```
