---
title: 学习绘制类图和流程图
categories:
  - 学习
tags:
  - PlantUML
  - Flowchart
date: 2020-03-26 10:00:00
---

学习绘制类图，流程图

<!--more-->

## 前言

[PlantUML](https://plantuml.com/zh/) 是一个开源项目，支持快速绘制时序图、用例图、类图、活动图、组件图、状态图、对象图、部署图等。同时还支持非 UML 图的甘特图、架构图等。通过简单直观的语言来定义这些示意图。

前段时间设计后端表结构的时候接触了 `PlantUML` 觉得还是挺有意思的，它能够直观表现出类的属性和方法，反应出类与类之间的关系。之前有同事做后端设计的时候就是用的这种图来表现的，因此来学习一番。

## 通用语法

- 单行注释：以单引号 `'` 开头的语句。
- 多行注释：以 `/'` 和 `'/` 作为注释的开始和结束。
- 页眉：使用 `header` 命令在生成的图中增加页眉，用 `center`, `left` 或 `right` 实现居中、左对齐和右对齐。
- 页脚：使用 `footer` 命令在生成的图中增加页眉，用 `center`, `left` 或 `right` 实现居中、左对齐和右对齐。
- 缩放：使用 `scale` 命令缩放生成的图像。
- 标题：使用 `title` 关键字添加标题。
- 图片标题：使用 `caption` 关键字在图像下放置一个标题.
- 图例说明: `legend` 和 `endlegend` 作为关键词，使用 `left`, `right`, `center` 为这个图例指定对齐方式。

```uml
@startuml
scale 720*480

'A single line comment

/'
  This is
  Multilie
  Comment
'/


center header
This is header
endheader

title This is title

caption This is caption

Romeo -> Juliet : love


legend
This is a legend
endlegend

footer This is footer
@enduml
```

<!-- <img src="./images/uml-demo.png" width="300" style="width: 300px;" > -->

![base](http://www.plantuml.com/plantuml/png/HP3D2i8m48JlynHxAmZI8eBYGIhU12_Y2uHsRHVo8ytMvtUnFrwIRoQp6TWwgnjq31wvSPxfiAis-sC551VA4Zkpl4Ic9eN0KO6o0D6pbqoIZUwZL_72XjSvKfG06YCUg6VNseLvODKSsma15RMI9V1JDkxUAYckzgo1HmgSQ7kcssYjIYVowSC0F7VswR_9qUBOCI7mIacjVibC4hMzsGQ-)

## 类图


```uml
@startuml
title 类图
class Persion {
  + name: String
  + String gender
  + String skill

  + eat()
  + sleep()
}


class Doctor {
 + treat()
}

class Programmer {
 + code()
}

class Food {}

Persion <|-- Doctor
Persion <|-- Programmer
Persion *-- "Food" : eat
@enduml
```

## 流程图

流程图使用 [Flowchart](http://flowchart.js.org/) 绘制，语法比较简单


## 参考

[PlantUML Docs](https://plantuml.com/zh/)

[UML Class Diagrams Tutorial, Step by Step](https://medium.com/@smagid_allThings/uml-class-diagrams-tutorial-step-by-step-520fd83b300b)

[Flowchart](https://github.com/adrai/flowchart.js)
