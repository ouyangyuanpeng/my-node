---
title: Typescript
createTime: 2024/11/14 10:21:26
permalink: /技术栈/rlhidvqn/
---
# 类型声明

```ts
let 变量名：变量类型 = 值
// 声明一个字符串类型
let a: string = ''

// 声明一个object类型
// [key: string] 代表无法确定对象有多少个属性，但是属性是字符串，any代表属性值可以是任意类型
let sendData : {[key: string]: any } = {}
// 数组
let a: number[] = []

// 函数声明
// 定义返回值和参数类型
const x = (参数: 参数类型,参数: 参数类型):返回类型 => {
  return
}
const x = (a: number,b: number):number => {
  return 1
}
// 问号表示这个参数不是必传的，可以不传
const x = (a: number,b: number,c?: string):number => {
  return 1
}
```
