---
title: 阿里的三道面试题
categories:
  - 面试
tags:
  - Interview
date: 2020-08-03 17:11:00
---

<!--more-->

## 前言

前段时间做了三道阿里的在线面试题，分享一下。

## (一) 身为前端，我很抱歉

```js
根据表达式计算字母数。
说明：
  给定一个描述字母数量的表达式，计算表达式里的每个字母实际数量
  表达式格式：
    字母紧跟表示次数的数字，如 A2B3
    括号可将表达式局部分组后跟上数字，(A2)2B
    数字为1时可缺省，如 AB3。
示例：
  countOfLetters('A2B3'); // { A: 2, B: 3 }
  countOfLetters('A(A3B)2'); // { A: 7, B: 2 }
  countOfLetters('C4(A(A3B)2)2'); // { A: 14, B: 4, C: 4 }

function countOfLetters(letters, res) {
  /** 代码实现 */
}
```

这题面试的时候完全没思路，之后搜索了一下，发现跟 LeetCode 上的一道算法题类似类似 [726.原子的数量](https://leetcode-cn.com/problems/number-of-atoms/) 🤥

```js
const isNum = (a) => /[\d]/.test(a);
const isUpper = (a) => /[A-Z]/.test(a);

function countOfLetters(formula) {
  const stack = [];
  const map = new Map();

  stack.push([]);
  let i = 0;

  const getNums = (index) => {
    let num = "";
    while (isNum(formula[index])) {
      num += formula[index];
      index++;
    }
    return num;
  };

  while (i < formula.length) {
    if (isUpper(formula[i])) {
      let atom = formula[i];
      i += atom.length;
      let obj = {};
      obj["name"] = atom;
      if (isNum(formula[i])) {
        let num = getNums(i);
        i += num.length;
        obj["value"] = Number(num);
      } else {
        obj["value"] = 1;
      }
      stack[stack.length - 1].push(obj);
    } else if (formula[i] === "(") {
      stack.push([]);
      i++;
    } else if (formula[i] === ")") {
      i++;
      let multi = getNums(i);
      i += multi.length;
      let left = stack[stack.length - 2];
      let right = stack[stack.length - 1];
      for (let j = 0; j < right.length; ++j) {
        let obj = {};
        obj["value"] = multi * right[j].value;
        obj["name"] = right[j].name;
        left.push(obj);
      }
      stack.pop();
    }
  }

  // console.log(stack[0])

  const obj = {};
  for (let i = 0; i < stack[0].length; ++i) {
    obj[stack[0][i].name] = 0;
  }
  for (let i = 0; i < stack[0].length; ++i) {
    obj[stack[0][i].name] += stack[0][i].value;
  }

  return obj;
}

const res = countOfLetters("C4(A(A3B)2)2");
console.log(res);
```

## (二) 防抖节流，力争上游

```js
实现一个`Foo`方法，接受函数`func`和时间`wait`，返回一个新函数，新函数即时连续多次执行，但也只限制在`wait`的时间执行一次。

function Foo(func, wait) {
  /* 代码实现 */
}
```

这题是常见的防抖节流函数，需要牢牢掌握啊。

```js
function Foo(func, wait) {
  let timeout;
  let args = arguments;

  return function (args) {
    if (timeout) {
      return;
    }
    timeout = setTimeout(() => {
      func.call(this, args);
      clearTimeout(timeout);
    }, wait);
  };
}
```

## (三) 递归递归，学会不亏

```js
对象扁平化
  说明：请实现 flatten(input) 函数，input 为一个 javascript 对象（Object 或者 Array），返回值为扁平化后的结果。
  示例：
    var input = {
      a: 1,
      b: [ 1, 2, { c: true }, [ 3 ] ],
      d: { e: 2, f: 3 },
      g: null,
    }
    var output = flatten(input);
    output如下
    {
      "a": 1,
      "b[0]": 1,
      "b[1]": 2,
      "b[2].c": true,
      "b[3][0]": 3,
      "d.e": 2,
      "d.f": 3,
      // "g": null,  值为null或者undefined，丢弃
   }

  function flatten(input) {
    /** 代码实现 */
  }
```

递归思想实现对象的扁平化。

```js
function flatten(obj, parentKey = "", result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let keyName = `${parentKey}${key}`;
      if (typeof obj[key] === "object") {
        flatten(obj[key], keyName + ".", result);
      } else {
        result[keyName] = obj[key];
      }
    }
  }
  return result;
}
```
