---
title: 使用 Codemagic 持续部署 Flutter 应用
categories:
  - 技术
tags:
  - Flutter
  - Codemagic
  - Google Play
date: 2020-02-03 22:36:16
cover: ./images/flutter-cicd/cicd.png
---

Codemagic 持续部署 Flutter 应用

<!--more-->

## 前言

持续集成和持续部署能够自动化应用开发的测试，构建和部署过程，如果在应用开发初期解决了这个问题无疑提升应用的开发，交付效率。

## 什么是 `Codemagic`

[Codemagic](https://codemagic.io) 是一个为 `Flutter` 项目以及其它移动端项目提供 CI/CD 服务的平台。

可以使用 Github 账号注册登录，登录后它会要求获得你仓库的读/写权限，然后在 [apps](https://codemagic.io/apps) 页面显示你需要进行构建的项目。

![code-apps](./images/code-apps.jpg)

## 为什么使用 `Codemagic`

好的 `CI/CD` 有助于更快地构建，测试以及部署发布应用。在 `Flutter` 的官方文档 [Flutter 里的持续部署](https://flutter.cn/docs/deployment/cd) 里介绍了使用 `fastlane` 工具进行本地部署以及如何将 `fastlane` 整合到 `Travis`，`Cirrus`，`Bitrise` 等持续交付的服务中，但是对于 `Flutter` 项目来说最方便的 `CI/CD` 服务应该还是 `Codemagic`，它可以直接在网页上就配置出完整的应用交付流程。

## 如何使用

选择需要构建的 `Fluter` 项目，点击 `Start your first build` 按钮，创建一个工作流程 `Workflow`。
一个 `Workflow` 指的是每次构建要做的任务，如执行构建，测试以及发布任务。

对于 `Flutter` 项目可以在网页上配置或使用 `codemagic.yaml` 配置文件，其它项目只能使用 `codemagic.yaml` 配置。

![workflow](./images/workflow.jpg)

一个 `Workflow` 由以下几个部分组成

1. `Build triggers` --> 指定的构建分支和触发构建的时机

![build-triggers](./images/build-triggers.jpg)

2. `Environment variables` --> 设置构建时的环境变量

![env_vars](https://docs.codemagic.io/uploads/env_vars.PNG)

3. `Dependency caching` --> 设置构建时的依赖缓存文件目录，加快构建速度

![caching](https://docs.codemagic.io/uploads/2019/04/caching_enabled.PNG)

4. `Test` --> 执行应用的单元，集成和部件测试，以及静态代码分析

![code-test](./images/code-test.jpg)

5. `Build` --> 配置应用构建时的 Flutter 版本，构建目标，构建参数

![code-build](./images/code-build.jpg)

6. `Publish` --> 选择需要发布应用的目标，这里我选择了 `Google play`

![code-publish](./images/code-publish.jpg)

## 代码签名

要将应用发布到 `Apple store` 或者 `Goople play` 上就必须对你的应用进行代码签名，代码签名目的是为了识别谁开发了该应用程序，并确保该应用程序的所有更新均来自这个人。

对于 Android 来说有两种签名：发布签名和上传签名。最终用户下载的 `.aab/.apk` 文件使用发布签名。上传签名提供给开发者上传到 `Google Play` 商店的认证。上传后，`Google Play` 会重新使用发布签名对 `.aab/.apk` 文件签名。

在配置 `Workflow` 时，我选择发布到 `Goople play` 所以需要对 Android 应用进行代码签名，有以下两种方式进行签名，选择其一即可。

1. 使用 `Android Studio` [为您的应用签名](https://developer.android.google.cn/studio/publish/app-signing#sign-apk)
2. 使用命令行工具进行签名 [为 app 签名](https://flutter.cn/docs/deployment/android#signing-the-app)

签名后需要做的是把签名信息存到工作流程 `Workflow` 内，[Android code signing](https://docs.codemagic.io/code-signing/android-code-signing/)。

## 创建 `Service Account`

`Service Account` 是给 `CI/CD` 平台发布构建后应用用的，根据指引创建 [Setting up a service account in Google Play Console](https://docs.codemagic.io/publishing/publishing-to-google-play/#setting-up-a-service-account-in-google-play-console)，创建后需做的上传你的凭证 JSON 文件

![code-google-play](./images/code-google-play.jpg)

## 注意

1. 在使用 `CI/CD` 服务前首先要人工的上传应用到 `Google Play` 一次。
2. 每次上传到 `Google Play` 的应用构建版本不能重复，否则会遇到这样一个问题

```sh
Google Play responded with: APK specifies a version code that has already been used.
```

搜索一番后发现问题是应用构建的版本号重复，需要更新 `pubspec.yaml` 文件的 `version` 字段的值，详细说明可以查阅这篇文章 [更新应用版本号](https://flutter.cn/docs/deployment/android#updating-the-apps-version-number)

3. 上传 `Google Play` 需要添加一个环境变量 `FCI_KEYSTORE_FILE`，这个变量需要用 base64 encode 一下，需要用到的命令是

```sh
base64 input-file-path -o output.txt
```

## 总结

使用 `Codemagic` 发布 Flutter 应用的流程大致如下

1. 选择构建项目
2. 配置构建流程
3. 进行代码签名
4. 创建 Service Account
5. 触发构建

## 参考

[封面图片地址](https://blog.codemagic.io/getting-started-with-codemagic/)

[Flutter 里的持续部署](https://flutter.cn/docs/deployment/cd)

[Codemagic Documentation](https://docs.codemagic.io/)
