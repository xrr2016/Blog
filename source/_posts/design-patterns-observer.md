---
title: 学习观察者模式
categories:
  - 设计模式
tags:
  - Design Patterns
date: 2020-10-08 12:30:00
---

<!--more-->

1. 什么是观察者模式

   观察者模式是一种行为设计模式， 允许你定义一种订阅机制， 可在对象事件发生时通知多个 “观察” 该对象的其他对象。

   拥有一些值得关注的状态的对象通常被称为目标， 由于它要将自身的状态改变通知给其他对象， 我们也将其称为发布者 （publisher）。 所有希望关注发布者状态变化的其他对象被称为订阅者 （subscribers）。

   无论何时发生了重要的发布者事件， 它都要遍历订阅者并调用其对象的特定通知方法。

2. 观察者模式的运作方式

   当新事件发生时， 发送者会遍历订阅列表并调用每个订阅者对象的通知方法。 该方法是在订阅者接口中声明的。

   订阅者 （Subscriber） 接口声明了通知接口。 在绝大多数情况下， 该接口仅包含一个 update 更新方法。 该方法可以拥有多个参数， 使发布者能在更新时传递事件的详细信息。

   具体订阅者 （Concrete Subscribers） 可以执行一些操作来回应发布者的通知。 所有具体订阅者类都实现了同样的接口， 因此发布者不需要与具体类相耦合。

   订阅者通常需要一些上下文信息来正确地处理更新。 因此， 发布者通常会将一些上下文数据作为通知方法的参数进行传递。 发布者也可将自身作为参数进行传递， 使订阅者直接获取所需的数据。

3. 观察者模式的适用场景

   当一个对象状态的改变需要改变其他对象， 或实际对象是事先未知的或动态变化的时， 可使用观察者模式。

4. 观察者模式实现方式

   1. 仔细检查你的业务逻辑，  试着将其拆分为两个部分：  独立于其他代码的核心功能将作为发布者；  其他代码则将转化为一组订阅类。
   2. 声明订阅者接口。  该接口至少应声明一个  `update`方法。
   3. 声明发布者接口并定义一些接口来在列表中添加和删除订阅对象。  记住发布者必须仅通过订阅者接口与它们进行交互。
   4. 确定存放实际订阅列表的位置并实现订阅方法。  通常所有类型的发布者代码看上去都一样，  因此将列表放置在直接扩展自发布者接口的抽象类中是显而易见的。  具体发布者会扩展该类从而继承所有的订阅行为。

      但是，  如果你需要在现有的类层次结构中应用该模式，  则可以考虑使用组合的方式：  将订阅逻辑放入一个独立的对象，  然后让所有实际订阅者使用该对象。

   5. 创建具体发布者类。  每次发布者发生了重要事件时都必须通知所有的订阅者。
   6. 在具体订阅者类中实现通知更新的方法。  绝大部分订阅者需要一些与事件相关的上下文数据。  这些数据可作为通知方法的参数来传递。

      但还有另一种选择。  订阅者接收到通知后直接从通知中获取所有数据。  在这种情况下，  发布者必须通过更新方法将自身传递出去。  另一种不太灵活的方式是通过构造函数将发布者与订阅者永久性地连接起来。

   7. 客户端必须生成所需的全部订阅者，  并在相应的发布者处完成注册工作。

5. 观察者模式实战

   ```jsx
   /**
    * The Subject interface declares a set of methods for managing subscribers.
    */
   interface Subject {
       // Attach an observer to the subject.
       attach(observer: Observer): void;

       // Detach an observer from the subject.
       detach(observer: Observer): void;

       // Notify all observers about an event.
       notify(): void;
   }

   /**
    * The Subject owns some important state and notifies observers when the state
    * changes.
    */
   class ConcreteSubject implements Subject {
       /**
        * @type {number} For the sake of simplicity, the Subject's state, essential
        * to all subscribers, is stored in this variable.
        */
       public state: number;

       /**
        * @type {Observer[]} List of subscribers. In real life, the list of
        * subscribers can be stored more comprehensively (categorized by event
        * type, etc.).
        */
       private observers: Observer[] = [];

       /**
        * The subscription management methods.
        */
       public attach(observer: Observer): void {
           const isExist = this.observers.includes(observer);
           if (isExist) {
               return console.log('Subject: Observer has been attached already.');
           }

           console.log('Subject: Attached an observer.');
           this.observers.push(observer);
       }

       public detach(observer: Observer): void {
           const observerIndex = this.observers.indexOf(observer);
           if (observerIndex === -1) {
               return console.log('Subject: Nonexistent observer.');
           }

           this.observers.splice(observerIndex, 1);
           console.log('Subject: Detached an observer.');
       }

       /**
        * Trigger an update in each subscriber.
        */
       public notify(): void {
           console.log('Subject: Notifying observers...');
           for (const observer of this.observers) {
               observer.update(this);
           }
       }

       /**
        * Usually, the subscription logic is only a fraction of what a Subject can
        * really do. Subjects commonly hold some important business logic, that
        * triggers a notification method whenever something important is about to
        * happen (or after it).
        */
       public someBusinessLogic(): void {
           console.log('\nSubject: I\'m doing something important.');
           this.state = Math.floor(Math.random() * (10 + 1));

           console.log(`Subject: My state has just changed to: ${this.state}`);
           this.notify();
       }
   }

   /**
    * The Observer interface declares the update method, used by subjects.
    */
   interface Observer {
       // Receive update from subject.
       update(subject: Subject): void;
   }

   /**
    * Concrete Observers react to the updates issued by the Subject they had been
    * attached to.
    */
   class ConcreteObserverA implements Observer {
       public update(subject: Subject): void {
           if (subject instanceof ConcreteSubject && subject.state < 3) {
               console.log('ConcreteObserverA: Reacted to the event.');
           }
       }
   }

   class ConcreteObserverB implements Observer {
       public update(subject: Subject): void {
           if (subject instanceof ConcreteSubject && (subject.state === 0 || subject.state >= 2)) {
               console.log('ConcreteObserverB: Reacted to the event.');
           }
       }
   }

   /**
    * The client code.
    */

   const subject = new ConcreteSubject();

   const observer1 = new ConcreteObserverA();
   subject.attach(observer1);

   const observer2 = new ConcreteObserverB();
   subject.attach(observer2);

   subject.someBusinessLogic();
   subject.someBusinessLogic();

   subject.detach(observer2);

   subject.someBusinessLogic();
   ```
