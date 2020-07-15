---
title: 阿里在线三道面试题
categories:
  - 技术
tags:
  - Interview
date: 2020-07-14 09:22:03
---

<!--more-->

/\*\*

- 根据表达式计算字母数
- 说明：
- 给定一个描述字母数量的表达式，计算表达式里的每个字母实际数量
- 表达式格式：
-     字母紧跟表示次数的数字，如 A2B3
-     括号可将表达式局部分组后跟上数字，(A2)2B
-     数字为1时可缺省，如 AB3。
- 示例：
- countOfLetters('A2B3'); // { A: 2, B: 3 }
- countOfLetters('A(A3B)2'); // { A: 7, B: 2 }
- countOfLetters('C4(A(A3B)2)2'); // { A: 14, B: 4, C: 4 }
  _/
  function countOfLetters(letters, res) {
  /\*\* 代码实现 _/
  res = res || new Map()

for(let i = 0; i < letters.length; i++) {
if(l === ')') {
res.values().forEach(v => v \*= letters[i + 1])
}

    if(res.has(l)) {
      res.set(l, res.get(l) + 1)
    } else {
      res.set(l, 1)
    }

}

return res
}

/\*\*

- 实现一个`Foo`方法，接受函数`func`和时间`wait`
- 返回一个新函数，新函数即时连续多次执行，但也只限制在`wait`的时间执行一次
  _/
  function Foo(func, wait) {
  /_ 代码实现 \*/
  let timeout
  let args = arguments

return function(args) {
if(timeout) {
return
}
timeout = setTimeout(() => {
func.call(this, args)
clearTimeout(timeout)
}, wait)
}
}

/\*\*

- 对象扁平化
- 说明：请实现 flatten(input) 函数，input 为一个 javascript 对象（Object 或者 Array），返回值为扁平化后的结果。
- 示例：
- var input = {
-     a: 1,
-     b: [ 1, 2, { c: true }, [ 3 ] ],
-     d: { e: 2, f: 3 },
-     g: null,
- }
- var output = flatten(input);
- output 如下
- {
-     "a": 1,
-     "b[0]": 1,
-     "b[1]": 2,
-     "b[2].c": true,
-     "b[3][0]": 3,
-     "d.e": 2,
-     "d.f": 3,
-     // "g": null,  值为null或者undefined，丢弃
- }
  \*/
  function flatten(input, key, res, isObject = false) {
  res = res || {}

for(k in input) {
const val = input[k]

    if(typeof val === 'object') {
      let temp = key + k + '.'

      flatten(val, temp, res, true)
    } else if(Array.isArray(val)) {
      let temp = `${key}[${k}].`

      flatten(val, temp, res)
    } else {
      let temp = isObject ? `${key}.${k}`  : `${key}[${k}].`

      res[temp] = input[k]
    }

}

return res
}
