---
title: 对于 Workbox Strategies几种策略的解释
tags:
  - Workbox
categories:
  - 技术
date: 2019-07-27T12:36:13+08:00
cover: https://cdn.pixabay.com/photo/2021/05/13/15/20/plum-blossom-6251131_960_720.jpg
---

要将自己的网站支持 PWA，需要注册一个 serviceWorker 到浏览器中，通常使用 Google 的 Workbox 工具，Workbox 可以在浏览器请求资源的时候提供了几种不同的策略对请求响应，本文对几种策略进行说明

<!--more-->

要将自己的网站支持 PWA，需要注册一个 serviceWorker 到浏览器中，通常使用 Google 的 [Workbox](https://developers.google.com/web/tools/workbox/) 工具，Workbox 可以在浏览器请求资源的时候提供了几种不同的策略对请求响应，本文对几种策略进行说明。

## StaleWhileRevalidate

StaleWhileRevalidate 模式允许您使用缓存的响应尽快响应请求，如果未缓存，则返回到网络请求，然后，用网络请求更新缓存。

![StaleWhileRevalidate](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/stale-while-revalidate.png)

```js
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static'
  })
)
```

## CacheFirst

如果缓存中存在响应，则将使用缓存的响应来完成请求，并且根本不会使用网络。 如果没有缓存的响应，则将通过网络请求来满足请求，并且将缓存响应，以便直接从缓存提供下一个请求。

![CacheFirst](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/cache-first.png)

```js
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'static'
  })
)
```

## NetworkFirst

对于频繁更新的请求，网络优先策略是理想的解决方案。 默认情况下，它将尝试从网络获取最新响应，如果请求成功，它会将响应放入缓存中。 如果网络无法返回响应，则将使用缓存的响应。

![NetworkFirst](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/network-first.png)

```js
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'static'
  })
)
```

## NetworkOnly

仅使用网络响应请求。

![NetworkOnly](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/network-only.png)

```js
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.NetworkOnly({
    cacheName: 'static'
  })
)
```

## CacheOnly

仅使用缓存响应请求。不常见，但如果您有自己的预先缓存步骤，则可能很有用。

![CacheOnly](https://developers.google.com/web/tools/workbox/images/modules/workbox-strategies/cache-only.png)

```js
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.CacheOnly({
    cacheName: 'static'
  })
)
```

## 参考

[官方文档](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)
