---
title: 关于 Flutter 的安卓打包
date: 2019-08-14 09:56:55
tags:
  - Flutter
categories:
  - 技术
cover: https://cdn.pixabay.com/photo/2021/04/07/17/13/sea-6159674_960_720.jpg
---

Flutter 在打包安卓应用时有两种方式 `flutter build apk` 和 `flutter build appbundle`，本文说下这两种方式有什么区别

<!--more-->

## 前言

Flutter 在打包安卓应用时有两种方式 `flutter build apk` 和 `flutter build appbundle`，本文说下这两种方式有什么区别。

## Appbundle

Android App Bundle 是上传到 Google Play 用以支持 Dynamic Delivery 的文件，扩展名为 .aab，一个 bundle 包含所有应用的已编译代码和资源，但是还没有生成 apk 和 Google Play 的签名。

Google Play 的新应用服务模式称为 Dynamic Delivery（动态传送），使用你的应用包为每个用户的设备配置生成并提供优化的 APK，因此用户只下载运行应用所需的代码和资源。开发者不再需要构建，签名和管理多个 APK 来支持不同的设备，用户可以获得更小，更优化的下载。

[官方文档](https://developer.android.com/guide/app-bundle)

## Apk

如果应用不发布到 Google Play，则需要发布多个 apk，但必须自己构建，签名和管理每个 apk。

通常构建一个 apk 用以支持所有目标设备，但由于需要支持多个屏幕密度或应用程序二进制接口（ABI）的文件，这可能会导致非常大的 apk，减少 apk 大小的一种方法是创建多个 apk，在执行 `flutter build apk` 的时候可以添加构建参数 `--target-platform android-arm,android-arm64 --split-per-abi`， 这样构建出来的 apk 包含特定屏幕密度或 ABI 的文件。

[官方文档](https://developer.android.com/studio/build/configure-apk-splits)
