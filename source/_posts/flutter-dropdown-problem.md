---
title: 记录两个使用 Flutter 的 DropdownButton 问题
categories:
  - 技术
tags:
  - Flutter
date: 2020-03-24 16:08:27
cover: https://cdn.pixabay.com/photo/2020/06/15/09/30/butterfly-5301066_960_720.jpg
---

记录两个关于 `DropdownButton` 的问题

<!--more-->


这几天在使用 `Flutter` 开发应用过程中遇到关于 `DropdownButton` 两个问题，记录一下。

问题一：在 `showModalBottomSheet` 里面使用 `DropdownButton` 改变选择后界面不变化。

![no-change](./images/flutter-dropdown-problem/dropdown-no-change.gif)

但是 `onChanged` 事件已经触发

![console](./images/flutter-dropdown-problem/console.png)

代码如下
```dart
int _type = 0;
...
IconButton(
  icon: Icon(Icons.filter_list),
  onPressed: () {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Row(
                children: <Widget>[
                  SizedBox(
                    width: 80.0,
                    child: Text('类型: '),
                  ),
                  DropdownButton<int>(
                    value: _type,
                    onChanged: (int newValue) {
                      setState(() {
                        _type = newValue;
                      });
                      print(newValue.toString());
                    },
                    items: [
                      DropdownMenuItem<int>(
                        value: 0,
                        child: Text('类型 1'),
                      ),
                      DropdownMenuItem<int>(
                        value: 1,
                        child: Text('类型 2'),
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
),
```

解决方法：添加一个 `StatefulBuilder` 部件在最外层即可

```dart
showModalBottomSheet(
  context: context,
  builder: (BuildContext context) {
    return StatefulBuilder(
      builder: (context, StateSetter setState) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Row(
                children: <Widget>[
                  SizedBox(
                    width: 80.0,
                    child: Text('类型: '),
                  ),
                  DropdownButton<int>(
                    value: _type,
                    onChanged: (int newValue) {
                      setState(() {
                        _type = newValue;
                      });
                      print(newValue.toString());
                    },
                    items: [
                      DropdownMenuItem<int>(
                        value: 0,
                        child: Text('类型 1'),
                      ),
                      DropdownMenuItem<int>(
                        value: 1,
                        child: Text('类型 2'),
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
```

问题二：当多个 `DropdownMenuItem` 值相同时会报错

![crash](./images/flutter-dropdown-problem/crash.png)

这个报错产生的原因是这里的 `DropdownMenuItem` 是请求后端接口后会生成很多选项，如果设置了 `DropdownButton` 的 `value` 值，那么 `DropdownMenuItem` 就会有相同的值，出现这个错误。

解决方法：不设置 `DropdownButton` 的初始 `value` 值

```dart
DropdownButton<int>(
  // value: 0,
  onChanged: (int newValue) {
    setState(() {});
  },
  items: types.map(
    (item) {
      return DropdownMenuItem<int>(
        value: item["value"],
        child: Text(item["label"]),
      );
    },
  ).toList(),
);
```

ps：这两个问题卡了我两天😔
