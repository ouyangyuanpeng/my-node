---
title: Golang语言学习
createTime: 2024/11/14 10:21:26
permalink: /技术栈/jdiz5gnp/
---

## 安装环境

[go 语言编程环境下载](https://go.dev/dl/)
使用编程工具为 goland 2021 2.2
目前安装的是 1.20.3 版本



![[img/Pasted image 20230415165551.png]]
安装会自动配置环境变量指向 bin 目录，同时会自动生成 GOPATH,需要修改这个变量，这个变量是你下的依赖包安装的目录，默认是用户目录需要修改
![[img/Pasted image 20230415165646.png]]

// 设置自动监测包
go env -w GO111MODULE=on

GO111MODULE 是一个开关，通过它可以开启或关闭 go mod 模式。  
它有三个可选值：off、on、auto:

1)GO111MODULE=off 禁用模块支持，编译时会从 GOPATH 和 vendor 文件夹中查找包。  
2)GO111MODULE=on 启用模块支持，编译时会忽略 GOPATH 和 vendor 文件夹，只根据 go.mod 下载依赖。  
3)GO111MODULE=auto，当项目在$GOPATH/src 外且项目根目录有 go.mod 文件时，自动开启模块支持。

## 基本库中文文档 <https://studygolang.com/pkgdoc>

## 引用类型和值类型

<mark style="background: #FFF3A3A6;">指针类型也是 Golang 中的一种基本类型，存储了值的内存地址。指针类型可以指向任何值类型的数据，并且通过指针，可以在不同的函数之间共享和修改数据。</mark>

### 值类型

在 Golang 中，值类型包括以下几种：

- 基本数据类型：整型（int、uint、int8 等）、浮点型（float32、float64）、复数（complex64, complex128）、布尔型（bool）、字符串型（string）
- 复合数据类型：数组（array）、结构体（struct）

值类型有以下特点：

- 直接存储值，不存储地址。
- 变量间赋值或作为函数参数传递时进行值复制。
- 值类型的变量副本是独立的，修改一个变量的副本不会影响另一个。
- 值类型的复制会涉及整个值的拷贝，因此对于大的结构体或数组，复制操作可能会较慢。
- 值类型通常在栈上分配，除非是通过 new 函数分配的，或者是作为闭包中的变量被分配到堆上。

### 引用类型

引用类型并不直接存储数据本身，而是存储指向数据的指针，当复制一个引用类型的变量时，复制的是指针，新旧变量将指向相同的底层数据。

在 Golang 中，引用类型主要包括：

- 切片（Slices）：切片是对数组的封装，提供了一个灵活、动态的视图。当修改切片中的元素时，实际上是在修改底层数组的相应元素。
- 映射（Maps）：映射是一种存储键值对的集合。将映射传递给一个函数或者赋值给另一个变量时，任何对映射的修改都会反映在所有引用了这个映射的地方。
- 通道（Channels）：通道用于在不同的 goroutine 之间传递消息。通道本质上是引用类型，当复制或传递它们时，实际上传递的是对通道数据结构的引用。
- 接口（Interfaces）：接口类型是一种抽象类型，定义了一组方法，但不会实现这些方法。接口内部存储的是指向实现了接口方法的值的指针和指向该类型信息的指针。
- 函数（Functions）：在 Go 中，函数也是一种引用类型。当把一个函数赋给另一个变量时，实际上是在复制一个指向该函数的引用。

引用类型有以下特点

- 存储的是指向数据的地址，而不是数据本身。
- 当引用类型的变量被赋值或作为函数参数传递时，实际上是将该地址复制一份，因此多个变量可能共享同一份数据。
- 引用类型的数据通常在堆上分配，即使变量本身在栈上。
- 引用类型的零值是 nil，一个未初始化的引用类型的变量将会是 nil，不指向任何内存地址。

## 变量

1. 基本数据类型 int 、float、bool、string、array、结构体 struct，都是值类型；
2. 引用类型 interface、slice、map、chan 一共四种类型都是引用类型

