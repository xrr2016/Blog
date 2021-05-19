---
title: 关于应用的 Code Signing
tags:
  - Andorid
  - iOS
date: '2019-07-15T20:54:56+08:00'
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2020/04/03/07/26/eye-4997724_960_720.png
---

Flutter 项目代码签名

<!--more-->

## 代码签名

要将应用发布到 `Apple store` 或者 `Goople play` 上就必须对你的应用进行代码签名，代码签名目的是为了识别谁开发了该应用程序，并确保该应用程序的所有更新均来自这个人。

## Andorid

对于 Android 来说有两种签名：发布签名和上传签名。最终用户下载的 `.aab/.apk` 文件使用发布签名。上传签名提供给开发者上传到 `Google Play` 商店的认证。上传后，`Google Play` 会重新使用发布签名对 `.aab/.apk` 文件签名。

1. 使用 `Android Studio` [为您的应用签名](https://developer.android.google.cn/studio/publish/app-signing#sign-apk)
2. 使用命令行工具进行签名 [为 app 签名](https://flutter.cn/docs/deployment/android#signing-the-app)

## iOS

1. 在 [Apple Developer Account console](https://developer.apple.com/account/ios/certificate/) 创建并下载一个分发证书。
2. 打开 `ios/Runner.xcworkspace` 在你的项目设置里选择一个分发证书。

[官方文档](https://developer.apple.com/support/code-signing/)
