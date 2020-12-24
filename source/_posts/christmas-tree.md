---
title: 画一颗圣诞树🎄
categories:
  - 技术
tags:
  - Canvas
date: 2020-12-23 08:49:20
---

![cover](./images/christmas-tree/tree.png)

<!--more-->


## 初始化


添加一个 `canvas` 元素，引入 css, js 文件
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Christmas Tree</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <canvas id="tree"></canvas>
    <script src="./index.js"></script>
  </body>
</html>

```
```css
canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fefdfd;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
}

```
```javascript
const CANVAS_WIDTH = 360
const CANVAS_HEIGHT = 620

function initCanvas(id) {
  const canvas = document.getElementById(id)
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  return canvas
}

function main() {
  const canvas = initCanvas('tree')
}

window.addEventListener('load', main)
```


## 画树枝


使用线条绘制树枝，每次绘制保存绘制转态，设置绘制旋转角度绘制左右子树，递归绘制。
```javascript
function main() {
  const canvas = initCanvas('tree')
  // 树的起始位置
  const location = [CANVAS_WIDTH * 0.5, CANVAS_HEIGHT]

  drawBranches(canvas, location, 0, 100, 20)
}
/*
 * canvas       画布
 * start        起始位置
 * angle        旋转角度
 * branchHeight 树枝长度
 * branchWidth  树枝宽度
 */
function drawBranches(canvas, start, angle, branchHeight, branchWidth) {
  const ctx = canvas.getContext('2d')
  ctx.save()
  ctx.beginPath()
  // 将画布原点移动到起始位置
  ctx.translate(...start)
  // 设置绘制颜色
  ctx.strokeStyle = '#333'
  // 设置绘制宽度
  ctx.lineWidth = branchWidth
  // 设置旋转角度
  ctx.rotate((angle * Math.PI) / 180)

  ctx.moveTo(0, 0)
  ctx.lineTo(0, -branchHeight)
  ctx.stroke()

  if (branchHeight > 6) {
    // 绘制右子树
    drawBranches(canvas, [0, -branchHeight], 35, branchHeight * 0.5, branchWidth * 0.7)
    // 绘制左子树
    drawBranches(canvas, [0, -branchHeight], -35, branchHeight * 0.5, branchWidth * 0.7)
    // 绘制中间的树干
    drawBranches(canvas, [0, -branchHeight], 0, branchHeight * 0.8, branchWidth * 0.7)
  }

  ctx.restore()
}

```

![branch.png](https://cdn.nlark.com/yuque/0/2020/png/224563/1608733907096-e7ccfbf1-8ad5-408d-a011-ce128ffef243.png#align=left&display=inline&height=660&margin=%5Bobject%20Object%5D&name=branch.png&originHeight=1320&originWidth=840&size=257047&status=done&style=none&width=420)

## 画树叶


获取画布像素点 `alpha` 通道值，判断此处是否有图像，循环像素点数组绘制半圆。
```javascript
function main() {
  const canvas = initCanvas('tree')
  const location = [CANVAS_WIDTH * 0.5, CANVAS_HEIGHT]

  drawBranches(canvas, location, 0, 100, 20)
  drawLeaves(canvas)
}

// ...

// 使用一个数组保存绘制树的像素点
const branchPixels = []

function drawLeaves(canvas) {
  const ctx = canvas.getContext('2d')
  // 获取画布像素数据
  const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  const data = imageData.data

  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      // 获取像素点 alpha 通道值
      const alpha = data[4 * (y * CANVAS_WIDTH + x) + 3]

      // 如果 alpha 值大于 0 说明这个位置有图像；排除基础树干的像素点；
      if (alpha > 0 && y < CANVAS_HEIGHT - 100) {
        branchPixels.push([x, y])
      }
    }
  }

  for (let i = 0; i < branchPixels.length; i++) {
    // 减少绘制几率
    if (Math.random() < 0.3) {
      const loc = branchPixels[i]
      loc[0] += (Math.random() - 0.5) * 5
      loc[1] += (Math.random() - 0.5) * 5
      // 设置绘制颜色，越往外颜色越浅
      const green = (255 * (CANVAS_HEIGHT - loc[1])) / CANVAS_HEIGHT

      ctx.save()
      ctx.beginPath()
      ctx.translate(...loc)
      ctx.rotate(Math.random() * Math.PI * 2)
      ctx.fillStyle = `rgba(0, ${green}, 0, .2)`
      // 绘制半圆
      ctx.arc(0, 0, 5, 0, Math.PI)
      ctx.fill()
      ctx.restore()
    }
  }
}
```
![leaves.png](https://cdn.nlark.com/yuque/0/2020/png/224563/1608734737527-08917a38-0a45-496d-9ec9-de9309fbfca0.png#align=left&display=inline&height=660&margin=%5Bobject%20Object%5D&name=leaves.png&originHeight=1320&originWidth=840&size=480606&status=done&style=none&width=420)
## 画礼物


余下的使用 `fillText` 和 `drawImage` 方法绘制即可。
```javascript
function main() {
  const canvas = initCanvas('tree')
  const location = [CANVAS_WIDTH * 0.5, CANVAS_HEIGHT]

  drawBranches(canvas, location, 0, 100, 20)
  drawLeaves(canvas)
  drawGifts(canvas)
  drawStar(canvas)
}

// ...

const gifts = ['🎁', '🍎', '🍭', '🍬', '🎈', '🧸', '🔔']

function drawGifts(canvas) {
  const ctx = canvas.getContext('2d')

  ctx.save()
  ctx.font = '1.5rem sans-serif'
  for (let i = 0; i < 30; i++) {
    // 从树的像素点数组中随机获取位置
    const location = branchPixels[Math.floor(Math.random() * branchPixels.length)]
    const gift = gifts[i % gifts.length]

    ctx.fillText(gift, ...location)
  }
  ctx.restore()
}

const image = new Image(500, 500)
image.src = 'star.png'

function drawStar(canvas) {
  const size = 50
  const ctx = canvas.getContext('2d')
  const loc = [CANVAS_WIDTH * 0.5 - size / 2, 80]

  // 绘制图片
  ctx.drawImage(image, ...loc, size, size)
}
```

![cover](./images/christmas-tree/tree.png)

JUST FOR FUN

[源码](https://github.com/xrr2016/christmas-tree)