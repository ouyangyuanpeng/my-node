---
title: Golang常用方法
createTime: 2024/11/14 10:21:26
permalink: /技术栈/c4ys7pu7/
---

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

`log.LstdFlags` 和 `log.Lshortfile` 是 Golang 日志包中用于设置日志格式的标志位。

- `log.LstdFlags` 包括了日期和时间信息。具体包括年月日和时分秒。这样的设置适合大多数的一般日志输出。
- `log.Lshortfile` 用于在日志中输出文件名和行号。这对于调试和定位问题非常有用，因为它会显示出产生日志的具体代码位置。

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
	`log.SetOutput(io.MultiWriter(file, os.Stdout))`

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
