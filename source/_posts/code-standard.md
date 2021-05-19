---
title: 前端代码规范
date: 2019-10-10 17:59:04
tags:
  - Standard
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2020/02/05/22/37/seagulls-4822595_960_720.jpg
---

良好的代码规范有利于提高项目开发效率以及减少阅读代码的困难，本规范结合了(chaoxi)多个流行的代码规范以及前人的开发经验而成，参考规范进行开发提高代码质量

<!--more-->

## 前言

良好的代码规范有利于提高项目开发效率以及减少阅读代码的困难，本规范结合了(chaoxi)多个流行的代码规范以及前人的开发经验而成，参考规范进行开发提高代码质量

## HTML 规范

设置标准模式的文档类型

```html
<!DOCTYPE html>
<html>
  <head> </head>
</html>
```

设置页面语言

```html
<html lang="zh-CN"></html>
```

设置页面字符编码

```html
<meta charset="UTF-8" />
```

使用语义化的标签准确地描述网页的内容

```html
<main>
  <article>
    <header>
      <h1>title</h1>
      <p>published: <time datetime="2015-02-21">21st Feb, 2015</time></p>
    </header>
    <p>content</p>
  </article>
  <aside>...</aside>
  <footer>...</footer>
</main>
```

确保页面可访问性

- 给 `img`  标签添加正确的 `alt`  属性
- 使用 `label`  标签对表单进行控制

使用字符实体替代特殊字符

```html
<span>&gt;</span>
<span>&copy;</span>
<span>&lt;</span>
```

使用两个空格缩进

```html
<section>
  <h1></h1>
</section>
```

按特定顺序书写标签属性

1. `class`
1. `id`, `name`
1. `data-*`
1. `src`, `for`, `type`, `href`, `value`
1. `title`, `alt`
1. `role`, `aria-*`

```html
<!-- 示例 -->
<a class="link" id="link" data-toggle="modal" href="#">link</a>

<input class="form-control" type="text" />

<img src="example.jpg" alt="dog" />
```

不对布尔属性赋值

```html
<!-- 示例 -->
<input type="text" disabled />

<input type="checkbox" value="1" checked />

<select>
  <option value="1" selected>1</option>
</select>
```

## CSS 规范  

全局设置盒子模型

```css
* {
  box-sizing: border-box;
}
```

使用简洁的 class 命名

class 的命名应该尽量简洁、明确，以字母开头命名，且全部字母为小写，单词之间使用连字符 “-”  连接。<br />每个模块使用一个模块命名，子元素使用模块名 + 元素作用名名

```html
<!-- 示例 -->
<header class="header">
  <h1 class="header-title"></h1>
</header>
```

使用常用的 class 命名

**包裹类：** container, wrapper, outer, inner, box, header, footer, main, content, aside, page, section, block

**状态类：** primary, secondary, success, danger, warning, info, error, link, light, dark, disabled, active,         checked, loading

**尺寸类：** large, middle, small, bigger, smaller

**组件类：** card, list, picture, carousel, swiper, menu, navs, badge, hint, modal, dialog

**位置类：** first, last, current, prev, next, forward, back

**文本类：** title, desc, content, date, author, category，label，tag

**人物类：** avatar, name, age, post, intro

