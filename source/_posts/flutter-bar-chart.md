---
title: 使用 Flutter 绘制图表（一）柱状图📊
categories:
  - 技术
tags:
  - Flutter
date: 2020-05-31 22:00:00
---


<!--more-->

## 前言

一直以来对图形绘制挺感兴趣的，

## CustomPaint 和 CustomPainter

`CustomPaint` 是用来创建画布的地方
`CustomPainter` 是具体绘制图形的对象

## 绘制柱状图📊

最终效果如图

<img src="./images/flutter-bar-chart/bar-chart.gif" width="568" style="width: 234px;">

第一步创建 `BarChart` 控件代表柱状图，它有两个构造参数 `final List<double> data;` 接收图表数据和 `final List<String> xAxis;` 表示图表横坐标。

然后需要实现 `BarChartPainter()` 的 `paint` 方法。

```dart
class BarChart extends StatefulWidget {
  final List<double> data;
  final List<String> xAxis;

  const BarChart({
    @required this.data,
    @required this.xAxis,
  });

  @override
  _BarChartState createState() => _BarChartState();
}

class _BarChartState extends State<BarChart> with TickerProviderStateMixin {
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 300,
          height: 300,
          child: CustomPaint(
            painter: BarChartPainter(),
          ),
        ),
      ],
    );
  }
}

class BarChartPainter extends CustomPainter {
  final List<double> datas;
  final List<String> xAxis;

  BarChartPainter({
    @required this.xAxis,
    @required this.datas,
  });

   @override
  void paint(Canvas canvas, Size size) {
    // TODO
  }

  @override
  bool shouldRepaint(BarChartPainter oldDelegate) => true;

  @override
  bool shouldRebuildSemantics(BarChartPainter oldDelegate) => false;
}

```

### 绘制坐标轴

定义一个 `_drawAxis` 方法用于绘制横轴坐标轴，使用一个由左上，左下，右下三个点控制的 `Path` 路径绘制。

```dart
void _drawAxis(Canvas canvas, Size size) {
  Color lineColor = Colors.black87;
  final sw = size.width;
  final sh = size.height;
  final paint = Paint()
    ..color = lineColor
    ..style = PaintingStyle.stroke
    ..strokeWidth = 1.0;

  final path = Path()
    ..moveTo(0, 0)
    ..lineTo(0, sh)
    ..lineTo(sw, sh);

  canvas.drawPath(path, paint);
}

@override
void paint(Canvas canvas, Size size) {
  _drawAxis(canvas, size);
}
```

效果如下

<img src="./images/flutter-bar-chart/chart-axis.png" width="508" style="width: 254px;" alt="chart-axis">

### 绘制 Y 轴标记

使用一个 `_drawLabels` 方法绘制纵轴标识，

```dart
void _drawLabels(Canvas canvas, Size size) {
  final double gap = 50;
  final double sh = size.height;
  final List<double> yAxisLabels = [];

  Paint paint = Paint()
    ..color = Colors.black87
    ..strokeWidth = 2.0;

  for (int i = 0; i < datas.length + 1; i++) {
    yAxisLabels.add(gap * i);
  }

  yAxisLabels.asMap().forEach(
    (index, label) {
      final double top = sh - label;
      final rect = Rect.fromLTWH(0, top, 4, 1);
      final Offset textOffset = Offset(
        0 - labelFontSize * 3,
        top - labelFontSize / 2,
      );

      canvas.drawRect(rect, paint);

      TextPainter(
        text: TextSpan(
          text: label.toStringAsFixed(0),
          style: TextStyle(fontSize: labelFontSize, color: Colors.black87),
        ),
        textAlign: TextAlign.right,
        textDirection: TextDirection.ltr,
        textWidthBasis: TextWidthBasis.longestLine,
      )
        ..layout(minWidth: 0, maxWidth: 24)
        ..paint(canvas, textOffset);
    },
  );
}

@override
void paint(Canvas canvas, Size size) {
  _drawAxis(canvas, size);
  _drawLabels(canvas, size);
}

```

效果如下

<img src="./images/flutter-bar-chart/chart-yaxis.png" width="520" style="width: 260px;" alt="chart-yaxis">

### 绘制数据

然后使用一个 `_darwBars` 方法将具体数据和横轴标识绘制出来。