### 变量定义

```go
// 每一个go文件都需要一个package包，main代表是入口
package main
// 格式化输出包
import "fmt"
// 主函数入口
func main () {
	// 动态类型
	var a = 1
	// 省略 var
	a1 :=1
	// 字符串
	var b string = "1"
	var c int = 1
	// 如果不赋值需要定义类型
	var d string
	// 声明字符，如果直接打印字符的化，不会显示字符而是显示字符对应的数字
	var e = 'a'
	// 定义多个变量
	var (
		a = 1
		b = 2
		// 下面为只定义类型，不赋值
		//a string
	)
	// 打印
	println(a,b,c)
	// 使用 fmt模块格式化
	fmt.Println(a,b,c)
}

```

## 格式化输出

```go
package main
// 格式化输出包
import "fmt"
// 主函数入口
func main () {
	fmt.Printf("我的a=%d，内存地址为=%p", b , &a)
}
```

### 占位符

%v 可以打印全部变量
%#v 打印结构体
%T 打印变量类型
%t 打印布尔类型
%b 打印变量的二进制
%s 打印字符串值 （字符对应字符集的码）
%c 打印字符，如果是数字打印数字对应字符
%d 打印整型
%f 打印浮点型
%o 八进制
%X 16 进制，并且字母大写
%x 16 进制，并且字母小写
%q 单引号围绕的字符字面值 ，直接打印字符，如果字符是“a"那么打印出就是”a“,数字的话就是数字对应字符
%p 打印变量内存地址（指针）

## for 循环

```go
for i := 0; i < 10; i++ {
   fmt.Println(i)
}

var j =0
for ; j < 10; j++ {
   fmt.Println(j)
}

// 类似于while
var k =0
for k<=10 {
   fmt.Println(k)
   k++
}
// 死循环
for{

}
// for range循环
var a = [5]int{1,2,3,5,6}

// index 索引，item 值
for index, item := range a {
   fmt.Println(index,item)
}

//标签
abc: //标签名称
	//标签体

// goto语句

// 直接跳转到标签处，如果是循环则会直接结束循环
goto abc

// 双重循环break后面跟标签的话，会直接结束全部循环，循环后面会执行
// 不加标签的话和其他java语言一样，go只是给他们加了一些别的功能
var a = [5]int{1,2,3,5,6}
my_label:
   for _, item := range a {
      for i := 0; i < 2; i++ {
         if item == 5 {
            break my_label
         }
         fmt.Println(item, i)
      }
   }
   fmt.Println("cs")
// 双重循环continue后面跟标签的话，会直接结束内层循环，外层循环继续执行，类似于
// java双重循环然后在内层循环break只会结束内层循环，外层继续
var a = [5]int{1,2,3,5,6}
my_label:
   for _, item := range a {
      for i := 0; i < 2; i++ {
         if item == 5 {
            continue my_label
         }
         fmt.Println(item, i)
      }
   }
   fmt.Println("cs")


```

## 数组

```go
// 定义数组变量
var array [5]int
// 访问指定索引
array[0] = 1

// 定义数组变量并且赋值,不一定要全部赋值，下面例子长度5，只给3个，其他两个是默认值
var array = [5]int {1,2,3}
// 省略长度初始化，自动推断
var array = [...]int {1,2,3}
// 指定索引值初始化,下面定义了索引1的值为1，索引0为2，索引5为3，那么2，3，4索引会给默认值
var array = [...]int {1:1,0:2,5:3}
// 二维数组
var array [2][3]int
var array [2][3]int =[2][3]int{{1,2},{1,2,3}}
// 切片定义,类似数组的定义，不要加长度，会自动扩容,默认是不分配内存，你添加数据的时候才会去申请内存
var array []int
array = append(array,1,2,3)
// 使用make函数，2代表默认分配2个长度的内存给切片
var array = make([]int,2)
// 初始化切片,和数组不一样，不需要加长度
var array = []int{1,2,3}
// 通过数组初始化切片，左闭右开，返回切片类型,切片的容量为数组的容量，不是拿到几个值的容量,从一个数组里面获取切片给另外一个数组，他们两个的变量指向同一个内存地址
var list = [5]int {1,2,3}
s1 := list[0:2]
// 切片也可以
var array = []int{1,2,3}
s1 := array[1:2]
```