| Class Name             | 含义                                     |
| :--------------------- | :--------------------------------------- |
| about                  | 关于                                     |
| account                | 账户                                     |
| arrow                  | 箭头图标                                 |
| article                | 文章                                     |
| aside                  | 边栏                                     |
| audio                  | 音频                                     |
| avatar                 | 头像                                     |
| bg,background          | 背景                                     |
| bar                    | 栏（工具类）                             |
| branding               | 品牌化                                   |
| crumb,breadcrumbs      | 面包屑                                   |
| btn,button             | 按钮                                     |
| caption                | 标题，说明                               |
| category               | 分类                                     |
| chart                  | 图表                                     |
| clearfix               | 清除浮动                                 |
| close                  | 关闭                                     |
| col,column             | 列                                       |
| comment                | 评论                                     |
| community              | 社区                                     |
| container              | 容器                                     |
| content                | 内容                                     |
| copyright              | 版权                                     |
| current                | 当前态，选中态                           |
| default                | 默认                                     |
| description            | 描述                                     |
| details                | 细节                                     |
| disabled               | 不可用                                   |
| entry                  | 文章，博文                               |
| error                  | 错误                                     |
| even                   | 偶数，常用于多行列表或表格中             |
| fail                   | 失败（提示）                             |
| feature                | 专题                                     |
| fewer                  | 收起                                     |
| field                  | 用于表单的输入区域                       |
| figure                 | 图                                       |
| filter                 | 筛选                                     |
| first                  | 第一个，常用于列表中                     |
| footer                 | 页脚                                     |
| forum                  | 论坛                                     |
| gallery                | 画廊                                     |
| group                  | 模块，清除浮动                           |
| header                 | 页头                                     |
| help                   | 帮助                                     |
| hide                   | 隐藏                                     |
| hightlight             | 高亮                                     |
| home                   | 主页                                     |
| icon                   | 图标                                     |
| info,information       | 信息                                     |
| last                   | 最后一个，常用于列表中                   |
| links                  | 链接                                     |
| login                  | 登录                                     |
| logout                 | 退出                                     |
| logo                   | 标志                                     |
| main                   | 主体                                     |
| menu                   | 菜单                                     |
| meta                   | 作者、更新时间等信息栏，一般位于标题之下 |
| module                 | 模块                                     |
| more                   | 更多（展开）                             |
| msg,message            | 消息                                     |
| nav,navigation         | 导航                                     |
| next                   | 下一页                                   |
| nub                    | 小块                                     |
| odd                    | 奇数，常用于多行列表或表格中             |
| off                    | 鼠标离开                                 |
| on                     | 鼠标移过                                 |
| output                 | 输出                                     |
| pagination             | 分页                                     |
| pop,popup              | 弹窗                                     |
| preview                | 预览                                     |
| previous               | 上一页                                   |
| primary                | 主要                                     |
| progress               | 进度条                                   |
| promotion              | 促销                                     |
| rcommd,recommendations | 推荐                                     |
| reg,register           | 注册                                     |
| save                   | 保存                                     |
| search                 | 搜索                                     |
| secondary              | 次要                                     |
| section                | 区块                                     |
| selected               | 已选                                     |
| share                  | 分享                                     |
| show                   | 显示                                     |
| sidebar                | 边栏，侧栏                               |
| slide                  | 幻灯片，图片切换                         |
| sort                   | 排序                                     |
| sub                    | 次级的，子级的                           |
| submit                 | 提交                                     |
| subscribe              | 订阅                                     |
| subtitle               | 副标题                                   |
| success                | 成功（提示）                             |
| summary                | 摘要                                     |
| tab                    | 标签页                                   |
| table                  | 表格                                     |
| txt,text               | 文本                                     |
| thumbnail              | 缩略图                                   |
| time                   | 时间                                     |
| tips                   | 提示                                     |
| title                  | 标题                                     |
| video                  | 视频                                     |
| wrap                   | 容器，包，一般用于最外层                 |
| wrapper                | 容器，包，一般用于最外层                 |

不使用 ID 选择器

```css
// bad
#title {
  color: blue;
}

// good
.title {
  color: blue;
}
```

不要为  `0`  值设置单位

```css
// bad
.content {
  margin-top: 0px;
}

// good
.content {
  margin-top: 0;
}
```

遵循以下的样式书写顺序

1. 布局定位属性：position / display / float / clear / visibility / overflow
1. 盒属性：width / height / margin / padding / border / background
1. 文本属性：color / font / text-decoration / text-align / vertical-align / white- space / break-word
1. 视觉属性：background-color / border / border-radius / box-shadow
1. 其他属性：content / cursor /  text-shadow / background:linear-gradient