```dart
void _darwBars(Canvas canvas, Size size) {
  final sh = size.height;
  final paint = Paint()..style = PaintingStyle.fill;

  for (int i = 0; i < datas.length; i++) {
    paint.color = colors[i];
    final double textFontSize = 14.0;
    final double data = datas[i];
    final double top = sh - data;
    final double left = i * _barWidth + (i * _barGap) + _barGap;

    final rect = Rect.fromLTWH(left, top, _barWidth, data);
    final offset = Offset(
      left + _barWidth / 2 - textFontSize * 1.2,
      top - textFontSize * 2,
    );
    canvas.drawRect(rect, paint);

    TextPainter(
      text: TextSpan(
        text: data.toStringAsFixed(1),
        style: TextStyle(fontSize: textFontSize, color: paint.color),
      ),
      textAlign: TextAlign.center,
      textDirection: TextDirection.ltr,
    )
      ..layout(
        minWidth: 0,
        maxWidth: textFontSize * data.toString().length,
      )
      ..paint(canvas, offset);

    final xData = xAxis[i];
    final xOffset = Offset(left + _barWidth / 2 - textFontSize, sh + 12);

    TextPainter(
      textAlign: TextAlign.center,
      text: TextSpan(
        text: '$xData',
        style: TextStyle(fontSize: 12, color: Colors.black87),
      ),
      textDirection: TextDirection.ltr,
    )
      ..layout(
        minWidth: 0,
        maxWidth: size.width,
      )
      ..paint(canvas, xOffset);
  }
}

@override
void paint(Canvas canvas, Size size) {
  _drawAxis(canvas, size);
  _drawLabels(canvas, size);
  _darwBars(canvas, size);
}
```

效果如下

<img src="./images/flutter-bar-chart/chart-data.png" width="520" style="width: 260px;" alt="chart-data">

### 添加动画

最后在 `_BarChartState` 里使用一个 `AnimationController` 创建柱状图运动的动画。

```dart
class _BarChartState extends State<BarChart> with TickerProviderStateMixin {
  AnimationController _controller;
  final _animations = <double>[];

  @override
  void initState() {
    super.initState();
    double begin = 0.0;
    List<double> datas = widget.data;
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 3000),
    )..forward();

    for (int i = 0; i < datas.length; i++) {
      final double end = datas[i];
      final Tween<double> tween = Tween(begin: begin, end: end);
      _animations.add(begin);

      Animation<double> animation = tween.animate(
        CurvedAnimation(
          parent: _controller,
          curve: Curves.ease,
        ),
      );
      _controller.addListener(() {
        setState(() {
          _animations[i] = animation.value;
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 300,
          height: 300,
          child: CustomPaint(
            painter: BarChartPainter(
              datas: _animations,
              xAxis: widget.xAxis,
              animation: _controller,
            ),
          ),
        ),
      ],
    );
  }
}
```