## 数组切片关系

1. 切片是引用传递

```go
// 数组变量存的地址是数组第一个数据的地址
var array [5]int = [5]int{1,2,3,4,5}
// 通过数组获取的切片他们使用的是一个地址,除非切片长度超过了数组长度
// 这里变量存的是原数组第一个数据的地址，如果换成[1:2]，那么slice1存的就是原数组索引为1的数据的内存地址
var slice1 = array[0:2]
fmt.Println("array",array) //array [1 2 3 4 5]
fmt.Println("slice1",slice1) // slice1 [1 2]
fmt.Printf("%p\n",&array) // 0xc000010390
fmt.Printf("%p\n",slice1) // 0xc000010390
// slice1指向了原数组所以容量和原数组一样，但是如果切片变量指向的地址不是原数组第一个数据，那么就是从这一位开始计算容量，比如[1:3],那么容量就是4
fmt.Println(cap(slice1)) // 5
// 是通过数组转换的切片的话，在没有超过数组长度时，添加一个数据相当于在数组里面把对应的索引替换，这里
// 切片只有原数组的0-1索引数据，所以当我们加入一个数据的时候会把原数组的2索引替换，
// 一直替换到容量不够,容量不够就会拷贝一份到新的内存中，原数组恢复
// 因为切片存的内存地址是原数组对应索引的地址，所以会同步修改
slice1 = append(slice1,6)
fmt.Println("array",array[2]) // 6
fmt.Println("slice1",slice1) //slice1 [1 2 6]
fmt.Println("array",array) // array [1 2 6 4 5]
// 因为切片长度没有超过原数组，所以还是指向原数组的内存地址
fmt.Printf("%p\n",slice1) //0xc000010390
```

## map

```go
// 定义map类型
[key]value
var m map[string]string
var m = map[string]string{
"a":"a"
}
var m = make(map[string]string)
m["a"] = "a"

// 获取元素
var m = map[string]string{
"a":"a"
}
// 获取map会返回两个值，一个是value，一个是bool,如果存在返回true否则false
value,ok = m["a"]

```

## 函数

