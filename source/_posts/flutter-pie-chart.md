---
title: 使用 Flutter 绘制图表（二）饼状图🍪
categories:
  - 技术
tags:
  - Flutter
date: 2020-06-09 14:08:00
---

![pie](./images/flutter-pie-chart/cover.png)

<!--more-->

## 前言

接上文，本文实现饼状图的绘制，最终的效果如下

<img src="./images/flutter-pie-chart/pie.gif" width="524" style="width: 250px;">

## 定义 PieChart 类和 PiePart 类

`PieChart` 是整个饼状图控件，接受 `datas` 和 `legends` 两个参数

```dart
class PieChart extends StatefulWidget {
  final List<double> datas;
  final List<String> legends;

  const PieChart({
    @required this.datas,
    @required this.legends,
  });

  @override
  _PieChartState createState() => _PieChartState();
}

class _PieChartState extends State<PieChart> with TickerProviderStateMixin {
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 300,
          height: 300,
          child: CustomPaint(
            painter: PeiChartPainter(),
          ),
        ),
      ],
    );
  }
}

class PeiChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {}

  @override
  bool shouldRepaint(PeiChartPainter oldDelegate) => true;

  @override
  bool shouldRebuildSemantics(PeiChartPainter oldDelegate) => false;
}

```

`PiePart` 是饼状图里数据代表的一部分

## 绘制圆框

首先绘制图表外围的圆形，在 `PeiChartPainter` 上添加 `drawCircle` 方法，以圆的中心点和圆的半径绘制一个空心圆形。

```dart
void drawCircle(Canvas canvas, Size size) {
  final sw = size.width;
  final sh = size.height;
  // 确定圆的半径
  final double radius = math.min(sw, sh) / 2;
  // 定义中心点
  final Offset center = Offset(sw / 2, sh / 2);

  // 定义圆形的绘制属性
  final paint = Paint()
    ..style = PaintingStyle.stroke
    ..color = Colors.grey
    ..strokeWidth = 1.0;

  // 使用 Canvas 的 drawCircle 绘制
  canvas.drawCircle(center, radius, paint);
}

@override
void paint(Canvas canvas, Size size) {
  drawCircle(canvas, size);
}
```

<img src="./images/flutter-pie-chart/circle.png" width="520" style="width: 250px;">


## 绘制部分

## 绘制标识

## 添加动画

## 总结

## 附言

准备写一系列关于用 Flutter 画图表的文章，用来分享这方面的知识，这篇文章是这个系列的第二篇，预计 6 篇。

1. [使用 Flutter 绘制图表（一）柱状图📊](https://coldstone.fun/post/2020/05/31/flutter-bar-chart/)
2. [使用 Flutter 绘制图表（二）饼状图🍪](https://coldstone.fun/post/2020/05/31/flutter-bar-chart/)（本文）
3. 使用 Flutter 绘制图表（三）折线图📈
4. 使用 Flutter 绘制图表（四）雷达图🎯
5. 使用 Flutter 绘制图表（五）环状图🍩
6. 使用 Flutter 绘制图表（六）条形图📏
