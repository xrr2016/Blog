---
title: 对于 PWA 应用的 manifest.json 文件的解释
tags:
  - PWA
date: 2019-07-25T13:31:51+08:00
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/05/15/04/49/lake-6254899_960_720.jpg
---

网站要支持 PWA，需要一个 `manifest.json` 文件，W3C Web App Manifest 的草案上定义了以下的字段，解释一下每个字段是什么意思。

<!--more-->

网站要支持 PWA，需要一个 `manifest.json` 文件，W3C Web App Manifest 的草案上定义了以下的字段，解释一下每个字段是什么意思。

```js
dictionary WebAppManifest {
   TextDirectionType dir = "auto";
   DOMString lang;
   USVString name;
   USVString short_name;
   USVString description;
   sequence<ImageResource> icons;
   sequence<ImageResource> screenshots;
   sequence<USVString> categories;
   DOMString iarc_rating_id;
   USVString start_url;
   DisplayModeType display = "browser";
   OrientationLockType orientation;
   USVString theme_color;
   USVString background_color;
   USVString scope;
   ServiceWorkerRegistrationObject serviceworker;
   sequence<ExternalApplicationResource> related_applications;
   boolean prefer_related_applications = "false";
};

dictionary ImageResource {
  required USVString src;
  DOMString sizes;
  USVString type;
  USVString purpose;
  USVString platform;
};

dictionary ServiceWorkerRegistrationObject {
  required USVString src;
  USVString scope;
  WorkerType type = "classic";
  ServiceWorkerUpdateViaCache update_via_cache = "imports";
};

dictionary ExternalApplicationResource {
  required USVString platform;
  USVString url;
  DOMString id;
  USVString min_version;
  sequence<Fingerprint> fingerprints;
};
```

**dir** 指定了 manifest 中具有方向性的成员的基本方向，可以设置 `ltr` 左至右, `rtl` 右至左, `auto` 没有明确方向。

**lang** 指定 manifest 中具有方向性成员的值的主要语言（因为知道语言也可以帮助方向性）。

**name** 表示应用的名称。

**short_name** 表示 Web 应用程序名称的简短版本，用于没有足够空间来显示 Web 应用程序的全名的地方。

**description** 描述 Web 应用程序的目的。

**scope** 表示 Web 应用程序导航范围。

**icons** icons 是 ImageResources 的数组，可以在各种情况下充当 Web 应用程序的图标表示。例如，它们可用于在其他应用程序列表中表示 Web 应用程序，或者将 Web 应用程序与 OS 的任务切换器和/或系统首选项集成。

```json
{
  "icons": [
    {
      "src": "icon/lowres.webp",
      "sizes": "48x48",
      "type": "image/webp"
    },
    {
      "src": "icon/lowres",
      "sizes": "48x48"
    },
    {
      "src": "icon/hd_hi.ico",
      "sizes": "72x72 96x96 128x128 256x256"
    },
    {
      "src": "icon/hd_hi.svg",
      "sizes": "257x257"
    }
  ]
}
```

**display** 其值是 DisplayModeType 值之一，表示开发人员对 Web 应用程序的首选显示模式。可以设置

- "fullscreen" 占用整个可用的显示区域；
- "standalone" 使其外观和感觉就像一个独立的本机应用程序；
- "minimal-ui" 类似于 standalone 模式，但为最终用户提供了一些方法来访问用于控制导航的最小 UI 元素集（即，后退，前进，重新加载以及可能以某种方式查看文档的地址）；
- "browser" 使用特定于平台的约定打开 Web 应用程序，以在用户代理中打开超链接（例如，在浏览器选项卡或新窗口中）；

**orientation** Web 应用程序的所有顶级浏览上下文的默认方向。

**start_url** 表示起始 URL 的字符串，该 URL 是用户启动 Web 应用程序时开发人员更喜欢用户代理加载的 URL（例如，当用户从设备的应用程序菜单中单击 Web 应用程序的图标时或主屏幕）。

**serviceworker** 表示应用中 serviceWorker 的信息。

```json
"serviceworker": {
  "src": "sw.js",
  "scope": "/foo",
  "update_via_cache": "none"
}
```

**theme_color** 应用程序上下文的默认主题颜色。

**related_applications** 是底层应用程序平台可访问的应用程序。

**prefer_related_applications** 表示相关应用程序是否应优先于当前的 Web 应用程序。

**background_color** Web 应用程序的预期背景颜色。

**categories** Web 应用程序所属的预期应用程序类别。

**screenshots** 一个 ImageResources 数组，表示常见使用场景中的 Web 应用程序的截图。

**iarc_rating_id** 用于确定 Web 应用程序适合的年龄。

一个完整的示例

```json
{
  "lang": "en",
  "dir": "ltr",
  "name": "Super Racer 3000",
  "description": "The ultimate futuristic racing game from the future!",
  "short_name": "Racer3K",
  "icons": [
    {
      "src": "icon/lowres.webp",
      "sizes": "64x64",
      "type": "image/webp"
    },
    {
      "src": "icon/lowres.png",
      "sizes": "64x64"
    },
    {
      "src": "icon/hd_hi",
      "sizes": "128x128"
    }
  ],
  "scope": "/racer/",
  "start_url": "/racer/start.html",
  "display": "fullscreen",
  "orientation": "landscape",
  "theme_color": "aliceblue",
  "background_color": "red",
  "serviceworker": {
    "src": "sw.js",
    "scope": "/racer/",
    "update_via_cache": "none"
  },
  "screenshots": [
    {
      "src": "screenshots/in-game-1x.jpg",
      "sizes": "640x480",
      "type": "image/jpeg"
    },
    {
      "src": "screenshots/in-game-2x.jpg",
      "sizes": "1280x920",
      "type": "image/jpeg"
    }
  ]
}
```

要在页面是使用的话直接用 <link> 标签引用即可。

```html
<link rel="manifest" href="/manifest.json" />
```

这样浏览器就可以安装你的 Web 应用了。