```go
package main
// type 声明一个变量类型 这里是声明函数变量类型，这个变量类型 可以接收函数，函数结构需要一致
// 这种可以说是多态 f1 是func(a int,b int) int这种函数的父类，因为使用f1的变量可以接收所有的这种函数结构的函数
type f1 type func(a int,b int) int

func main() {
   ret := a(1, 2)
   println(ret)
   n := b(1, 2)
   println(n)
   a, x := c(1, 2)
   println(a,x)
   _, d := c(1, 2)
   println(a,d)
   // 使用函数变量
   var f f1type = b
   a1 := f(1,2)
   println(a1)
   a2 := f1(func(a, b int) {})


   // 匿名函数自己调用自己
   fffff := func(a int, b int) int{
      return a+b
   }(1,2)
   println(fffff)

   // 函数参数为函数类型，下面是匿名函数作为参数，也可以其他函数
   fff3 := func(i int, i2 int) int{
      return i + i2
   }
   fff3(1,2)
   i2 := ff1(1, fff3)
   //ff1(1, func(i int, i2 int) int {
   // return i + i2   //})   println(i2)

   // 函数返回函数
   f2 := ff2(1,2)
   i := f2(2, 3)
   println(i)
}



func array1(a []int ){
   a[0] = 100
}

// 定义返回变量为 ret (返回名称)
func a(a int, b int) (ret int) {
   ret = a+b
   //return == return ret
   return
}

// 返回一个值
func b(a int, b int)  int {
   return a+b
}
// 返回多个值
func c(a int, b int)  (int,int) {
   return a,b
}

func d(a int, b int)  (c int,d int) {
   // 直接写return 等价于 return c,b   return
}

// 使用函数作为参数
func ff1(a int, b func(int, int) int) int {
   return b(a,2)
}
// 使用函数作为返回参数
func ff2(a int, b int) func( int,int) int{
   // 返回匿名函数
   return func(i int, i2 int) int {
      return i+i2
   }
}


// 闭包
package main

import "fmt"

// 闭包示例
func main() {
   // f1就是闭包了，在f1的生命周期内x一直有效
   //f1 := text()
   //fmt.Printf("%v\n",f1(10))   //fmt.Printf("%v\n",f1(20))   //fmt.Printf("%v\n",f1(30))   //f1 = text()   //fmt.Printf("%v\n",f1(10))   //fmt.Printf("%v\n",f1(20))   //fmt.Printf("%v\n",f1(30))
   var arr = [4]int{10, 20, 30, 40}
   f1 := sum(0)
   for _, v := range arr {
      fmt.Printf("%v\n", f1(v))
   }
   // 最终输出 100,因为闭包f1在使用过程中，如果没有重新赋值，那么变量a会一直存在，不会因为每次使用f1导致a被置为默认值，
   // 在java里面，局部变量会在出栈的时候清空，闭包帮助解决了这个问题，所以这个a就类似于成员变量了
}

func text() func(y int) int {
   var x int
   return func(y int) int {
      x += y
      return x
   }
}

func sum(a int) func(y int) int {
   return func(y int) int {
      a += y
      return a
   }
}
```

## defer

```go
func main(){
	// defer后面的代码并不会立马执行，而是放入一个栈中，等待函数出栈，出栈后在执行后面代码，这个defer的栈是先进后出，如果两个defer,那么会先执行后面进入的
	// 函数执行相当于入栈，函数执行完毕相当于出栈类似java
	defer fmt.println("cs")
	defer func(){}()
}
```

## 错误处理

```go
// 使用defer+内置函数recover 异常被捕获后，后面的代码还是会执行，recover()如果返回nil,说明没有异常
func main()  {
   defer func() {
      error := recover()
      if nil != error {
         fmt.Println("错误被捕获：",error)
      }
   }()
   num1 := 10
   num2 := 0
   fmt.Println(num1/num2)
}
// 抛出异常
return errors.Now("错误信息")

func abc(num int)(r int,err error)  {
   if num<0 {
      return 0,errors.New("cs")
   }else {
      return 1,nil
   }
}
```

## 结构体

1. 结构体是值类型，默认是通过值传递
2. 基本数据类型也可以重新定义

```go
// 类似java包装类，这样就可以给这个 int加一些方法了
type integer int

func (f integer) toString(a int) v string{
	return a+""
}

```

```go
// 定义Teacher结构体
type Teacher struct {
   Name string
   Age int
}

type Studen struct {
   Name string
   Age int
}

func main()  {
   // 方式1 定义结构体变量
   var oyyp Teacher
   fmt.Println(oyyp)
   oyyp.Name = "欧阳远鹏"
   oyyp.Age = 100
   fmt.Printf("%#v\n",oyyp)
   fmt.Println(oyyp.Age)
   // 方式2 定义结构体变量并且可以赋值，类似java new
   var oyyp2 Teacher = Teacher{"oyyp2",26}
    var oyyp2 Teacher = Teacher{Name:"oyyp2",Age:26}
   fmt.Printf("%#v\n",oyyp2)
   // 方式3 指针方式
   var oyyp3 *Teacher = new(Teacher)
   // oyyp3.Name 也可以 底层转换为(*oyyp3).Name
   (*oyyp3).Name = "oyyp3"
   fmt.Printf("%#v\n",oyyp3)
   // 方式4 指针方式
   var oyyp4 *Teacher = &Teacher{}
   // oyyp4.Name 也可以 底层转换为(*oyyp4).Name
   (*oyyp4).Name = "oyyp4"
   fmt.Printf("%#v\n",oyyp4)


   // 结构体转换，必需字段个数和类型相同还有变量名称
   var a Teacher
   var b Studen
   a = Teacher(b)
   fmt.Printf("%#v\n",a)


}
```

