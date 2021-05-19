---
title: 使用 Provider 管理 Flutter 应用状态 (下)
date: 2019-09-23 16:17:17
tags:
  - Flutter
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/05/15/19/25/greylag-geese-6256503_960_720.jpg
---

为了存储数据可以将数据存到手机的存储里面或者存到远程服务器上，本文就实现如何使用 dio 将数据存到服务器

<!--more-->

## 前言

紧接上篇，对于一个代办事项的新增，修改，删除功能都已经完成了，但是数据都是保存在内存中的，重新启动应用数据就重置了，为了存储数据可以将数据存到手机的存储里面或者存到远程服务器上，本文就实现如何使用 [dio](https://github.com/flutterchina/dio) 将数据存到服务器

[源码地址](https://github.com/xrr2016/flutter_provider_todos/tree/http)

## 开发准备

在 `pubspec.yaml` 添加 dio 依赖；一个存储数据的服务，我用的是 [jsonbox](https://jsonbox.io/)

```yml
dependencies:
  dio: ^3.0.1
```

## 配置 dio

由于这个应用只有一个服务地址，所以创建一个 dio 的单例来进行请求就很好了，新建一个 request.dart 文件配置 dio，使用一个函数返回创建的 dio 实例

- 设置基础的请求地址
- 设置请求超时时间
- 设置在调试控制台输出请求响应体方便查看请求

基本设置下就可以用了，其它设置可以查看 dio 的[文档](https://pub.flutter-io.cn/packages/dio)

```dart
import 'package:dio/dio.dart';

const DB_URL = 'https://jsonbox.io/box_7ea9df49e805cf99509b';

Dio craeteDio() {
  BaseOptions options = BaseOptions(
    baseUrl: DB_URL,
    connectTimeout: 5000,
    receiveTimeout: 3000,
  );

  Dio dio = Dio(options);

  dio.interceptors.add(LogInterceptor(
    error: true,
    request: false,
    responseBody: true,
    responseHeader: false,
    requestHeader: false,
  ));

  return dio;
}
```

## 修改 Todo 模型

由于需要从服务器上获取 todo 数据，服务返回的数据是 json 格式，所以需要在拿到数据的时候将单个 todo 的 json 数据转成 Todo 实例，新建一个 model/todo.dart 文件，比之前多的是两个方法而已，`fromJson` 这个工厂函数作用是使用 json 数据实例化一个 Todo，`toJson` 方法用来将一个 Todo 转成一个 Map 结构的数据

如果一个模型的字段较少可以手写，但是当字段较多比较复杂的时候就需要使用工具来帮助生成代码了，我使用的是 [quicktype](https://app.quicktype.io/) 这个工具

```dart
class Todo {
  String id;
  bool finish;
  String thing;

  Todo({
    this.id,
    this.thing,
    this.finish,
  });

  factory Todo.fromJson(Map<String, dynamic> json) => Todo(
        id: json["_id"].toString(),
        thing: json["thing"],
        finish: json["finish"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "thing": thing,
        "finish": finish,
      };
}
```

## 发送请求

配置好 dio 就可以在 todos.dart 向服务器发送请求了，修改 store/todos.dart，给 Todos 类添加了一个 \_dio 属性用来发送请求，一个 getTodos 方法用来获取全部 todo 的列表数据，然后修改 addTodo，removeTodo，editTodo 方法使用 \_dio 向服务器发送 post，delete，put 请求。

需要注意的一点是将 json 转换成实例的问题，很容易就会出现类似

```dart
type 'List<dynamic>' is not a subtype of type 'List<Todo>'
```

这种错误，这种都是类型转换的问题，我看了一篇文章后才算弄懂了一点 [parsing-complex-json-in-flutter](https://medium.com/flutter-community/parsing-complex-json-in-flutter-747c46655f51)

```dart
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../request.dart';
import '../model/todo.dart';

class Todos extends ChangeNotifier {
  List<Todo> _items = [];

  Dio _dio = craeteDio();

  get items {
    return [..._items];
  }

  void refresh() {
    notifyListeners();
  }

  Future<List> getTodos() async {
    try {
      Response response = await _dio.get('/todos');

      final list = response.data as List;
      _items = List<Todo>.from(list.map((i) => Todo.fromJson(i)).toList());

      return items;
    } on DioError catch (err) {
      throw err;
    }
  }

  Future addTodo(String thing) async {
    try {
      Response response = await _dio.post('/todos', data: {
        "thing": thing,
        "finish": false,
      });

      Todo todo = Todo(
        thing: thing,
        id: response.data["_id"],
        finish: response.data["finish"],
      );

      _items.insert(0, todo);
      refresh();
    } on DioError catch (err) {
      throw err;
    }
  }

  Future removeTodo(int index) async {
    try {
      String todoId = _items[index].id;
      await _dio.delete("/todos/$todoId");
      _items.removeAt(index);
      refresh();
    } catch (err) {
      throw err;
    }
  }

  Future editTodo(int index, String thing, bool finish) async {
    String todoId = _items[index].id;

    try {
      await _dio.put("/todos/$todoId", data: {
        "thing": thing,
        "finish": finish,
      });

      Todo todo = _items[index];
      todo.thing = thing;
      todo.finish = finish;
      refresh();
    } catch (e) {
      throw e;
    }
  }

  void toggleFinish(int index) {
    final todo = _items[index];
    todo.finish = !todo.finish;

    refresh();
  }

  bool isTodoExist(String thing) {
    bool isExist = false;

    for (var i = 0; i < _items.length; i++) {
      final todo = _items[i];
      if (todo.thing == thing) {
        isExist = true;
      }
    }

    return isExist;
  }
}

```

## 使用数据

有了数据后就可以在列表页使用了，由于现在数据是从服务器返回的，会有请求耗时，所以需要使用 `FutureBuilder` 这个部件渲染列表，`FutureBuilder` 需要一个设置一个 future 来判断状态，这里自然是 Todos 类的 `getTodos` 方法返回的 Future 对象，然后 builder 就是一个函数，有两个参数，一个是 context 上下文对象，一个是 snapshot 对象，表示的是这个 future 的状态。

在 builder 方法里面用一个 switch 语句判断这个 future 的状态，根据状态返回需要渲染的部件，有以下几种状态 none（状态不存在），active（运行中），waiting（等待中），done（完成），如果都不匹配就，返回一个 null 值。

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'store/todos.dart';
import 'widget/add_todo_button.dart';
import 'widget/edit_todo_button.dart';
import 'widget/remove_todo_button.dart';

class TodosPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Flutter Provider Todos')),
      body: FutureBuilder(
        future: Provider.of<Todos>(context).getTodos(),
        builder: (context, snapshot) {
          switch (snapshot.connectionState) {
            case ConnectionState.none:
              return Text('Press button to start.');
            case ConnectionState.active:
            case ConnectionState.waiting:
              return Center(child: CircularProgressIndicator());
            case ConnectionState.done:
              if (snapshot.hasError) {
                print(snapshot.error);
                return Center(
                  child: Text(
                    '出错了，请重试',
                    style: TextStyle(fontSize: 18.0, color: Colors.red),
                  ),
                );
              }

              List items = snapshot.data;

              if (items == null) {
                return Center(
                  child: Text(
                    '还没有代办事项，快去添加吧',
                    style: TextStyle(fontSize: 18.0),
                  ),
                );
              }

              return ListView.builder(
                  itemCount: items.length,
                  itemBuilder: (_, index) {
                    return Column(
                      children: <Widget>[
                        ListTile(
                          title: Text(
                            items[index].thing,
                            style: TextStyle(
                              color: items[index].finish
                                  ? Colors.green
                                  : Colors.grey,
                            ),
                          ),
                          trailing: Container(
                            width: 150,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: <Widget>[
                                EditTodoButton(todoIndex: index),
                                RemoveTodoButton(todoIndex: index),
                              ],
                            ),
                          ),
                        ),
                        Divider(),
                      ],
                    );
                  });
          }
          return null;
        },
      ),
      floatingActionButton: Consumer<Todos>(
        builder: (_, todos, child) {
          return AddTodoButton();
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
```

## 修改按钮

接下来就是需要修改新增，编辑，删除代办的按钮了，同理由于现在需要跟服务端进行通信，所以需要根据请求状态来处理逻辑，主要的修改就是使用 `async/await` 语法等到一个请求完成后，根据返回值进行处理。

添加 Todo 按钮

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../store/todos.dart';

class AddTodoButton extends StatefulWidget {
  @override
  _AddTodoButtonState createState() => _AddTodoButtonState();
}

class _AddTodoButtonState extends State<AddTodoButton> {
  final _formKey = GlobalKey<FormState>();
  final _controller = TextEditingController();

  @override
  void dispose() {
    _formKey.currentState.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<Todos>(
      builder: (_, todos, child) {
        _addTodo() async {
          final isValid = _formKey.currentState.validate();

          if (!isValid) {
            return;
          }

          final thing = _controller.value.text;

          try {
            await todos.addTodo(thing);
            Navigator.pop(context);
            _controller.clear();
          } catch (e) {
            Scaffold.of(context).showSnackBar(
              SnackBar(content: Text('新增代办失败了，请重试。')),
            );
          }
        }

        return FloatingActionButton(
          child: Icon(Icons.add),
          onPressed: () {
            print('add todo');
            return showDialog(
              context: context,
              builder: (BuildContext _) {
                return SimpleDialog(
                  title: Text('添加 Todo'),
                  contentPadding: const EdgeInsets.all(24.0),
                  children: <Widget>[
                    Form(
                      key: _formKey,
                      child: Column(
                        children: <Widget>[
                          TextFormField(
                            autofocus: true,
                            autovalidate: false,
                            controller: _controller,
                            keyboardType: TextInputType.text,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              labelText: '输入你想做的事',
                            ),
                            validator: (val) {
                              if (val.isEmpty) {
                                return '想做的事不能为空';
                              }

                              bool isExist = todos.isTodoExist(val);

                              if (isExist) {
                                return '这件事情已经存在了';
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: <Widget>[
                              FlatButton(
                                child: Text('取消'),
                                onPressed: () {
                                  Navigator.pop(context);
                                },
                              ),
                              RaisedButton(
                                child: Text(
                                  '确定',
                                  style: TextStyle(color: Colors.white),
                                ),
                                color: Theme.of(context).primaryColor,
                                onPressed: _addTodo,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            );
          },
        );
      },
    );
  }
}

```

编辑 Todo 按钮

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/todo.dart';
import '../store/todos.dart';

class EditTodoButton extends StatefulWidget {
  final todoIndex;

  const EditTodoButton({Key key, this.todoIndex}) : super(key: key);

  @override
  _EditTodoButtonState createState() => _EditTodoButtonState();
}

class _EditTodoButtonState extends State<EditTodoButton> {
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _formKey?.currentState?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<Todos>(
      builder: (context, todos, child) {
        final todoIndex = widget.todoIndex;
        final Todo todo = todos.items[todoIndex];

        return IconButton(
          color: Colors.blue,
          icon: Icon(Icons.edit),
          onPressed: () {
            return showDialog(
              context: context,
              builder: (_) {
                return SimpleDialog(
                  title: Text('编辑 Todo'),
                  contentPadding: const EdgeInsets.all(24.0),
                  children: <Widget>[
                    Form(
                      key: _formKey,
                      child: Column(
                        children: <Widget>[
                          TextFormField(
                            autofocus: false,
                            autovalidate: false,
                            initialValue: todo.thing,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              labelText: '输入你想做的事',
                            ),
                            onChanged: (val) {
                              todo.thing = val;
                            },
                            validator: (val) {
                              if (val.isEmpty) {
                                return '想做的事不能为空';
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 20),
                          SwitchListTile(
                            title: const Text('是否完成'),
                            value: todo.finish,
                            onChanged: (bool value) {
                              todo.finish = value;
                            },
                          ),
                          SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: <Widget>[
                              FlatButton(
                                child: Text('取消'),
                                onPressed: () => Navigator.pop(context),
                              ),
                              RaisedButton(
                                child: Text(
                                  '确定',
                                  style: TextStyle(color: Colors.white),
                                ),
                                color: Theme.of(context).primaryColor,
                                onPressed: () async {
                                  final isValid =
                                      _formKey.currentState.validate();

                                  if (!isValid) {
                                    return;
                                  }

                                  try {
                                    await todos.editTodo(
                                      todoIndex,
                                      todo.thing,
                                      todo.finish,
                                    );
                                    Navigator.pop(context);
                                  } catch (e) {
                                    Scaffold.of(context).showSnackBar(
                                      SnackBar(content: Text('修改代办失败了，请重试。')),
                                    );
                                  }
                                },
                              )
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            );
          },
        );
      },
    );
  }
}
```

删除 Todo 按钮

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/todo.dart';
import '../store/todos.dart';

class RemoveTodoButton extends StatelessWidget {
  final int todoIndex;

  const RemoveTodoButton({Key key, this.todoIndex}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<Todos>(builder: (_, todos, child) {
      final Todo todo = todos.items[todoIndex];

      return IconButton(
        color: Colors.red,
        icon: Icon(Icons.delete),
        onPressed: () {
          print('delete todo');
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text('确认删除 ${todo.thing}?'),
                actions: <Widget>[
                  FlatButton(
                    child: Text(
                      '取消',
                      style: TextStyle(color: Colors.grey),
                    ),
                    onPressed: () => Navigator.pop(context),
                  ),
                  FlatButton(
                    child: Text('确认'),
                    onPressed: () async {
                      await todos.removeTodo(todoIndex);
                      Navigator.pop(context);
                    },
                  ),
                ],
              );
            },
          );
        },
      );
    });
  }
}
```

## 结语

至此所有的数据都存储在服务器上了，重启应用数据也会从服务器上获取了。