### 完整代码
```dart
import 'package:custom_paint/colors.dart';
import 'package:flutter/material.dart';

class BarChart extends StatefulWidget {
  final List<double> data;
  final List<String> xAxis;

  const BarChart({
    @required this.data,
    @required this.xAxis,
  });

  @override
  _BarChartState createState() => _BarChartState();
}

class _BarChartState extends State<BarChart> with TickerProviderStateMixin {
  AnimationController _controller;
  final _animations = <double>[];

  @override
  void initState() {
    super.initState();
    double begin = 0.0;
    List<double> datas = widget.data;
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 3000),
    )..forward();

    for (int i = 0; i < datas.length; i++) {
      final double end = datas[i];
      final Tween<double> tween = Tween(begin: begin, end: end);
      _animations.add(begin);

      Animation<double> animation = tween.animate(
        CurvedAnimation(
          parent: _controller,
          curve: Curves.ease,
        ),
      );
      _controller.addListener(() {
        setState(() {
          _animations[i] = animation.value;
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 300,
          height: 300,
          child: CustomPaint(
            painter: BarChartPainter(
              datas: _animations,
              xAxis: widget.xAxis,
              animation: _controller,
            ),
          ),
        ),
        SizedBox(height: 48),
        Container(
          decoration: BoxDecoration(
            color: Colors.blue,
            shape: BoxShape.circle,
          ),
          child: IconButton(
            color: Colors.white,
            icon: Icon(Icons.refresh),
            onPressed: () {
              _controller.reset();
              _controller.forward();
            },
          ),
        ),
      ],
    );
  }
}

class BarChartPainter extends CustomPainter {
  final List<double> datas;
  final List<String> xAxis;
  final Animation<double> animation;

  static double _barGap = 18;
  static double _barWidth = _barGap * 2;
  static double labelFontSize = 12.0;

  BarChartPainter({
    @required this.xAxis,
    @required this.datas,
    this.animation,
  }) : super(repaint: animation);

  void _drawAxis(Canvas canvas, Size size) {
    Color lineColor = Colors.black87;
    final sw = size.width;
    final sh = size.height;
    final paint = Paint()
      ..color = lineColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    final Path path = Path()
      ..moveTo(0, 0)
      ..lineTo(0, sh)
      ..lineTo(sw, sh);

    canvas.drawPath(path, paint);
  }

  void _drawLabels(Canvas canvas, Size size) {
    final double gap = 50;
    final double sh = size.height;
    final List<double> yAxisLabels = [];

    Paint paint = Paint()
      ..color = Colors.black87
      ..strokeWidth = 2.0;

    for (int i = 0; i < datas.length + 1; i++) {
      yAxisLabels.add(gap * i);
    }

    yAxisLabels.asMap().forEach(
      (index, label) {
        final double top = sh - label;
        final rect = Rect.fromLTWH(0, top, 4, 1);
        final Offset textOffset = Offset(
          0 - labelFontSize * 3,
          top - labelFontSize / 2,
        );

        canvas.drawRect(rect, paint);

        TextPainter(
          text: TextSpan(
            text: label.toStringAsFixed(0),
            style: TextStyle(fontSize: labelFontSize, color: Colors.black87),
          ),
          textAlign: TextAlign.right,
          textDirection: TextDirection.ltr,
          textWidthBasis: TextWidthBasis.longestLine,
        )
          ..layout(minWidth: 0, maxWidth: 24)
          ..paint(canvas, textOffset);
      },
    );
  }

  void _darwBars(Canvas canvas, Size size) {
    final sh = size.height;
    final paint = Paint()..style = PaintingStyle.fill;

    for (int i = 0; i < datas.length; i++) {
      paint.color = colors[i];
      final double textFontSize = 14.0;
      final double data = datas[i];
      final double top = sh - data;
      final double left = i * _barWidth + (i * _barGap) + _barGap;

      final rect = Rect.fromLTWH(left, top, _barWidth, data);
      final offset = Offset(
        left + _barWidth / 2 - textFontSize * 1.2,
        top - textFontSize * 2,
      );
      canvas.drawRect(rect, paint);

      TextPainter(
        text: TextSpan(
          text: data.toStringAsFixed(1),
          style: TextStyle(fontSize: textFontSize, color: paint.color),
        ),
        textAlign: TextAlign.center,
        textDirection: TextDirection.ltr,
      )
        ..layout(
          minWidth: 0,
          maxWidth: textFontSize * data.toString().length,
        )
        ..paint(canvas, offset);

      final xData = xAxis[i];
      final xOffset = Offset(left + _barWidth / 2 - textFontSize, sh + 12);

      TextPainter(
        textAlign: TextAlign.center,
        text: TextSpan(
          text: '$xData',
          style: TextStyle(fontSize: 12, color: Colors.black87),
        ),
        textDirection: TextDirection.ltr,
      )
        ..layout(
          minWidth: 0,
          maxWidth: size.width,
        )
        ..paint(canvas, xOffset);
    }
  }

  @override
  void paint(Canvas canvas, Size size) {
    _drawAxis(canvas, size);
    _drawLabels(canvas, size);
    _darwBars(canvas, size);
  }

  @override
  bool shouldRepaint(BarChartPainter oldDelegate) => true;

  @override
  bool shouldRebuildSemantics(BarChartPainter oldDelegate) => false;
}

```

## 总结

本文说明了什么是 CustomPaint 和 CustomPainter。
创建一个柱状图的方式

## 附

这篇文章是这个系列的开篇，预计会写 6 篇。目录如下

1. [使用 Flutter 绘制图表（一）柱状图📊]()
2. 使用 Flutter 绘制图表（二）饼状图🍪
3. 使用 Flutter 绘制图表（三）折线图📈
4. 使用 Flutter 绘制图表（四）雷达图🎯
5. 使用 Flutter 绘制图表（五）环状图🍩
6. 使用 Flutter 绘制图表（六）条形图📏
