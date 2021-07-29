---
title: 使用 Context 避免深层属性传递 
categories:
  - 技术
tags:
  - React
  - Web
date: 2021-07-29 11:35:57
cover: ./images/react-context-hooks/cover.jpg
---

最近在项目发现了一些看起来很神奇的代码，一个组件 A 的方法通过 `props` 传到组件 B，然后到组件 C，再到组件 D，再到组件 E，最后到组件 D， 简直是千层饼😂。

<!--more-->

## 前言


最近在项目发现了一些看起来很神奇的代码，一个组件 A 的方法通过 `props` 传到组件 B，然后到组件 C，再到组件 D，再到组件 E，最后到组件 D， 简直是千层饼😂。

![Xnip2021-07-19_20-03-31.jpg](https://cdn.nlark.com/yuque/0/2021/jpeg/224563/1626696227396-bbd9e497-7d36-4100-8896-e97a0c36c2b0.jpeg#align=left&display=inline&height=525&margin=%5Bobject%20Object%5D&name=Xnip2021-07-19_20-03-31.jpg&originHeight=700&originWidth=700&size=428514&status=done&style=none&width=525)

提问一番后知道了这种将属性深层传递的现象叫 `Prop Drilling`，本文说明如何使用 React 的 Context API 避免这种现象。

## 什么是 Context

> Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。
> 
>
> 在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，但此种用法对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这些属性是应用程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。这些组件共享的以及变化不频繁的数据正是 Context 用武之地。


## 如何使用 Context


举个例子🌰 说明
![react-context-hooks.vercel.app_(iPhone 6_7_8).png](https://cdn.nlark.com/yuque/0/2021/png/224563/1627528553612-12e4c6b6-ae4a-49c1-b9bc-8405d438f794.png#align=left&display=inline&height=667&margin=%5Bobject%20Object%5D&name=react-context-hooks.vercel.app_%28iPhone%206_7_8%29.png&originHeight=1334&originWidth=750&size=49942&status=done&style=none&width=375)
[在线示例](https://react-context-hooks.vercel.app/)
[本文代码](https://github.com/xrr2016/react-context-hooks)
### 创建 Context


首先用 `React.createContext` 方法创建一个 `AuthContext`，表示当前应用的认证状态，创建时可以传入默认值。
```javascript
// AuthContext.js

export const AuthContext = React.createContext({
  user: null,
  isAuthenticated: false,
})
```
然后创建 `AuthContextProvider` 组件，在组件中初始化状态，定义改变状态的方法，将这些数据和方法传递给 `Context.Provider` 的 `value` 属性 ，`value` 可以接收数据和方法，最后在组件中渲染子组件  `children` 。
```javascript
// AuthContext.js

export class AuthContextProvider extends Component {
  state = {
    user: null,
    isAuthenticated: false,
  }

  login = (user) => {
    // ...
  }

  logout = () => {
   // ...
  }

  render() {
    return (
      <AuthContext.Provider value={(this.state, this.login, this.logout)}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}
```


### 使用 Context


有多种方式获得 Context 中的数据


1. 使用  `Context.Comsumer`



```javascript
// AppHeader.js

<AuthContext.Consumer>
  {(authContext) => (
    <header>
    // ...
    </header>
  )}
</AuthContext.Consumer>
```

2. 使用组件的 `ContextType` 属性

```javascript
// AppFooterButtons.js

class AppFooterButtons extends Component {
  static contextType = AuthContext

  render() {
    return (
      <div>
        <button onClick={this.login}>Login</button>
        <button onClick={this.context.logout}>Logout</button>
      </div>
    )
  }
}
```

3. 使用 `useContext`



对于函数式组件可以使用 `useContext` 方法获取状态数据，可以同时获取多个状态。
```javascript
// AppBody.js

const AppBoy = () => {
  const authContext = useContext(AuthContext)
  const { languages, current, changeLanguage } = useContext(LanguageContext)

  return (
    <div>
      <h1>
        Hello, {authContext.isAuthenticated ? authContext.user.name : 'World'}
      </h1>
    </div>
  )
}
```


### 修改 Context

1. 对于 class 组件，使用 `setState` 方法更新组件的 `state`。
```javascript
// AuthContext.js 

export class AuthContextProvider extends Component {
  // ...
  
  login = (user) => {
    if (this.state.isAuthenticated) {
      return
    }
    this.setState({
      user,
      isAuthenticated: true,
    })
  }

  logout = () => {
    this.setState({
      user: null,
      isAuthenticated: false,
    })
  }

  // ...
}

```

2. 函数式组件使用 `useState`
```javascript
// LanguageContext.js

export const LanguageContextProvider = (props) => {
  // ...
  
  const [current, setCurrent] = useState(0)
  const changeLanguage = (val) => {
    setCurrent(val)
  }

  // ...
}

```

最终使用 Context 将应用中通用状态统一管理，无需再层层传递属性。

## 结论

本文说明什么是 Context，以及使用 Context 的多种方式。使用 Context 可以有效的避免 `Prop Drilling` 现象，将需要深层传递的属性和方法提取出来，达到共用的目的。应用 `Context` 的最佳时机是应用的一些全局性，不会频繁变化的数据。

## 注意事项



[使用 Context 之前的考虑](https://zh-hans.reactjs.org/docs/context.html#before-you-use-context)


> Context 主要应用场景在于_很多_不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。
> 

> **如果你只是想避免层层传递一些属性，[组件组合（component composition）](https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html)有时候是一个比 context 更好的解决方案。**

## 参考


[Avoid Prop Drilling with React Context](https://medium.com/swlh/avoid-prop-drilling-with-react-context-a00392ee3d8)
[Prop Drilling](https://kentcdodds.com/blog/prop-drilling)
[Context](https://zh-hans.reactjs.org/docs/context.html#dynamic-context)






