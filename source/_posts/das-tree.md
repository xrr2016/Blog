---
title: 数据结构与算法之二叉树
categories:
  - 技术
tags:
  - DSA
date: 2020-03-15 11:05:00
---

二叉树是一种非线性的数据结构，以分层的方式存储数据。在二叉树上进行添加，查找和删除数据非常快。

<!--more-->

## 前言

二叉树是一种非线性的数据结构，以分层的方式存储数据。用于存储有层级关系的数据，如计算机文件，公司组织结构等数据。在二叉树上进行添加，查找和删除数据非常快。

## 实现

要实现树结构首先需要 `Node` 节点类，节点保存数据和它左右节点的链接，`show` 方法返回节点数据。

```ts
class Node {
  data: number
  left: Node = null
  right: Node = null

  constructor(data: number) {
    this.data = data
  }

  show() {
    return this.data
  }
}
```

实现二叉树，首先需要向树中插入节点的方法，这个方法先创建一个节点，判断树是否有根节点，没有的话将新节点作为树的根节点，否则进行下一步；

1. 设当前节点为树的根节点，开始循环
2. 如果插入节点的数据小于当前节点的数据，将新当前节点设为原当前节点的左节点，否则执行第 4 步
3. 如果当前节点的左节点为 `null` ，就将新的节点插入这个位置，退出循环；否则执行下一次循环
4. 将新当前节点设为原当前节点的右节点
5. 如果当前节点的右节点为 `null` ，就将新的节点插入这个位置，退出循环；否则执行下一次循环

```ts
class BST {
  root: Node = null
  length: number = 0

  // 插入节点
  insert(data: number) {
    // 先创建新的节点
    const node = new Node(data)

    if (this.root === null) {
      this.root = node
      return;
    } else {
      let originNode
      // 将当前节点设为树根节点
      let currentNode = this.root

      // 开始循环
      while (true) {
        // 保存原节点引用
        originNode = currentNode

        //  如果插入节点的数据小于当前节点的数据
        if (data < currentNode.data) {
          // 将新当前节点设为原当前节点的左节点
          currentNode = currentNode.left
          // 如果当前节点的左节点为 `null` ，就将新的节点插入这个位置，退出循环；否则执行下一次循环
          if (currentNode === null) {
            originNode.left = node
            break
          }
        } else {
          // 将新当前节点设为原当前节点的右节点
          currentNode = currentNode.right
          // 如果当前节点的右节点为 `null` ，就将新的节点插入这个位置，退出循环；否则执行下一次循环
          if (currentNode === null) {
            originNode.right = node
            break
          }
        }
      }
    }
  }
}
```

遍历二叉树，中序，先序，后序

```ts
 // 中序遍历
inOrder(node: Node) {
  if (node !== null) {
    this.inOrder(node.left)
    node.show()
    this.inOrder(node.right)
  }
}

// 先序遍历
preOrder(node: Node) {
  if (node !== null) {
    node.show()
    this.preOrder(node.left)
    this.preOrder(node.right)
  }
}

// 后序遍历
postOrder(node: Node) {
  if (node !== null) {
    this.postOrder(node.left)
    this.postOrder(node.right)
    node.show()
  }
}
```

查找节点

```js
find(data: number): Node {
  let currentNode = this.root

  while (currentNode !== null) {
    if (currentNode.data === data) {
      return currentNode
    } else if (currentNode.data > data) {
      currentNode = currentNode.left
    } else {
      currentNode = currentNode.right
    }
  }
  return null
}
```

删除节点

```ts
  remove(data: number) {
    this.root = this.removeNode(this.root, data)
  }

  removeNode(node: Node, data: number): Node {
    if (node === null) {
      return null
    }
    if (data === node.data) {
      // 没有子节点
      if (node.left === null && node.right === null) {
        return null
      }
      // 没有左子节点
      if (node.left === null) {
        return node.right
      }
      // 没有右子节点
      if (node.right === null) {
        return node.left
      }
      // 有左右两个节点
      const tempNode = this.min(node.right)
      node.data = tempNode.data
      node.right = this.removeNode(node.right, tempNode.data)
      return node
    } else if (node.data > data) {
      node.left = this.removeNode(node.left, data)
      return node
    } else {
      node.right = this.removeNode(node.right, data)
      return node
    }
  }
```

最大值，最小值

```ts
// 最小值节点
min(node: Node = this.root): Node {
  let currentNode = node
  while (currentNode.left !== null) {
    currentNode = currentNode.left
  }
  return currentNode
}

// 最大值节点
max(node: Node = this.root): Node {
  let currentNode = node
  while (currentNode.right !== null) {
    currentNode = currentNode.right
  }
  return currentNode
}
```

## 应用

`BST` 可以用来记录一组数据中数据出现的次数，首先在 `Node` 类上添加 `count` 属性

```ts
class Node {
  data: number
  left: Node = null
  right: Node = null
  count: number = 0

  constructor(data: number) {
    this.data = data
  }

  show() {
    return this.data
  }
}
```

在 `BST` 类上添加 `update` 方法，当插入数据为新值时使用 `insert` 方法，当插入已经存在的值时使用 `update` 方法

```ts
update(data: number): Node {
  const node = this.find(data)
  if(node !== null) {
    node.count++
    console.log(`${node.data}: `, node.count)
    return node
  }
}
```

测试一下

```ts
const bst = new BST();
const array = [2, 3, 5, 6, 10, 3, 4, 2, 8, 5, 9, 1, 4, 2, 5]

for (let index = 0; index < array.length; index++) {
    const num = array[index]

    if (bst.find(num) !== null) {
        bst.update(num);
    }
    else {
        bst.insert(num);
    }
}

// 3:  1
// 2:  1
// 5:  1
// 4:  1
// 2:  2
// 5:  2
```
