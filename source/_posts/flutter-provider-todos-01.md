---
title: 使用 Provider 管理 Flutter 应用状态 (上)
date: 2019-09-11 21:48:56
tags:
  - Flutter
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/05/13/17/49/dog-6251469_960_720.jpg
---

本文说明如何使用 Provider 来管理这种应用的全局性的数据

<!--more-->

## 前言

一个应用内通常会有两种数据，部件内部的使用的临时性数据以及很多部件使用的全局性数据，部件内部使用的数据可以通过 StatefulWidget 来管理，但是全局性的数据如果通过从上到下传递的方式会使代码写的十分繁琐，这时就需要一个状态管理工具来进行管理了，本文说明如何使用 Provider 来管理这种应用的全局性的数据

## 什么是 Provider

官方的定义是： A mixture between dependency injection (DI) and state management, built with widgets for widgets. 翻译过来大意是一种依赖注入和状态管理的混合方案，使用部件创建，作用于部件 😅

[官方文档](https://pub.flutter-io.cn/documentation/provider/latest/)

## 为什么要使用 Provider

应用中通常会有一些很多部件都需要的数据，如用户的登录信息，用户设置，地理位置等，如果只是使用 StatefullWeight 的话就需要将状态提升到一个父部件中然后向下进行传递，会很繁琐，使用 provider 的话可以将对一种状态数据的操作放到一个文件内，然后使用到这个数据的部件只需要使用就可以了，当数据有变化时，部件会自动的重新构建，使界面更新。

## 一个例子 🌰

使用一个 todo 应用来说明如何在 Flutter 应用中使用 Provider，最终的完成的应用是这样的，可以新增，编辑和删除 todo。

[源码地址](https://github.com/xrr2016/flutter_provider_todos)

<img src="images/provider-todos.png" width="360" style="max-width: 360px;">

### 创建应用

首先使用命令行创建一个项目

```sh
flutter create flutter_provider_todos
```

然后在项目的 pubspec.yml 添加 provider

```yml
dependencies:
  provider: ^3.1.0
```

创建一个 store 文件夹以及 todos.dart 用来存放应用中需要用到的全局性数据，新建一个 widget 目录，用来存放应用中的部件以及一个显示 todo 的页面 todos_page.dart

<img src="images/todos-folder.jpg" width="360" style="max-width: 360px;">

首先创建 todos 这个全局性的数据，修改 store/todos.dart，创建一个 Todo 类表示一个代办事项，然后实现 Todos 类， Todos 混合了 ChangeNotifier 类，为了使用 notifyListeners 方法来通知 UI 更新，因此需要导入 foundation.dart，Todos 类使用一个 \_items 数组存放 Todo 数据，以及其它对 Todo 进行操作的方法。

```dart
import 'package:flutter/foundation.dart';

class Todo {
  bool finish;
  String thing;

  Todo({
    @required this.thing,
    this.finish = false,
  });
}

class Todos extends ChangeNotifier {
  List<Todo> _items = [
    Todo(thing: 'Play lol', finish: true),
    Todo(thing: 'Learn flutter', finish: false),
    Todo(thing: 'Read book', finish: false),
    Todo(thing: 'Watch anime', finish: false),
  ];

  get items {
    return [..._items];
  }

  get finishTodos {
    return _items.where((todo) => todo.finish);
  }

  void refresh() {
    notifyListeners();
  }

  void addTodo(Todo todo) {
    _items.insert(0, todo);

    refresh();
  }

  void removeTodo(int index) {
    _items.removeAt(index);

    refresh();
  }

  void editTodo(int index, String newThing, bool isFinish) {
    Todo todo = _items[index];
    todo.thing = newThing;
    todo.finish = isFinish;

    refresh();
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

然后使用 provider 提供的 ChangeNotifierProvider 方法将数据注册到整个应用，如果有多个数据就需要使用 MultiProvider 方法

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'todos_page.dart';
import 'store/todos.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Todos',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      home: ChangeNotifierProvider(
        builder: (context) => Todos(),
        child: TodosPage(),
      ),
    );
  }
}
```

### 列表页面

接着就是实现显示 todo 列表的页面，这个页面就是要用到 Todos 类里面的数据的部件，要使用 provider 的数据首先要导入 provider 以及对应的数据类 Todos，然后用 Consumer 加类型 Todos 来使用这个数据

```dart
Consumer<Todos>(
  builder: (ctx, todos, child) {
    return YourWidget()
  },
)
```

这个页面使用了一个 ListView.builder() 来渲染 Todos，然后每一项使用一个 ListTile 展示。新增，编辑和删除对应了 3 个不同的部件，分别是 AddTodoButton()，EditTodoButton()， RemoveTodoButton()

```dart
// todos_page.dart

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
      body: Consumer<Todos>(
        builder: (ctx, todos, child) {
          List<Todo> items = todos.items;

          return ListView.builder(
            itemCount: items.length,
            itemBuilder: (_, index) => Column(
              children: <Widget>[
                ListTile(
                  title: Text(
                    items[index].thing,
                    style: TextStyle(
                      color: items[index].finish ? Colors.green : Colors.grey,
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
            ),
          );
        },
      ),
      floatingActionButton: AddTodoButton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}

```

### 实现功能

接下来就是要实现这 3 个按钮了，在 widget 目录创建对应的文件，每个按钮都会使用到 Todos 类里面定义的方法，所以都需要导入 provider 和 Todos 类，点击按钮会弹出一个对话框询问对应的操作，

<img src="images/todos-widget.jpg" style="max-width: 360px;">

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
                                onPressed: () {
                                  final isValid =
                                      _formKey.currentState.validate();

                                  if (!isValid) {
                                    return;
                                  }

                                  final thing = _controller.value.text;

                                  todos.addTodo(Todo(
                                    thing: thing,
                                    finish: false,
                                  ));
                                  _controller.clear();
                                  Navigator.pop(context);
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

<img src="https://github.com/xrr2016/flutter_provider_todos/raw/master/add-todo.png" width="360" style="max-width: 360px;">

编辑 Todo 按钮

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

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
              builder: (context) {
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
                                onPressed: () {
                                  final isValid =
                                      _formKey.currentState.validate();

                                  if (!isValid) {
                                    return;
                                  }

                                  Navigator.pop(context);

                                  todos.editTodo(
                                    todoIndex,
                                    todo.thing,
                                    todo.finish,
                                  );
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

<img src="https://github.com/xrr2016/flutter_provider_todos/raw/master/edit-todo.png" width="360" style="max-width: 360px;">

删除 Todo 按钮

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

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
                    onPressed: () {
                      todos.removeTodo(todoIndex);
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

<img src="https://github.com/xrr2016/flutter_provider_todos/raw/master/remove-todo.png" width="360" style="max-width: 360px;">

可以看到要使用对应的方法需要的只是向对应的部件注入这个数据，然后使用就可以了

## 结语

使用了 provider 后，数据以及对一个 Todo 的操作都放在一个文件里面了，不用在多个层级间传递数据，并且在数据变化时自动更新了 UI，所以是十分有必要的。
