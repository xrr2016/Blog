---
title: 学习观察者模式
categories:
  - 设计模式
tags:
  - Design Patterns
date: 2020-10-20 22:00:00
cover: ./images/design-patterns-observer/cover.png
---

![Observer](./images/design-patterns-observer/cover.png)

<!--more-->

## 什么是观察者模式

观察者模式是一种行为设计模式，允许你定义一种订阅机制，可在对象事件发生时通知多个 “观察” 该对象的对象。

有值得关注的状态的对象通常被称为目标，由于它要将自身的状态改变通知给其他对象，我们也将其称为发布者 （publisher），所有希望关注发布者状态变化的其他对象被称为订阅者（subscribers）。

当发布者发布了事件，它要遍历订阅者并调用其对象的特定通知方法。

举例说明观察者模式类似于明星与粉丝的关系，粉丝关注明星，当明星发布消息的时候，粉丝会对这个消息做出反应。

## 观察者模式适用场景

当一个对象状态的改变需要改变其他对象，可使用观察者模式。

当一些对象必须观察其他对象时，可使用观察者模式。

## 实现观察者模式

```js
// 目标
class Subject {
  constructor() {
    this.observers = []
  }

  // 添加观察者
  attach(observer) {
    const isExist = this.observers.includes(observer)

    if (isExist) {
      console.log('观察者已添加')
      return
    }

    this.observers.push(observer)
  }

  // 移除观察者
  detach(observer) {
    const index = this.observers.indexOf(observer)

    if (index < 0) {
      console.log('观察者不存在')
      return
    }

    this.observers.splice(index, 1)
  }

  // 通知观察者
  notify() {
    for (const observer of this.observers) {
      observer.update(this)
    }
  }
}

// 观察者
class Observer {
  // 接收发布事件
  update(subject) {}
}
```

## 一个例子

小明，小红，小安都会留意早餐吃什么，不同的早餐会使他们产生不同的情绪，因此早餐是目标，三人是观察者。

```js
// 继承目标类
class Breakfast extends Subject {
  constructor(element) {
    super()
    this.value = ''
    this.element = element

    this.element.addEventListener('change', (event) => {
      this.value = this.element.value
      this.notify()
    })
  }

  notify() {
    for (const observer of this.observers) {
      observer.update(this.value)
    }
  }
}

// 继承观察者类
class Person extends Observer {
  constructor(element) {
    super()
    this.mood = ''
    this.element = element
  }

  update(subject) {}
}

// 类型一
class Person1 extends Person {
  update(value) {
    switch (value) {
      case 'bread':
        this.mood = '开心'
        break
      case 'noodles':
        this.mood = '喜悦'
        break
      case 'gruel':
        this.mood = '讨厌'
        break
      default:
        this.mood = ''
        break
    }
    this.element.querySelector('.mood').innerHTML = this.mood
  }
}

// 类型二
class Person2 extends Person {
  update(value) {
    switch (value) {
      case 'bread':
        this.mood = '讨厌'
        break
      case 'noodles':
        this.mood = '开心'
        break
      case 'gruel':
        this.mood = '还可以'
        break
      default:
        this.mood = ''
        break
    }
    this.element.querySelector('.mood').innerHTML = this.mood
  }
}

// 类型三
class Person3 extends Person {
  update(value) {
    switch (value) {
      case 'bread':
        this.mood = '不喜欢'
        break
      case 'noodles':
        this.mood = '还可以'
        break
      case 'gruel':
        this.mood = '开心'
        break
      default:
        this.mood = ''
        break
    }
    this.element.querySelector('.mood').innerHTML = this.mood
  }
}

// 创建目标“早餐”
const breakfast = new Breakfast(document.getElementById('breakfast'))
// 创建观察者小明
const xiaoming = new Person1(document.getElementById('xiaoming'))
// 创建观察者小红
const xiaohong = new Person2(document.getElementById('xiaohong'))
// 创建观察者小安
const xiaoan = new Person3(document.getElementById('xiaoan'))

// 添加观察者
breakfast.attach(xiaoming)
breakfast.attach(xiaohong)
breakfast.attach(xiaoan)

// 取消观察
// breakfast.detach(xiaoan)
```

当早餐发生变化时，不同类型的人会根据不同的早餐产生不同的情绪。

![breakfrast](./images/design-patterns-observer/breakfast.gif)

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="xrr2016" data-slug-hash="xxOEqJK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Observer Pattern">
  <span>See the Pen <a href="https://codepen.io/xrr2016/pen/xxOEqJK">
  Observer Pattern</a> by Cold Stone (<a href="https://codepen.io/xrr2016">@xrr2016</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
