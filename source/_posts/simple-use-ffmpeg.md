---
title: 使用 FFmpeg 转换视频格式
date: 2019-11-11 20:12:26
categories:
  - 技术
tags:
  - FFmpeg
cover: https://cdn.pixabay.com/photo/2021/02/21/14/37/little-bird-6036530_960_720.jpg
---

用 B 站下载助手 下载下来的视频格式是 `flv`，用 QuickTime 看不了也不能导入 iMovie 进行编辑，所以需要转换一下视频格式

<!--more-->

## 前言

用 B 站下载助手 下载下来的视频格式是 `flv`，用 QuickTime 看不了也不能导入 iMovie 进行编辑，所以需要转换一下视频格式。在搜索了很多视频格式转换工具后，发现它们大多底层是用 [FFmpeg](https://www.ffmpeg.org/) 这个开源工具进行转换的，所以为什么不直接用 `FFmpeg` 它本身呢。

## 关于 FFmpeg

官方描述：FFmpeg 是一种非常快速的视频和音频转换器，也可以从实时音频/视频源中获取。 它还可以在任意采样率之间转换，并使用高质量的多相滤波器即时调整视频大小。

转换流程

```pre
 _______              ______________
|       |            |              |
| input |  demuxer   | encoded data |   decoder
| file  | ---------> | packets      | -----+
|_______|            |______________|      |
                                           v
                                       _________
                                      |         |
                                      | decoded |
                                      | frames  |
                                      |_________|
 ________             ______________       |
|        |           |              |      |
| output | <-------- | encoded data | <----+
| file   |   muxer   | packets      |   encoder
|________|           |______________|
```

## 安装

首先安装 `FFmpeg`，macOS 可以使用 `homebrew` 安装

```sh
brew install ffmpeg
```

Windows 到 `https://ffmpeg.zeranoe.com/builds` 这里下载 zip 包，然后将 `bin` 目录添加到环境变量 `PATH` 中，在命令行中运行 `ffmpeg` 命令，出现提示语即表示安装成功

![hint](images/ffmpeg-hint.jpg)

## 使用

只需一条命令即可对视频进行格式转换，`-i` 参数表示需要转换的视频，值是视频路径，后面的是转换后的视频文件名。

```sh
ffmpeg -i input.mp4 output.avi
```

转换过程中会出现进度提示

![running](images/ffmpeg-running.jpg)

- `frame` 表示是转码所进行到的帧数。
- `fps` 表示中的 FPS 就是 Frame per Second ，是现在电脑每秒所处理的帧的数量，这个数字跟视频的帧率无关。
- `size` 表示已经转换出来的视频的体积。
- `time` 表示经转换出来的视频的时间。

## 转换参数

`-r`

这个选项设置视频帧率, 单位是 Hz，也就是帧每秒 FPS，如 `-r 30` 即代表输出视频的帧率为每秒 30 帧，降低帧率可以减小视频的体积。

```sh
ffmpeg -i input.mp4 -r 30 output.mp4
```

`-s`

默认输出的视频尺寸与原视频相同，`-s 720x480` 选项可以指定输出视频的尺寸，以像素为单位。

```sh
ffmpeg -i input.mp4 -s 720x480 output.mp4
```

`-t`

用来指定输出文件的持续时间，以秒为单位，如截取 input.mp4 的前 30 秒并保存为 output.mp4。

```sh
ffmpeg -i input.mp4 -t 30 output.mp4
```

`-c`

用来指定输出文件的编码，设置 `-c copy` 让 `FFmpeg` 在转换音视频时不重新进行编码，减少转换耗时。

```sh
ffmpeg -i input.mp4 -c copy -t 30 output.mp4
```

执行 help 命令，可以看到更多关于视频转换的选项

```sh
ffmpeg -help
```

![video-options](images/ffmpeg-video-opt.jpg)

- `-vframes` 设置要输出的视频帧数
- `-r` 速率设置帧速率（Hz值，分数或缩写）
- `-s` size设置帧大小（WxH或缩写）
- `-aspect` 宽高比设置的宽高比（4：3、16：9或1.3333、1.7777）
- `-bits_per_raw_sample` 设置每个原始样本的位数
- `-vn` 禁用视频
- `-vcodec` 编解码器强制视频编解码器（“复制”以复制流）
- `-timecode` 单位 hh：mm：ss [：;。] ff设置初始 TimeCode 值。
- `-pass n` 选择通过次数（1到3）
- `-vf filter_graph` 设置视频过滤器
- `-ab` 比特率音频比特率（请使用-b：a）
- `-b` 比特率视频比特率（请使用-b：v）
- `-dn` 禁用数据

## 参考

[FFmpeg Documentation](https://www.ffmpeg.org/documentation.html)

[如何使用_FFmpeg_进行视频转码](https://wiki.fiveyellowmice.com/wiki/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8_FFmpeg_%E8%BF%9B%E8%A1%8C%E8%A7%86%E9%A2%91%E8%BD%AC%E7%A0%81:%E9%A6%96%E9%A1%B5)
