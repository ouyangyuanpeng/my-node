---
title: Golang
date: '2025-04-01 22:11:41'
meta: []
permalink: /post/golang-zth69r.html
author:
  name: oyyp
  link: https://github.com/ouyangyuanpeng
---


<!-- more -->




# Golang

Golang常用方法[^1]

Golang命令[^2]​

‍

[^1]: # Golang常用方法

    ## JSON 转换

    **结构体（Struct）到 JSON 字符串的转换：**

    ```go
    package main

    import (
       "encoding/json"
       "fmt")

    type Person struct {
       Name  string `json:"name"`
       Age   int    `json:"age"`
       Email string `json:"email"`
    }

    func main() {
       person := Person{
          Name:  "John Doe",
          Age:   30,
          Email: "john@example.com",
       }

       // 结构体到JSON字符串
       jsonString, err := json.Marshal(person)
       if err != nil {
          fmt.Println("Error:", err)
          return
       }

       fmt.Println(string(jsonString))
    }

    ```
    **JSON 字符串到结构体的转换：**

    ```go
    package main

    import (
       "encoding/json"
       "fmt")

    type Person struct {
       Name  string `json:"name"`
       Age   int    `json:"age"`
       Email string `json:"email"`
    }

    func main() {
       jsonStr := `{"name":"Jane Doe","age":25,"email":"jane@example.com"}`

       // JSON字符串到结构体
       var person Person
       err := json.Unmarshal([]byte(jsonStr), &person)
       if err != nil {
          fmt.Println("Error:", err)
          return
       }

       fmt.Printf("%+v\n", person)
    }
    ```
    **Map 到 JSON 字符串的转换：**

    ```go
    package main

    import (
       "encoding/json"
       "fmt")

    func main() {
       data := map[string]interface{}{
          "name":  "Alice",
          "age":   28,
          "email": "alice@example.com",
       }

       // Map到JSON字符串
       jsonString, err := json.Marshal(data)
       if err != nil {
          fmt.Println("Error:", err)
          return
       }

       fmt.Println(string(jsonString))
    }
    ```
    **JSON 字符串到 Map 的转换:**

    ```go
    package main

    import (
       "encoding/json"
       "fmt")

    func main() {
       jsonStr := `{"name":"Bob","age":35,"email":"bob@example.com"}`

       // JSON字符串到Map
       var data map[string]interface{}
       err := json.Unmarshal([]byte(jsonStr), &data)
       if err != nil {
          fmt.Println("Error:", err)
          return
       }

       fmt.Printf("%+v\n", data)
    }
    ```
    ## log 使用

    ​`log.LstdFlags` 和 `log.Lshortfile` 是 Golang 日志包中用于设置日志格式的标志位。

    - ​`log.LstdFlags` 包括了日期和时间信息。具体包括年月日和时分秒。这样的设置适合大多数的一般日志输出。
    - ​`log.Lshortfile` 用于在日志中输出文件名和行号。这对于调试和定位问题非常有用，因为它会显示出产生日志的具体代码位置。

    ```text
    func SetFlags(flag int)       // 主要用于设置日志的时间戳格式，也可以设置前缀字符串在log输出中的位置，默认flag为LstdFlags
    func SetOutput(w io.Writer)   // 设置日志的输出目的地，比如文件、网络socket、syslog等
    func SetPrefix(prefix string) // 设置日志前缀
    ```
    ```go
    func main() {
    	// 打开或创建日志文件
    	file, logErr := os.OpenFile("logfile.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
    	if logErr != nil {
    	   log.Fatal("无法打开日志文件：", logErr)
    	}
    	defer file.Close()
    	// 设置日志的输出目标为文件
    	log.SetOutput(file)
    	// 设置日志的输出目标为文件和标准输出（控制台）
    	log.SetOutput(io.MultiWriter(file, os.Stdout))

    	// 设置日志的输出格式
    	log.SetFlags(log.LstdFlags | log.Lshortfile)

    }

    ```
    ## http

    ### 表单请求

    ```go
    import ( "net/http"    "net/url" )

    // 定义请求的数据
    data := url.Values{
        "operatoraccount": {*username},
        "password":        {*password},
    }

    // 创建 POST 请求
    resp, err := http.PostForm("http://221.226.21.180/examinationRY/userLogin.action", data)
    if err != nil {
        fmt.Println("Error sending request:", err)
        return "", fmt.Errorf("Error sending request: %w", err)
    }

    defer resp.Body.Close()
    cookie := resp.Header.Get("Set-Cookie")
    jsessionid := strings.Split(cookie, ";")[0]
    return jsessionid, nil

    ```
    ### POST请求

    ```go

    req, err := http.NewRequest("POST", "url", strings.NewReader(""))  
    if err != nil {  
        fmt.Println("Error sending request:", err)  
    }  
    req.Header.Add("cookie", cookie)  
    // 构建请求客户端  
    client := &http.Client{  
        Timeout: 20 * 1000 * 1000 * 1000, // 20 seconds  
    }  
    // 发送请求
    resp, err := client.Do(req)  
      
    defer resp.Body.Close()  
      
    // 读取响应体  
    responseData, err := io.ReadAll(resp.Body)  
    if err != nil {  
        fmt.Println("Error reading response:", err)  
        return nil  
    }  
      
    // 解析 JSON 响应  
    var selectMenu SelectMenu  
    err = json.Unmarshal(responseData, &selectMenu)  
    if err != nil {  
        fmt.Println("Error reading response:", err)  
        return nil  
    }  
      
    ```
    ‍


[^2]: # Golang命令

    版本为 go 1.20

    ```bash
    # 创建项目
    go mod init {项目名称}
    go mod tidy  //增加缺少的module，删除无用的module
    go mod vendor  //创建vendor目录，把项目依赖放入vendor目录
    go get "包地址" //引入第三方包

    # 会删除掉执行其它命令时产生的一些文件和目录
    go clean

    # 运行程序
    go run main.go

    # 编译
    go build `指定编译目录 go build -o output/myapp.exe .`

    go build  -o DeCard.dll ./RdCard

    -o 输出目录和文件名称 
    最后面是主函数位置
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
    ‍

    ```bash
    cd \path\to\your\project
    export GOOS=linux
    export GOARCH=amd64
    go build -o myapp main.go
    myapp
    或者单行设置，只针对这次go build
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o minio .
    ```
    ‍

    ‍

    ```bash
    PowerShell执行：

    $env:GOOS="linux"
    $env:GOARCH="amd64"
    go build -o myapp main.go

    32位
    $env:GOARCH="386"
    强制使用gcc，有需要可以添加
    $env:CGO_ENABLED=1


    cmd下执行
    cd \path\to\your\project
    set GOOS=linux
    set GOARCH=amd64
    go build -o myapp main.go
    myapp
    ```
    :::

    linux启动流程：

    ```bash
    chmod +x myapp
    ./myapp
    ```
    ‍

    编译成dll

    ```bash
    set GOOS=windows
    设置编译32
    set GOARCH=386
    设置32位工具链地址
    set PATH=D:\develop\sdk\mingw32\bin;%PATH%
    启用cgo
    set CGO_ENABLED=1
    ```
    go build  -buildmode=c-shared -o DeCard.dll ./RdCard

    ‍

    ‍

    设置代理地址

    go env -w GOPROXY=https://goproxy.cn,direct

    ‍