## 方法

```go

type SysUser struct {
   UserName string
   PassWord string
}

// 加星星说明是一个指针变量，相当于java中的this 来修改调用方法的对象的值，如果不加就是值传递了，不会影响到外面的方法调用对象
func (u *SysUser) SetUserName(userName string)  {
   u.UserName = userName
}

//func (u SysUser) SetUserName(userName string)  {
//   u.UserName = userName
//}

func (u *SysUser) SetPassWord(passWord string)  {
   u.PassWord = passWord
}


func main()  {

	// 使用方法3
	var user *SysUser = new (SysUser)
	user.SetUserName("admin")
	user.SetPassWord("admin123")

	fmt.Printf("%#v\n",user)

	var user *SysUser = &SysUser{}
	{
		user.SetUserName("admin")
		user.SetPassWord("admin123")
	}

}
```

## 继承

go 中只是继承了属性和方法，不像 java 可以用父类类型接收子类对象

```go
type Human struct{
	Name string
	Age int
}

type Woman struct {
	a Human
	Human
	// 指针也可以
	//*Human
}

func main(){
	var woman *Woman = &Woman{}
	// Human可以不用写
	woman.Human.Name = "cs"
	//
	woman.Human = Human{}
}
```

## 接口

1. 可以实现多态效果，实现了接口的方法，那么就可以使用接口变量接收实现了接口方法的对象(多态)
2. 接口可以继承，如果继承多个接口，那么实现类需要实现全部的方法
3. 接口是引用类型，默认是指针

```go
package main

import "fmt"

// 定义一个接口
type Human interface {
   updateName()
   addName()
}

type Weman struct {

}
// Weman 实现接口
func (w *Weman) updateName()  {
   fmt.Println("更新weman")

}

// Weman 实现接口
func (w *Weman) addName()  {
   fmt.Println("添加weman")
}


func (w *Weman) abc()  {
   fmt.Println("abc")
}

func (w *Weman) bbc()  {
   fmt.Println("bbc")
}




type Man struct {
   Weman // 添加这个是为了演示go中继承只能继承方法和属性，无法使用多态
}
// Weman 实现接口
func (m *Man) updateName()  {
   fmt.Println("更新Man")

}

// Weman 实现接口
func (m *Man) addName()  {
   fmt.Println("添加Man")
}


// （继承）通过接收一个父类对象，传子类对象，go中不能这样
func (m *Man) add123(w *Weman)  {
   fmt.Println("添加Man")
}



// 专门一个函数用来接口方法，多态效果，传的是什么类型的结构体就执行对应的方法，接口是引用类型，所以这里h 是一个指针变量
func greet(h Human)  {
   h.addName()
}




func main(){
   var weman = Weman{}
   var man = Man{}
   // 结构体是值传递,接口是引用类型使用引用传递
   greet(&weman)
   greet(&man)
   man.abc()
   man.bbc()
   man.add123(&man) // 不行
}
```

## 接口数组

```go
	var human [2]Human
	human[0] = new(Weman)
	human[1] = new(Man)

	for _, v := range human {
		v.addName()
	}
```

## 断言

1. 就是 java 中的判断变量类型是否是指定类型

```go
func greet(h Human)  {
   h.addName()
   // 判断h是不是Weman类型，flag是是否是 bool类型
    w,flag := h.(Weman)
   if flag {
	   //执行对应的方法
	   w.
   }
	// 第二种写法,直接合并成一条
	if  w,flag := h.(Weman);flag{

	}
	// 第三种 使用switch
	switch h.(type) //type是go的关键字
		case Weman:
			 w := h.(Weman)
			  //执行对应的方法
			 w.
}

```

