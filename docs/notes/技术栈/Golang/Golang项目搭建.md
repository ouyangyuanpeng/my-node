---
title: Golang项目搭建
createTime: 2024/11/14 10:21:26
permalink: /技术栈/ff30cmcf/
---

版本为 go 1.20

```bash
1. 创建项目
2. go mod init {项目名称}
3. go mod tidy  //增加缺少的module，删除无用的module
4. go mod vendor  //创建vendor目录，把项目依赖放入vendor目录
5. go get "包地址" //引入第三方包
```
