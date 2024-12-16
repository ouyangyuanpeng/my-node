---
title: Golang项目搭建
createTime: 2024/11/14 10:21:26
permalink: /技术栈/ff30cmcf/
---

版本为 go 1.20

```bash
# 创建项目
go mod init {项目名称}
go mod tidy  //增加缺少的module，删除无用的module
go mod vendor  //创建vendor目录，把项目依赖放入vendor目录
go get "包地址" //引入第三方包

# 会删除掉执行其它命令时产生的一些文件和目录
go clean

# 编译
go build `指定编译目录 go build -o output/myapp.exe .`

```

## 编译

```bash
# 使用gcc或者是musl-gcc
CC=musl-gcc
# 环境变量设置编译
GOOS=windows // 目标平台是linux windows
GOARCH=amd64 // 目标处理器架构是amd64
go build -o myapp main.go
```

::: code-tabs
@tab linux编译
```bash
cd \path\to\your\project
set GOOS=linux
set GOARCH=amd64
go build -o myapp main.go
myapp
```

@tab window编译
```bash
$env:GOOS="linux"
$env:GOARCH="amd64"
go build -o myapp main.go
```

:::
