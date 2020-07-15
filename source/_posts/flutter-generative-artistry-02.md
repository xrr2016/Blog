---
title: Flutter 绘制三角网格 Triangular mesh
categories:
  - 技术
tags:
  - Flutter
  - Generative artistry
date: 2020-07-14 17:56:19
---

![Triangular Mesh](./images/flutter-generative-artistry-02/cover.png)

<!--more-->

## 前言

本文实现 [Generative Artistry](https://generativeartistry.com/tutorials/) 教程的第 4 篇图形 Triangular mesh 效果如下。

<img src="./images/flutter-generative-artistry-02/colors.png" width="580" style="width: 290px">

没按顺序来，因为第二篇 Joy Division 我还没实现 😝

## 创建画布

首先创建一个用于绘制的画布，然后实现 `TriangularMeshPainter` 的 `paint` 方法。

```dart
class TriangularMesh extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: TriangularMeshPainter(),
    );
  }
}

class TriangularMeshPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {}
  @override
  bool shouldRepaint(TriangularMeshPainter oldDelegate) => false;
}
```

## 绘制端点

声明一个 `gap` 变量等比分割画布，在纵轴，横轴方向每隔 `gap` 长度使用 `canvas.drawCircle` 方法绘制圆点。

```dart
class TriangularMeshPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    List line;
    List lines = [];
    double gap = size.width / 8;

    Paint paint = Paint()
      ..color = Colors.black
      ..isAntiAlias = true;

    // 纵轴方向
    for (double y = gap / 2; y <= size.height; y += gap) {
      line = [];
      // 横轴方向
      for (double x = gap / 4; x <= size.width; x += gap) {
        line.add({"x": x, "y": y});
        // 画圆，参数分别是圆点位置，圆的半径，绘制属性
        canvas.drawCircle(Offset(x, y), 1, paint);
      }
      lines.add(line);
    }
  }
}
```

<img src="./images/flutter-generative-artistry-02/circle.png" width="580" style="width: 290px">

创建一个 `Point` 类，表示一个绘制的圆点。

```dart
class Point {
  double x;
  double y;
}
```

为了使点之间形成三角形，使用一个 `odd` 变量，在每次添加圆点的时候改变横轴坐标值。

```dart
@override
void paint(Canvas canvas, Size size) {
  List<List<Point>> lines = [];
  bool odd = false;
  List<Point> line;
  double gap = size.width / 8;

  Paint paint = Paint()
    ..color = Colors.black
    ..isAntiAlias = true;

  for (double y = gap / 2; y <= size.height; y += gap) {
    // 每次添加圆点之前对 odd 取反
    odd = !odd;
    line = [];

    for (double x = gap / 4; x <= size.width; x += gap) {
      Point point = Point();
      // 赋值圆点横轴位置时根据 odd 变量判断是否需要增加距离
      point.x = x + (odd ? gap / 2 : 0);
      point.y = y;
      line.add(point);
      canvas.drawCircle(Offset(point.x, point.y), 1, paint);
    }

    lines.add(line);
  }
}
```

<img src="./images/flutter-generative-artistry-02/odd.png" width="580" style="width: 290px">

## 绘制网格

```dart
void _drawTriangle(Canvas canvas, Point pointA, Point pointB, Point pointC) {
  Path path = Path();
  Paint line = Paint()
    ..color = Colors.black
    ..style = PaintingStyle.stroke
    ..strokeJoin = StrokeJoin.bevel
    ..isAntiAlias = true;

  path.moveTo(pointA.x, pointA.y);
  path.lineTo(pointB.x, pointB.y);
  path.lineTo(pointC.x, pointC.y);
  path.lineTo(pointA.x, pointA.y);
  canvas.drawPath(path, line);
}
```

```dart
@override
void paint(Canvas canvas, Size size) {
  ///...

  odd = true;
  List dotLine;

  for (int y = 0; y < lines.length - 1; y++) {
    odd = !odd;
    dotLine = [];
    for (var i = 0; i < lines[y].length; i++) {
      dotLine.add(odd ? lines[y][i] : lines[y + 1][i]);
      dotLine.add(odd ? lines[y + 1][i] : lines[y][i]);
    }

    for (int i = 0; i < dotLine.length - 2; i++) {
      _drawTriangle(canvas, dotLine[i], dotLine[i + 1], dotLine[i + 2]);
    }
  }
}
```

<img src="./images/flutter-generative-artistry-02/triangle.png" width="580" style="width: 290px">

## 加入随机量

```dart
double random = (Random().nextDouble() * .8 - .4) * gap;
point.x = x + random + (odd ? gap / 2 : 0);
point.y = y + (Random().nextDouble() * .8 - .4) * gap;
```

<img src="./images/flutter-generative-artistry-02/random.png" width="580" style="width: 290px">

## 添加颜色

```dart
void _drawTriangle(Canvas canvas, Point pointA, Point pointB, Point pointC) {
  Path path = Path();
  Paint fill = Paint()
    ..color = Colors.black.withOpacity(Random().nextDouble() * .9)
    // ..color = colors[Random().nextInt(colors.length)].withOpacity(.8)
    ..style = PaintingStyle.fill
    ..strokeJoin = StrokeJoin.bevel
    ..isAntiAlias = true;

  Paint line = Paint()
    ..color = Colors.black
    ..style = PaintingStyle.stroke
    ..strokeJoin = StrokeJoin.bevel
    ..isAntiAlias = true;

  path.moveTo(pointA.x, pointA.y);
  path.lineTo(pointB.x, pointB.y);
  path.lineTo(pointC.x, pointC.y);
  path.lineTo(pointA.x, pointA.y);

  canvas.drawPath(path, fill);
  canvas.drawPath(path, line);
}
```

大功告成！👏

<img src="./images/flutter-generative-artistry-02/black.png" width="580" style="width: 290px">

<img src="./images/flutter-generative-artistry-02/colors.png" width="580" style="width: 290px">

[代码地址](https://github.com/xrr2016/flutter-generative-artistry/blob/master/lib/graphs/triangular_mesh.dart)

## 参考

[Triangular Mesh](https://generativeartistry.com/tutorials/triangular-mesh)
