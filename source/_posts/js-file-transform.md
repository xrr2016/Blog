---
title: JS 文件转换
categories:
  - 技术
tags:
  - WEB 
  - File 
  - Blob 
  - Base64
date: 2021-04-01 17:52:22
cover: ./images/js-file-transform/cover.jpg
---


最近需要将 base64 格式的图片转化成 JS 里的 File 对象进行上传，于是学习了一下这方面的知识

<!--more-->

## 前言

最近需要将 base64 格式的图片转化成 JS 里的 File 对象进行上传，于是学习了一下这方面的知识

## Base64 转 Blob

1. 分割 Base64 数据，生成类文件对象，base64 -> Uint8Array -> Blob
```javascript
function dataURI2Blob(dataURI) {
  // 分割数据
  const [meta, data] = dataURI.split(',')
  // 对数据编码
  let byte
  if (meta.includes('base64')) {
    byte = atob(data)
  } else {
    byte = encodeURI(data)
  }
  // 获取图片格式
  const mime = meta.split(':')[1].split(';')[0]
  // 创建 8 位无符号整型数组
  const ia = new Uint8Array(byte.length)
  // 获取字符 UTF-16 编码值
  for (let i = 0; i < byte.length; i++) {
    ia[i] = byte.codePointAt(i)
  }
  // 生成类文件对象
  return new Blob([ia], { type: mime })
}
```
拓展一下直接转成 File 对象也可以
```javascript
// 生成文件对象
new File([ia], 'test.jpg', { type: mime })
```

2. 取巧的方法，利用 fetch 
```javascript
 async function dataURI2Blob(dataURI) {
   // 返回 blob 类型的数据
   const blob = await fetch(dataURI).then((res) => res.blob())
   return blob
 }
```

个人喜好第二种，毕竟简洁易懂，代码量也少很多。之后就可以进行上传文件的操作了

```javascript
const fd = new FormData();
fd.append("img", blob, "test.jpg");
```

## Blob 转 Base64

使用 FileReader 进行反向转换，同理可转换 File 对象
```javascript
function blob2Base64(blob, callback) {
  const reader = new FileReader()

  reader.addEventListener('load', () => {
    callback(reader.result)
  })

  reader.readAsDataURL(blob)
}
```

## 拓展一下

将远程图片转换为 Base64 格式 url ->  Image -> Canvas -> Base64
```javascript
 function remoteImageToBase64(url, callback) {
  const img = new Image()
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')

  img.addEventListener('load', () => {
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0)

    // 返回 Canvas 的 base64 数据
    callback(canvas.toDataURL('image/jpg', 1))
    canvas = null
  })

  img.src = url
  // 处理 Canvas 跨域
  img.crossOrigin = 'Anonymous'
}

 remoteImageToBase64('https://game.gtimg.cn/images/lol/act/img/skin/big145014.jpg', (res) => {
   console.log('base64: ', res)
 })
```

当然也可以使用 fetch 转为 Blob 类型

```javascript
async function remoteImageToBlob(url) {
   const blob = await fetch(url).then((res) => res.blob())
   
   return blob
 }
 ````

完

