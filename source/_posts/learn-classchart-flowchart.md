---
title: PlantUML 类图及 Flowchart 流程图绘制入门
categories:
  - 学习
tags:
  - PlantUML
  - Flowchart
date: 2020-03-26 10:00:00
---

![draw](./images/draw.jpg)

<!--more-->

## 前言

前段时间设计后端表结构的时候接触了 `PlantUML`，它能够直观表现出类的属性和方法，反应出类与类之间的关系。之前有同事就是用 `PlantUML` 来做后端数据表设计工作的，所以有必要学习一下。

流程图 `Flowchart` 是用来展示操作过程或逻辑流程的一种图表，语法比较简单，方便易用，一些比较复杂的判断都可以使用一个流程图来直观表现。

## PlantUML

[PlantUML](https://plantuml.com/zh/) 是一个开源项目，支持快速绘制时序图、用例图、类图、活动图、组件图、状态图、对象图、部署图等。同时还支持非 UML 图的甘特图、架构图等。

`PlantUML` 有一些通用语法

- 单行注释：以单引号 `'` 开头的语句。
- 多行注释：以 `/'` 和 `'/` 作为注释的开始和结束。
- 页眉：使用 `header` 命令在生成的图中增加页眉，用 `center`, `left` 或 `right` 实现居中、左对齐和右对齐。
- 页脚：使用 `footer` 命令在生成的图中增加页眉，用 `center`, `left` 或 `right` 实现居中、左对齐和右对齐。
- 缩放：使用 `scale` 命令缩放生成的图像。
- 标题：使用 `title` 关键字添加标题。
- 图片标题：使用 `caption` 关键字在图像下放置一个标题.
- 图例说明: `legend` 和 `endlegend` 作为关键词，使用 `left`, `right`, `center` 为这个图例指定对齐方式。

一个🌰 [查看](http://www.plantuml.com/plantuml/uml/FO_D2i8m48JlynHxAmZI8eBYGIhU12_Y2uHsRHVo8ytMvtVHj8V0DxERcQJDwYQTWqVkd6Swx9hD_jW0rOMonC4iBv6fIo5mLA2kGFGS9PDae_liLRomuRMiL3M0peWd6jdrFA7iBv9ZNmWgQXNB_AViidkhfBZQHGEF53ZHzaotsJgLJkJJXwtEys2XQu-ZOjWfX5TAzg8ryo_Hsin-_mK0)

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

<img style="width: 320px;" alt="base" src="http://www.plantuml.com/plantuml/png/HP3D2i8m48JlynHxAmZI8eBYGIhU12_Y2uHsRHVo8ytMvtUnFrwIRoQp6TWwgnjq31wvSPxfiAis-sC551VA4Zkpl4Ic9eN0KO6o0D6pbqoIZUwZL_72XjSvKfG06YCUg6VNseLvODKSsma15RMI9V1JDkxUAYckzgo1HmgSQ7kcssYjIYVowSC0F7VswR_9qUBOCI7mIacjVibC4hMzsGQ-">


### 类图

类与类之间有几种不同的关系

| 关系  | 意思 | 标记 |
| :- | :- | :- |
| Association 关系 | 两个类之间有相互关系 | <code><--</code> |
| Inheritance 继承 | 子类继承父类 | <code><\|--</code> |
| Composition 组合 | 两个类之间相互依赖 | <code>*--</code> |
| Aggregation 聚合 | 一个类属于另一个类 | <code>o--</code> |
| Implementation 实现 | 一个类实现另一个类的方法 | <code><\|..</code> |
| Dependency 依赖 | 一个类依赖于另一个类 | <code><..</code> |

![关系图](https://miro.medium.com/max/1180/1*EUvDMA1vr0DiucONPzK9kA.png)

设计一个博客系统😜 [点击查看](http://www.plantuml.com/plantuml/umla/XPBHwjCm58VlynJdSdDs3lL2YiZ4Hn2zh-t11TeKaenTw63Wc5CSSwB3JS4v54MXkn2nEFLfbgQ-XUiQszaXV-X5slFzlfoSj2samsKty8bm7H_XyfNMkKiNMyH59f531nqFETd5WrtyIKS3DNcXbqCrMQfehRzizVODGUOPYX3NTuI0srHG6NAuH-0E3ti2QtNIBwhNkQIkZrcr0TIpWJAPBPskx8IyU7L39f596uJabDqz4jmIU713mwIp9NC2jE5cpWBi7mjwd4eqszKgllg1SCCWG2R_o_IBfhs0icnJ2ppqiTIQ5kfbvKRk_AU27fMLnFdoXCTK9LsXeEp8W2U3g9mX-tGqsIn_cD_L-vPbJcK3wEYjVZfIivV9wqTglFgzU7T1_vYdlsR9_A7-l5BFdgIROHfztzzz-k2dUlpAI9hDuZfjqCy_9kDlQhhPRT-hqIAFbg1f-1JCrUIloBAk5N-G3KaSgsYTiydNQVfXRBn6ToPkx6raNZVm_m00)

```uml
@startuml
center header
一个简单的博客系统
endheader


class Visitor {
 browse()
}


class Article {
 + id: int
 + author: int
 + content: string
}


class User {
  +id: int
  +name: String

  - writeArticle(content: string)
  - commentArticle(content: string)
}

class Admin {
 - deleteArticle(id: int)
 - deleteComment(id: int)
 - editArticle(id: int, content: int)
 - editComment(id: int, content: int)
}

class Comment {
  +id: int
  +content: string
  +author: int
}

User <|-- Admin : 管理员有删除/编辑文章和评论的能力
User <.. Article : 用户可以写文章
User <.. Comment : 用户可以写评论
Article --> Visitor : 游客可以浏览文章
Comment --> Visitor : 游客可以浏览评论
@enduml
```

![blog](./images/learn-chart/class.png)

## Flowchart

流程图使用 [Flowchart](http://flowchart.js.org/) 绘制，语法比较简单

定义流程图元素

`name=>type: content:>url`

- name: 元素的名称
- type：类型，包括如下类别：
  - start
  - end
  - operation
  - subroutine
  - condition
  - inputoutput
  - parallel
- content：文本内容
- url：连接

示例如下

```ts
st=>start: 艰难的开始
ge=>end: 你成功了:>https://www.zhihu.com/hot
be=>end: 你失败了:>https://bbs.hupu.com/bxj

skill=>condition: 有技能吗
money=>condition: 有钱吗
handsome=>condition: 长得帅吗

dream=>operation: 做梦
imp=>operation: 努力提高自己
work=>operation: 工作/读书
make=>operation: 投资理财
rich=>operation: 找富婆

st->skill
skill(yes)->work->ge
skill(no)->money
money(yes)->make->ge
money(no)->handsome
handsome(yes)->rich->ge
handsome(no)->be
```

![start](./images/learn-chart/flow.png)

## 参考

[PlantUML Docs](https://plantuml.com/zh/)

[UML Class Diagrams Tutorial, Step by Step](https://medium.com/@smagid_allThings/uml-class-diagrams-tutorial-step-by-step-520fd83b300b)

[Flowchart](https://github.com/adrai/flowchart.js)