```css
.box {
  /* Positioning */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;

  /* Box-model */
  display: block;
  float: right;
  width: 100px;
  height: 100px;

  /* Typography */
  font: normal 13px 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  color: #333;
  text-align: center;

  /* Visual */
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 3px;

  /* Misc */
  opacity: 1;
}
```

嵌套选择器的深度不要超过 3 层

```css
.container {
  .content {
    .profile {
      /* STOP! */
    }
  }
}
```

不要使用 `@import`

```html
/* bad */ @import url("other.css"); /* good */
<link rel="stylesheet" href="other.css" />
```

将媒体查询语句放在靠近相关规则最近的位置

```css
.element {
  /* ... */
}
.element-avatar {
  /* ... */
}
.element-selected {
  /* ... */
}

@media (min-width: 480px) {
  .element {
    /* ... */
  }
  .element-avatar {
    /* ... */
  }
  .element-selected {
    /* ... */
  }
}
```

使用简短的申明语句

```css
// bad
.content {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
}

// good
.content {
  padding: 10px 20px;
}
```

使用 stylelint 检查样式代码

[https://github.com/shinnn/vscode-stylelint](https://github.com/shinnn/vscode-stylelint)

## JS 规范

使用 const 优于 let，弃用 var

```javascript
// bad
var name = 'jack'

let myVariable = 'myVariable'

// good
const FIRST_US_PRESIDENT = 'George Washington'
```

使用字面量创建对象

```javascript
// bad
const a = new Object{}

// good
const obj = {}
```

函数名或方法名使用动宾短语

```javascript
// bad
function userInfo() {
	...
}

// good
function getUserInfo() {
	...
}
```

命名所有的方法包含闭包和回调, 避免匿名方法

命名方法和函数可以让你在代码运行出错时更快的找到错误

布尔值变量使用 is 开头的词组

```javascript
// bad
const finished = false

// good
const isFinished = false
```

避免重复的描述对象

```javascript
// bad
const car = {
  carMake: 'Honda',
  carModel: 'Accord',
  carColor: 'Blue'
}

// good
const Car = {
  make: 'Honda',
  model: 'Accord',
  color: 'Blue'
}
```

使用有意义可读性好的变量名

```javascript
// bad
const yyyymmdstr = moment().format('YYYY/MM/DD')

for (var i = 0; i < 525600; i++) {
  runCronJob()
}

// good
const yearMonthDay = moment().format('YYYY/MM/DD')

const MINUTES_IN_A_YEAR = 525600
for (var i = 0; i < MINUTES_IN_A_YEAR; i++) {
  runCronJob()
}
```

将函数参数限制 2 个以内

```javascript
// bad
function createMenu(title, body, buttonText, cancellable) {
  ...
}

// good
const menuConfig = {
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true
}

function createMenu(menuConfig) {
  ...
}

```

封装判断条件

将多个条件的判断结果赋值给一个变量或使用一个函数返回

```javascript
// bad
if (fsm.state === 'fetching' && isEmpty(listNode)) {
  /// ...
}

// good
function shouldShowSpinner(fsm, listNode) {
  return fsm.state === 'fetching' && isEmpty(listNode)
}

if (shouldShowSpinner(fsmInstance, listNodeInstance)) {
  // ...
}
```

避免否定情况的判断

尽可能只使用正向的判断

```javascript
// bad
if(!isLoading) {
  ...
}

// good
if(isLoading) {
  ...
}
```

删除无效的代码

及时删除不再被调用的代码，避免给阅读代码带来困扰

使用 `try/catch`  语句捕获可能出现的错误

```js
try {
  functionThatMightThrow()
} catch (error) {
  // 不单单只是使用 console
  console.error(error)
  // 更多的错误处理
  notifyUserOfError(error)
  // 报告错误
  reportErrorToService(error)
}
```

只注释业务逻辑复杂性的代码

```js
function hashIt(data) {
  var hash = 0
  var length = data.length

  for (var i = 0; i < length; i++) {
    var char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char

    // Convert to 32-bit integer
    hash = hash & hash
  }
}
```

## Vue 规范

将组件名命名为多个单词

```json
// bad
todo.vue

// good
todo-item.vue
```

使用 PascalCase 或者 kebab-case 命名组件

```html
<!-- bad  -->
components/ |- mycomponent.vue components/ |- myComponent.vue

<!-- good -->
components/ |- MyComponent.vue components/ |- my-component.vue
```

详细定义组件的  Prop

```javascript
// bad
props: ['status']

// good
props: {
   status: {
    type: String,
    required: true
  }
}
```

在 v-for 循环上加 key

```html
<!-- bad -->
<li v-for="todo in todos">
  {{ todo.text }}
</li>

<!-- good -->
<li v-for="todo in todos" :key="todo.id">
  {{ todo.text }}
</li>
```

不要把  v-if  和  v-for  同时用在同一个元素上

```html
<!-- bad -->
<ul>
  <li v-for="user in users" v-if="shouldShowUsers" :key="user.id">
    {{ user.name }}
  </li>
</ul>

<!-- good -->
<ul v-if="shouldShowUsers">
  <li v-for="user in users" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

为组件样式设置作用域

```html
<!-- bad -->
<template>
  <button class="btn btn-close">X</button>
</template>

<style>
  .btn-close {
    background-color: red;
  }
</style>

<!--  good -->
<template>
  <button class="c-button c-button--close">X</button>
</template>

<!-- 使用 BEM 约定 -->
<style>
  .c-button {
    border: none;
    border-radius: 2px;
  }

  .c-button--close {
    background-color: red;
  }
</style>
```

**组件和实例的选项使用统一的顺序**

1. **副作用**(触发组件外的影响)

- `el`

2. **全局感知**(要求组件以外的知识)

- `name`
- `parent`

3. **组件类型**(更改组件的类型)

- `functional`

4. **模板修改器**(改变模板的编译方式)

- `delimiters`
- `comments`

5. **模板依赖**(模板内使用的资源)

- `components`
- `directives`
- `filters`

6. **组合**(向选项里合并属性)

- `extends`
- `mixins`

7. **接口**(组件的接口)

- `inheritAttrs`
- `model`
- `props`/`propsData`

8. **本地状态**(本地的响应式属性)

- `data`
- `computed`

9. **事件**(通过响应式事件触发的回调)

- `watch`
- 生命周期钩子 (按照它们被调用的顺序)
  - `beforeCreate`
  - `created`
  - `beforeMount`
  - `mounted`
  - `beforeUpdate`
  - `updated`
  - `activated`
  - `deactivated`
  - `beforeDestroy`
  - `destroyed`

10. **非响应式的属性**(不依赖响应系统的实例属性)

- `methods`

11. **渲染**(组件输出的声明式描述)

- `template`/`render`
- `renderError`

**元素和组件的特性使用统一的顺序**

1. **定义**(提供组件的选项)

- `is`

2. **列表渲染**(创建多个变化的相同元素)

- `v-for`

3. **条件渲染**(元素是否渲染/显示)

- `v-if`
- `v-else-if`
- `v-else`
- `v-show`
- `v-cloak`

4. **渲染方式**(改变元素的渲染方式)

- `v-pre`
- `v-once`

5. **全局感知**(需要超越组件的知识)

- `id`

6. **唯一的特性**(需要唯一值的特性)

- `ref`
- `key`
- `slot`

7. **双向绑定**(把绑定和事件结合起来)

- `v-model`

8. **其它特性** (所有普通的绑定或未绑定的特性)<br />
9. **事件**(组件事件监听器)

- `v-on`

10. **内容**(覆写元素的内容)

- `v-html`
- `v-text`

保证一个组件专注于解决一个问题

确保一个组件是独立的、可复用的、微小的和可测试的

将行内表达式转为  computed

```html
// bad
<template>
  <h1>
    {{ (new Date()).getUTCFullYear() }}
  </h1>
</template>

// good
<template>
  <h1>
    {{ year }}
  </h1>
</template>
<script type="text/javascript">
  export default {
    computed: {
      year() {
        return new Date().getUTCFullYear()
      }
    }
  }
</script>
```

尽可能使用 mixins

Mixins 封装可重用的代码，避免了重复。如果两个组件共享有相同的功能，则可以使用 mixin

```javascript
const HelloMixin = {
	methods: {
  	hello() {
    	console.log('hello')
    }
  }
}

// CompA
<script>
  import HelloMixin from './HelloMixin'

  export default {
    name: 'CompA',
    mixins: [HelloMixin]
  }
</script>

// CompB
<script>
  import HelloMixin from './HelloMixin'

  export default {
    name: 'CompB',
    mixins: [HelloMixin]
  }
</script>

```

## Node 规范

require 文件夹，而不是文件

在一个文件夹中开发库/模块，放置一个文件 index.js 暴露模块的内部

使用 .npmrc 锁住依赖版本

代码必须在所有的环境中是相同的，但是 Npm 默认情况下会拿包的最新版本，配置 .npmrc 锁定依赖版本

```basic
save-exact=true
```

在 Node 外管理前端资源

使用专门的中间件（nginx，S3，CDN）服务前端内容，这是因为在处理大量静态文件的时候，由于 node 的单线程模型，它的性能很受影响

使用中间件限制并发请求

DOS 攻击非常流行而且相对容易处理。使用外部服务，比如 cloud 负载均衡, cloud 防火墙, nginx, 或者（对于小的，不是那么重要的 app）一个速率限制中间件(比如[express-rate-limit](https://www.npmjs.com/package/express-rate-limit))，来实现速率限制。否则应用程序可能受到攻击, 导致拒绝服务, 在这种情况下, 真实用户会遭受服务降级或不可用。

验证传入的 JSON schemas

验证传入请求的 body payload，并确保其符合预期要求, 如果没有, 则快速报错。为了避免每个路由中繁琐的验证编码, 您可以使用基于 JSON 的轻量级验证架构，比如  [jsonschema](https://www.npmjs.com/package/jsonschema) or [joi](https://www.npmjs.com/package/joi)，否则您疏忽和宽松的方法大大增加了攻击面, 并鼓励攻击者尝试许多输入, 直到他们找到一些组合, 使应用程序崩溃。

使用非 root 用户运行 Node.js

Node.js 作为一个具有无限权限的 root 用户运行，这是一种普遍的情景。例如，在 Docker 容器中，这是默认行为。建议创建一个非 root 用户，并保存到 Docker 镜像中（下面给出了示例），或者通过调用带有"-u username" 的容器来代表此用户运行该进程，否则在服务器上运行脚本的攻击者在本地计算机上获得无限制的权利 (例如，改变 iptable，引流到他的服务器上)

## 其它规范

使用 jest 进行单元测试

通常只要求对一些基础/底层的组件、函数进行测试, 视情况考虑是否要测试业务代码

使用 [Prettier](https://link.juejin.im/?target=https%3A%2F%2Fprettier.io)  格式化代码

<br />所有代码格式相关的工作都可以交给 Prettier 来做

合理的图片命名

图片业务 + 图片功能类别 + 图片模块名称 + 图片精度

## 参考资料

- [Code Guide](https://codeguide.co)
- [O2 前端规范文档](https://guide.aotu.io/)
- [JavaScript 风格指南](https://github.com/alivebao/clean-code-js)
- [Vue  风格指南](https://cn.vuejs.org/v2/style-guide/)
- [Vue.js 组件编码规范](https://github.com/pablohpsilva/vuejs-component-style-guide/blob/master/README-CN.md)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices/blob/master/README.chinese.md)
