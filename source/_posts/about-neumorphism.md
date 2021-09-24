---
title: 关于新拟物设计 Neumorphism
categories:
  - 技术
  - 设计
tags:
  - Flutter
date: 2021-09-23 20:30:19
cover: ./images/about-neumorphism/cover.jpg
---

前段时间发现了一种叫新拟物的 UI 设计 Neumorphism，感觉很新鲜。于是研究的一番，本文将分享新拟物设计的相关知识。

<!--more-->

## 前言

前段时间发现了一种叫新拟物的 UI 设计 Neumorphism，感觉很新鲜。于是研究的一番，本文将分享新拟物设计的相关知识。

## 新拟物设计是什么

新拟物的前身是 Skeuomorphism（拟物设计），或叫拟物化，即在界面中模仿现实物纹理材质的设计，让人们在使用界面时联想到现实物体的使用方式，由 Apple 公司最先提出。新拟物设计是拟物设计的一种新的思路，它的关注点不在于对现实世界和数字世界的对比和模拟，而关键点在于色调，新拟物设计关注于整个屏幕的颜色，并为用户提供一个完全独特的体验。

![demo2.jpg](https://cdn.nlark.com/yuque/0/2021/jpeg/224563/1632382960768-60883e1d-baf9-4b1d-8399-692ff97e0160.jpeg#clientId=u1367e7e7-fd10-4&from=drop&height=576&id=u91b021b0&margin=%5Bobject%20Object%5D&name=demo2.jpg&originHeight=768&originWidth=1024&originalType=binary&ratio=1&size=24984&status=done&style=none&taskId=u448e82e3-db87-4c4d-a7fd-4072e61fdf2&width=768)


比如你有一个音乐播放器界面，使用新拟物设计，这个界面的 UI 元素不是放置在背景之上而是在它后面。它给人的感觉是，像按钮或卡片这样的组件实际上是在背景里面的，只是因为它们是从里面突出来的，所以才可以看到。

![uisdc-nw-20200630-8.jpeg](https://cdn.nlark.com/yuque/0/2021/jpeg/224563/1632388644117-04d5f235-305b-4d72-bab6-49035aff4ffd.jpeg#clientId=u1367e7e7-fd10-4&from=drop&height=355&id=ub948e55c&margin=%5Bobject%20Object%5D&name=uisdc-nw-20200630-8.jpeg&originHeight=473&originWidth=1080&originalType=binary&ratio=1&size=21040&status=done&style=none&taskId=u76805d77-8cad-4d4a-b68e-93330f2959b&width=810)

新拟物设计风格的结构由背景色+高光色+阴影色组成，掌握了基本规律，就可以通过改变按钮、卡片的参数进行调整变换。总体来说就是纯色、低对比度以及适当的阴影效果，风格偏柔和。

## 新拟物设计的对比

新拟物设计是一种介于拟物与扁平之间的风格，简化了拟物设计中不必要的效果。

![neumorphism-skeuomorphism-flat-compared.png.webp](https://cdn.nlark.com/yuque/0/2021/webp/224563/1632399579940-c7675001-8a98-4780-bf52-ffc42e7bec36.webp#clientId=u1367e7e7-fd10-4&from=drop&id=uac60eaac&margin=%5Bobject%20Object%5D&name=neumorphism-skeuomorphism-flat-compared.png.webp&originHeight=540&originWidth=750&originalType=binary&ratio=1&size=15784&status=done&style=none&taskId=u88c7f09f-3c5d-4319-93f5-c8b703862a7)

## 谁在使用新拟物设计

几个使用了新拟物设计的应用

### 谜底时钟

<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632385174572-06b0d5de-34f2-4060-aa6f-da1146305295.png#clientId=u1367e7e7-fd10-4&from=drop&height=448&id=ua27c5db6&margin=%5Bobject%20Object%5D&name=sz1.PNG&originHeight=1792&originWidth=828&originalType=binary&ratio=1&size=592151&status=done&style=none&taskId=u424bbb22-660a-451a-8609-6591f960ae1&width=207" width="207" alt="sz1" style="display: inline;" />
<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632385174740-b0e616bc-0b44-47e0-8150-eeb3eaeda95a.png#clientId=u1367e7e7-fd10-4&from=drop&height=448&id=uaca893b8&margin=%5Bobject%20Object%5D&name=sz2.PNG&originHeight=1792&originWidth=828&originalType=binary&ratio=1&size=617381&status=done&style=none&taskId=u744b5a24-26c7-4520-b44a-89699644b5f&width=207" width="207" alt="sz2" style="display: inline;" />
<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632385175228-edf5a9b0-b1d3-4aec-8a00-ac2f819d607c.png#clientId=u1367e7e7-fd10-4&from=drop&height=448&id=ub41efc40&margin=%5Bobject%20Object%5D&name=sz3.PNG&originHeight=1792&originWidth=828&originalType=binary&ratio=1&size=753103&status=done&style=none&taskId=ue934bac5-0315-452a-8351-cdef86b52d0&width=207" width="207" alt="sz3" style="display: inline;"  />

### 氢时钟

<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632385427631-e4ad535e-6c91-418e-a0de-3b4c80c64f01.png#clientId=u1367e7e7-fd10-4&from=drop&height=448&id=u92f0b98c&margin=%5Bobject%20Object%5D&name=qsz2.PNG&originHeight=1792&originWidth=828&originalType=binary&ratio=1&size=200280&status=done&style=none&taskId=uadeaad65-d0d8-4a86-b985-2016c3c2bfd&width=207" width="207" alt="qsz2" style="display: inline;"  />
<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632385428125-35445106-6432-4c6f-9daa-41b6b2d94c88.png#clientId=u1367e7e7-fd10-4&from=drop&height=448&id=udd5347fc&margin=%5Bobject%20Object%5D&name=qsz1.PNG&originHeight=1792&originWidth=828&originalType=binary&ratio=1&size=362349&status=done&style=none&taskId=u1ff2c507-b4a7-4d74-b403-6865146ef6b&width=207" width="207" alt="qsz2" style="display: inline;" />
<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632385427974-46531ea0-fac9-4c12-8eaa-e3c5f390802d.png#clientId=u1367e7e7-fd10-4&from=drop&height=448&id=u1eede575&margin=%5Bobject%20Object%5D&name=qsz3.PNG&originHeight=1792&originWidth=828&originalType=binary&ratio=1&size=278593&status=done&style=none&taskId=ucf3c2510-3113-4d5e-b549-d42f76fc112&width=207" width="207" alt="qsz2" style="display: inline;"  />

### Skailer

![GitHubPreview.png](https://cdn.nlark.com/yuque/0/2021/png/224563/1632386230218-c6af1253-29da-4fa5-9dab-0294a793c5da.png#clientId=u1367e7e7-fd10-4&from=drop&height=480&id=u23661ea3&margin=%5Bobject%20Object%5D&name=GitHubPreview.png&originHeight=640&originWidth=1280&originalType=binary&ratio=1&size=271916&status=done&style=none&taskId=u5ae4011c-97ef-45ff-9490-8bf34c71396&width=960)

<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632386236813-a2266689-7519-411f-bcb1-b2ac64f39094.png#clientId=u1367e7e7-fd10-4&from=drop&height=368&id=ue22be91a&margin=%5Bobject%20Object%5D&name=home-dark.png&originHeight=1471&originWidth=728&originalType=binary&ratio=1&size=654058&status=done&style=none&taskId=u53575269-775b-4772-af60-c9805c661c7&width=280" width="280" alt="home-dark" style="display: inline;"  />
<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632386402468-ca59fff3-8281-44e6-95d0-c8107d70a162.png#clientId=u1367e7e7-fd10-4&from=drop&height=368&id=u34eb43a2&margin=%5Bobject%20Object%5D&name=player-dark.png&originHeight=1471&originWidth=728&originalType=binary&ratio=1&size=413125&status=done&style=none&taskId=uee5a8ab6-33d2-4c64-b48b-3ebda28a521&width=280" width="280" alt="player-dark" style="display: inline;"  />

<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632386243666-265748d2-dced-45d3-b717-8755406fd7eb.png#clientId=u1367e7e7-fd10-4&from=drop&height=368&id=ue77170b3&margin=%5Bobject%20Object%5D&name=player-light.png&originHeight=1471&originWidth=728&originalType=binary&ratio=1&size=416886&status=done&style=none&taskId=ucfefa3fe-03cf-4be8-ace6-e8bdaf80e35&width=280" width="280" alt="player-light" style="display: inline;"  />
<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632386367876-94a5ad15-e83d-4202-99fb-b0707f650ed5.png#clientId=u1367e7e7-fd10-4&from=drop&height=368&id=u025b79d4&margin=%5Bobject%20Object%5D&name=home-light.png&originHeight=1471&originWidth=728&originalType=binary&ratio=1&size=624767&status=done&style=none&taskId=ub8e92b29-85d8-482a-ab93-1de212bd7e0&width=280" width="280" alt="home-light" style="display: inline;"  />

### 分贝大师

<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632392472721-5509c234-a267-4803-b4b2-618b4dd4427a.png#clientId=u1367e7e7-fd10-4&from=drop&height=448&id=u45f40f01&margin=%5Bobject%20Object%5D&name=fb1.PNG&originHeight=1792&originWidth=828&originalType=binary&ratio=1&size=1579559&status=done&style=none&taskId=uc64fcc11-5489-425c-a17c-4dd1d31769e&width=280" width="280" alt="fb1" style="display: inline;"  />
<img src="https://cdn.nlark.com/yuque/0/2021/png/224563/1632392471542-c71816ae-f2c6-416f-afdd-6afd05bc53ad.png#clientId=u1367e7e7-fd10-4&from=drop&height=448&id=u3f2cb4e3&margin=%5Bobject%20Object%5D&name=fb2.PNG&originHeight=1792&originWidth=828&originalType=binary&ratio=1&size=1100292&status=done&style=none&taskId=u8bf60d82-b3ba-4e16-bf6b-a9bac5c4bcb&width=280" width="280" alt="fb2" style="display: inline;"  />

## 新拟物设计的实现原理

新拟物设计通过应用两种不同的阴影实现，一个高亮色，一个阴影色，元素的背景颜色不能是全黑或全白，需要使用一种中间色调，这样可以使阴影效果显示出来。

![6c9cb8deabc71b3bb158f6ab7ca653ff.webp](https://cdn.nlark.com/yuque/0/2021/webp/224563/1632388456859-a92a1671-7078-491d-848a-6dc90cd4b904.webp#clientId=u1367e7e7-fd10-4&from=drop&height=600&id=ue1a03760&margin=%5Bobject%20Object%5D&name=6c9cb8deabc71b3bb158f6ab7ca653ff.webp&originHeight=1200&originWidth=1600&originalType=binary&ratio=1&size=106980&status=done&style=none&taskId=u2eb6c82e-d90d-4ad7-b45a-dea8aa4925b&width=800)
![f9f1ad497f9778d196bae05e8122efb7.webp](https://cdn.nlark.com/yuque/0/2021/webp/224563/1632388464181-5cc9a4b4-1bdb-4add-b78a-df6f632665c7.webp#clientId=u1367e7e7-fd10-4&from=drop&height=600&id=u7d653031&margin=%5Bobject%20Object%5D&name=f9f1ad497f9778d196bae05e8122efb7.webp&originHeight=1200&originWidth=1600&originalType=binary&ratio=1&size=119266&status=done&style=none&taskId=u0605aa3d-120a-4fda-aa0b-d90dcb8ef15&width=800)
![neumorphic-cards.png.jpg](https://cdn.nlark.com/yuque/0/2021/jpeg/224563/1632297595384-901c5b03-0989-41c4-bbd0-ca86b69e4e29.jpeg#clientId=ucfb7b09a-b6b6-4&from=drop&id=u307e838c&margin=%5Bobject%20Object%5D&name=neumorphic-cards.png.jpg&originHeight=550&originWidth=750&originalType=binary&ratio=1&size=9135&status=done&style=stroke&taskId=u1f11aa03-5f63-4a9b-9e2d-bb9d3eb2b4b)

## 使用 Flutter 实现新拟物设计

对于开发来说，要实现这种效果，就是使用两层阴影，一层高亮阴影，一层暗色阴影，以及设置元素的背景颜色。凸的时候高亮影在左上，暗色在右下，凹时反过来。以下介绍如何使用 Flutter 框架实现这种效果，Web 端使用相同的原理实现。

1. 首先添加一个容器，用来放置具体的元素，设置背景颜色

```css
Container(
  width: 600.0,
  height: 600.0,
  color: Color(0xffefeeee),
)
```
​
2. 添加子元素，设置它的背景颜色以及阴影色和高亮色

```css
child: Container(
  width: 200,
  height: 200,
  decoration: BoxDecoration(
    // 背景色
    color: Color(0xffefeeee),
    borderRadius: BorderRadius.circular(12.0),
		boxShadow: const [
      // 高亮色
			BoxShadow(
				color: Colors.white.withOpacity(.5),
				offset: Offset(10.0, 10.0),
				blurRadius: 4.0,
			),
      // 阴影色
			BoxShadow(
				color: Color(0xffd1cdc7).withOpacity(.5),
				offset: Offset(-10.0, -10.0),
				blurRadius: 4.0,
			),
		],
	),
)
```

3. 给子元素添加圆角和边框配置

```css
decoration: BoxDecoration(
  // ...
  borderRadius: BorderRadius.circular(12.0),
  border: Border.all(
    color: Colors.white.withOpacity(.2),
  ),
  // ...
)
```

最终效果

![Xnip2021-09-23_17-24-55.jpg](https://cdn.nlark.com/yuque/0/2021/jpeg/224563/1632389119671-3ae397cb-0ff1-4c0c-8fc2-b8cfce12e90c.jpeg#clientId=u1367e7e7-fd10-4&from=drop&id=ue971c282&margin=%5Bobject%20Object%5D&name=Xnip2021-09-23_17-24-55.jpg&originHeight=500&originWidth=800&originalType=binary&ratio=1&size=19917&status=done&style=none&taskId=u61bd0d22-f78d-4f6d-8878-638e4a56afd)

这里可以使用一个便捷工具生成代码，以产生不同的效果

[https://neumorphism.coldstone.fun](https://neumorphism.coldstone.fun)

对于 Web 可以使用另一个工具

[https://neumorphism.io](https://neumorphism.io)
​
## 优点与缺点

主要优点在于这种效果给予用户带来的新鲜感，同时它可以与其他风格混合使用。

它的缺点在于

1. 层次结构弱

界面上缺少信息层级关系，会对用户的决策过程及思考过程产生重大影响。如存在多个可操作的内容，但是重点不突出，这会让用户在当前的流程上产生困惑，从而可能导致错误的判断和误操作，好的 UI/UX 不需要让用户思考。

2. 对比度低，可辨识性较差

新拟物仅通过柔和的阴影来区分元素，缺少对比度，因此对视力低下、失明、色盲的用户来说，可辨识性较差，不太友好。

3. 增加开发难度

这个风格的实现是对元素增加两个不同方向的投影，通过代码可以实现，但是需要对每个元素添加投影，加大工作量。

## 总结

新拟物设计诞生于拟物设计，它只是一种设计风格，使用场景受限，现实设计中还需要谨慎使用，可以逐渐的应用在细小的元素上。但是任然值得去尝试。

## 参考

[Neumorphism in user interfaces](https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6)
[Neumorphism: why it’s all the hype in UI design](https://www.justinmind.com/blog/neumorphism-ui/)
[Neumorphism in Flutter](https://tonyowen.medium.com/neumorphism-in-flutter-f46fe25bf9d4)​
[新拟物风格，UI设计的新趋势还是昙花一现？](https://www.zcool.com.cn/article/ZMTEwNzMwMA==.html)
[完整梳理！上半年最热门的新拟物设计趋势是如何演变的？](https://www.uisdc.com/neumorphism-design-trends)​
