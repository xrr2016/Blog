---
title: 使用 Flutter 绘制图表（一）柱状图📊
categories:
  - 技术
tags:
  - Flutter
date: 2020-05-31 22:00:00
---

![bar](./images/flutter-bar-chart/cover.png)

<!--more-->

## 前言

本将讲解如何使用 [Flutter](https://flutter.dev/)[^1] 绘制一个带有动画效果的柱状图表，最终效果如下图。要绘制这样的图表普通的 Widget 比较难以实现，这时就需要 `CustomPaint` 和 `CustomPainter` 出场了，类似于 Web 里面的 `canvas` 元素，`CustomPaint` 也提供了一个绘制区域，`CustomPainter` 提供了具体绘制的方法。

<img src="./images/flutter-bar-chart/bar-chart.gif" width="568" style="width: 240px;">

## CustomPaint 和 CustomPainter

`CustomPaint` 是用来提供画布的控件，它使用一个画笔 `painter` 绘制图形于 `child` 控件之后，`foregroundPainter` 画笔绘制在 `child` 控件之前。`size` 属性控制画布的大小，假入传入 `child` 子控件，那么画布的大小将由子控件的大小决定，`size` 属性被忽略。

```dart
class CustomPaint extends SingleChildRenderObjectWidget {
  const CustomPaint({
    Key key,
    this.painter,
    this.foregroundPainter,
    this.size = Size.zero,
    this.isComplex = false,
    this.willChange = false,
    Widget child,
  })
}
```

`CustomPainter` 是一个抽象类，是实现绘制图形的控件，要在画布上绘制图形需要实现它的 `paint` 方法，`paint` 方法有两个参数，`Canvas canvas` 和 `Size size`。`Size` 对象表示画布的尺寸，`Canvas` 对象上是具体的绘制图形的方法。

```dart
abstract class CustomPainter extends Listenable {
  void paint(Canvas canvas, Size size);

  bool shouldRepaint(covariant CustomPainter oldDelegate);
}
```

`Canvas canvas` 主要绘制图形的方法有

| 方法名 | 参数 | 效果 |
| :-- | :-- | :-- |
| `drawColor` | `Color color`, `BlendMode blendMode`    | 绘制颜色到画布上 |
| `drawLine`  | `Offset p1`, `Offset p2`, `Paint paint`  | 两点之间画线 |
| `drawPaint` | `Paint paint` | 使用 [Paint] 填充画布     |
| `drawRect` | `Rect rect`, `Paint paint`  | 绘制矩形 |
| `drawRRect` | `RRect rrect`, `Paint paint` | 绘制带圆角的矩形 |
| `drawOval` | `Rect rect`, `Paint paint` | 绘制椭圆 |
| `drawCircle` | `Offset c`, `double radius`, `Paint paint` | 绘制圆形 |
| `drawArc` | `Rect rect`, `double startAngle`, `double sweepAngle`, `bool useCenter`, `Paint paint` |绘制弧形 |
| `drawPath` | `Path path`, `Paint paint` | 绘制路径 |
| `drawImage` | `Image image`, `Offset p`, `Paint paint` | 绘制图像 |
| `drawPoints` | `PointMode pointMode`, `List<Offset> points`, `Paint paint` | 绘制多个点 |

要将图形绘制到画布上需要先实例化一个 `CustomPainter`，例如绘制一个矩形需要实现一个绘制矩形的画笔 `RectanglePainter`，然后在画布 `CustomPaint` 上应用。

```dart
class RectanglePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final Rect rect = Rect.fromLTWH(50.0, 50.0, 100.0, 100.0);
    final Paint paint = Paint()
      ..color = Colors.orange
      ..style = PaintingStyle.stroke
      ..isAntiAlias = true;

    canvas.drawRect(rect, paint);
  }

  @override
  bool shouldRepaint(RectanglePainter oldDelegate) => false;
}

class Rectangle extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: CustomPaint(
        painter: RectanglePainter(),
        child: Container(
          width: 300,
          height: 300,
          decoration: BoxDecoration(
            border: Border.all(
              width: 1.0,
              color: Colors.grey[300],
            ),
          ),
        ),
      ),
    );
  }
}
```

效果如图

<img src="./images/flutter-bar-chart/rect.png" width="520" style="width: 240px;">

## 绘制柱状图



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

<img src="./images/flutter-bar-chart/chart-axis.png" width="508" style="width: 240px;" alt="chart-axis">

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

<img src="./images/flutter-bar-chart/chart-yaxis.png" width="520" style="width: 240px;" alt="chart-yaxis">

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

<img src="./images/flutter-bar-chart/chart-data.png" width="520" style="width: 240px;" alt="chart-data">

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

完整代码

## 总结

本文说明了什么是 CustomPaint 和 CustomPainter。
创建一个柱状图的方式

## 附言

准备写一系列关于用 Flutter [^1] 画图表的文章，用来分享这方面的知识，这篇文章是这个系列的开篇，预计一共会写 6 篇。

1. [使用 Flutter 绘制图表（一）柱状图📊]()（本文）
2. 使用 Flutter 绘制图表（二）饼状图🍪
3. 使用 Flutter 绘制图表（三）折线图📈
4. 使用 Flutter 绘制图表（四）雷达图🎯
5. 使用 Flutter 绘制图表（五）环状图🍩
6. 使用 Flutter 绘制图表（六）条形图📏

[^1]: [Flutter](https://flutter.dev/) 是 Google 开源的 UI 工具包，帮助开发者通过一套代码库高效构建多平台精美应用，支持移动、Web、桌面和嵌入式平台。
