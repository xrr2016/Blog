---
title: 如何使用 Gitlib 持续发布 Flutter 应用
categories:
  - 技术
tags:
  - Flutter
  - Gitlib
date: 2020-02-27 11:01:00
---

![action](./images/samuel-chenard.jpg)

本文介绍如何使用 Gitlib CI/CD 构建发布 Flutter 应用

<!--more-->

## 前言

[前一篇文章](https://coldstone.fun/post/2020/02/26/flutter-github-actions/)介绍了使用 Github Actions 持续发布 Flutter 应用，本文分享下如何使用 Gitlib 的 CI/CD 功能同样实现发布 Flutter 应用，因为有很多公司是用自己搭建的 Gitlab 来管理代码的。

要使用 Gitlib 的 CI/CD 功能首先需要在项目根目录创建一个 yml 格式的配置文件 `.gitlab-ci.yml`，这个配置文件会定义一个流水线 Pipeline。一个 Pipeline 由多个任务 Job 组成，任务就是具体要做的事情，如代码编译或测试； Pipeline 里的 stages 决定了任务何时以及如何运行。以下就是一个 Pipeline 有 3 个 stage，依次执行 build，test 和 deploy 任务。

```yml
stages:
  - build
  - test
  - deploy

job01:
  stage: build
  script: echo 'build job'
job02:
  stage: build
  script: echo 'test job'
job03:
  stage: deploy
  script: echo 'deploy job'
```

## 配置

要在 Pipeline 里构建打包 Flutter 应用的 apk，首先需要在流水线里配置 Android 以及 Flutter 环境，搜索一番后发现了一个 Github 上的 Flutter 镜像 [docker-images-flutter](https://github.com/cirruslabs/docker-images-flutter) 很适合，看这个镜像的 [Dockerfile](https://github.com/cirruslabs/docker-images-flutter/blob/master/sdk/Dockerfile) 可以发现它是从 `cirrusci/android-sdk:29` 这个 Android sdk 镜像开始，然后下载 Flutter SDK，这样就有了了 Android 和 Flutter 环境，接下来只需要运行测试和打包命令即可

```yaml
stages:
  - build
  - release

// build 阶段使用拥有 Android 以及 Flutter 环境的镜像，进行测试打包
build:
  stage: build
  image: cirrusci/flutter:stable
  only:
    - tags
  script:
    // 下载依赖包
    - flutter packages get
    // 执行测试
    - flutter test
    // 打包 apk
    - flutter build apk --release
  // 这里定义任务生成的文件
  artifacts:
    expire_in: 1 hour
    paths:
      - build/app/outputs/apk/release/*.apk
  interruptible: true
```

## 发布

要发布 apk 文件到仓库的 release 还需要使用 [gitlab-release](https://github.com/inetprocess/gitlab-release) 这个镜像进行发布操作

```yml
stages:
  - build
  - release

// build 阶段使用拥有 Android 以及 Flutter 环境的镜像，进行测试打包
build:
  stage: build
  image: cirrusci/flutter:stable
  only:
    - tags
  script:
    - flutter packages get
    - flutter test
    - flutter build apk --release
  artifacts:
    expire_in: 1 hour
    paths:
      - build/app/outputs/apk/release/*.apk
  interruptible: true

// 发布到仓库的 release
release:
  image: inetprocess/gitlab-release
  stage: release
  only:
    - tags
  dependencies:
    - build
  script:
    // 使用打包好的 apk 文件路径
    - gitlab-release --message '自动发布' build/app/outputs/apk/release/*.apk

```

发布还需要一个 `Personal Access Token` 给 release 任务提供 api 权限，有了 api 权限就可以请求 Gitlab 的 release 接口上传 apk 了

![token](./images/gitlib-token.jpg)

使用刚才创建的 token 在项目仓库里配置流水线的环境变量 `GITLAB_ACCESS_TOKEN`

![var](./images/gitlab-variable.jpg)

最后创建一个版本标签推送到 Gitlab 仓库，就可以看到运行中的流水线了

```sh
git tag v1.0.0

git push --tag
```

![var](./images/gitlib-pineline.jpg)

流水线运行完毕，一个版本发布成功。

![var](./images/gitlib-release.jpg)

## 上传

[蒲公英](https://www.pgyer.com/) 平台可以对应用进行内测分发，使用蒲公英提供的上传应用包的接口，将 `CI/CD` 构建出来的应用 `apk` 直接上传，免去手动去网页上上传的麻烦

添加一个 `upload` 任务，依赖于 `build` 任务，向蒲公英的上传接口发送一个请求，`$APK_PATH` 是应用打包出来的路径，定义为一个变量方便使用;

```yml
stages:
  - build
  - release
  - upload
......
upload:
  stage: upload
  only:
    - tags
  dependencies:
    - build
  script:
    - curl -S "http://www.pgyer.com/apiv2/app/upload" -F "file=@$APK_PATH" -F "_api_key=$PGY_API_KEY"
    - echo uploaded
```

`$PGY_API_KEY` 是蒲公英平台的 `API Key`，需要添加到 `CI/CD` 的环境变量中

![api-key](./images/pgy-api-key.png)

在仓库的设置那里添加新的环境变量

![variable](./images/gitlab-pgy-variable.png)



## 总结

1. 添加流水线配置 `.gitlab-ci.yml`
2. 创建 `Personal Access Token`
3. 设置环境变量 `GITLAB_ACCESS_TOKEN`
4. 推送版本标签

## 参考

[Gitlab Release](https://github.com/inetprocess/gitlab-release)

[Getting started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/README.html)

[使用 Travis CI 实现持续集成 (Android)](https://www.pgyer.com/doc/view/travis_android)