## 文件 IO

```go
package main

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"os"
)

func main() {

	var filePath string = "D:/test.txt"

	writeFile(filePath, "我i是测试数据2123")
	writeBuffFile(filePath, []string{"wqpoj", "123", "直接own"})

	s, err := readFile(filePath)
	if err == nil {
		fmt.Printf("第一次调用：%s\n", s)
	}
	s2, err2 := readBuffFile(filePath)
	if err2 != nil {
		fmt.Printf("第二次调用：%q", s2)
	}

}

func readFile(filePaht string) (string, error) {
	data, err := os.ReadFile(filePaht)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func readBuffFile(filePaht string) ([]string, error) {

	f, err := os.Open(filePaht)
	if err != nil {
		fmt.Println("文件打开失败")
		log.Fatal(err)
	}
	reader := bufio.NewReader(f)
	var data []string
	for {
		str, err := reader.ReadString('\n')
		data = append(data, str)
		if err == io.EOF {
			return data, err
		}
	}
}

func writeFile(filePaht string, data string) {
	f, err := os.OpenFile(filePaht, os.O_RDWR|os.O_APPEND, 666)
	if err != nil {
		fmt.Println("文件打开失败")
		log.Fatal(err)
	}
	f.Write([]byte(data))
	defer f.Close()
}

func writeBuffFile(filePaht string, datas []string) {
	f, err := os.OpenFile(filePaht, os.O_RDWR|os.O_APPEND, 666)
	if err != nil {
		fmt.Println("文件打开失败")
		log.Fatal(err)
	}
	write := bufio.NewWriter(f)
	for _, v := range datas {
		write.WriteString("\n" + v)
	}
	write.Flush()
	defer f.Close()
}

```

## 管道 （chan）

1. 引用类型
2. 是一个队列，先进先出
3. 本身是线程安全的，多协程访问不需要加锁，不会产生冲突
4. 存储数据不能超过管道容量
5. 没有协程的情况下，如果管道没有数据了，再次取会报错
6. 管道关闭后，无法再次加入数据，但是可以读取数据
7. 可以使用 for range 遍历管道，如果不是协程操作管道，那么没有 close 会出现错误，close 后正常遍历，遍历全部管道数据后，结束循环
8. 管道默认为可读可写，可以设置
9. 只写不读会出问题
10. 管道的操作是阻塞的，如果当前管道已满则无法写入、管道无数据可读均会导致当前协程阻塞 (读取的时候如果是空数据，会阻塞等待直到管道不为 nil)

```go
package main

import "fmt"

func main() {
	// 新建管道对象，长度为3 默认可读可写
	var chans chan int = make(chan int, 3)
	// 可写，不可读
	var chans1 char<-
	// 可读，不可写
	var chans2 <-char
	// 管道添加数据
	chans <- 10
	chans <- 20
	fmt.Printf("管道长度：%v,管道容量：%v\n", len(chans), cap(chans)) // 2 ,3
	// 管道取出数据, 该数据会被管道移除
	val := <-chans
	fmt.Println(val)
	fmt.Printf("管道长度：%v,管道容量：%v", len(chans), cap(chans)) //1,3
	// 关闭管道
	close(chans)
}

```

## 管道和协程

```go
package main

import (
	"fmt"
	"sync"
)

var chans chan int = make(chan int, 50)

var w sync.WaitGroup

func main() {
	w.Add(2)
	go writeData()
	go readData()
	w.Wait()
}

func writeData() {
	for i := 1; i <= 100; i++ {
		chans <- i
		fmt.Println("写入的数据=", i)
	}
	close(chans)
	w.Done()
}

func readData() {
	for i := 1; i <= 100; i++ {
		num := <-chans
		fmt.Println("读取的数据=", num)
	}
	w.Done()
}

```
