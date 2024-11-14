---
title: Rust语法
createTime: 2024/11/14 10:21:26
permalink: /技术栈/m9ph5i95/
---
## 声明变量类型

Rust 是强类型语言，但具有自动判断变量类型的能力，rust 默认的变量值是不能修改的

```rust
fn main() {
	// let 变量名：变量类型 = 值
	// let 声明一个变量，并且自动识别类型
	let a = 1;
	// let 声明一个常量，并且自动识别类型，不可改变
	const a = 1;
	// &是引用，相当于获取的a的值的使用权，但是无法修改，想要修改就需要前面加mnt
	// 内存中可以这样说明 b -> a -> 1
	let b = &a;
	// mnt关键字说明他可以改变值
	let mnt a =1;
	// 声明一个有符号整数并且是32位的 有 i8,u8,i16,u16...
	// u为无符号整数
	let a: i32 = 1;
	// 布尔类型
	let a:bool = true;
	// 动态数组Vec
	let v: Vec<i32> = Vec::new();
	v.push(1);
	let v = vec![1, 2, 3];

	// c 是一个长度为 5 的 i32 数组
	let c: [i32; 5] = [1, 2, 3, 4, 5];
	// 元组
	let tup: (i32, f64, u8) = (500, 6.4, 1);

	// 这个是字符串 &str （字符串切片） 字符串分两种类型
	let s = "cs";
	// 这个是String （String 类型来自标准库）
    let a = String::from("Cs");
    let b = "Hello".to_string();
    // 获取字符串切片0开始，不包括2
    let c = &b[0..2] // he
}
// {:?}一般用于输出数组
println!("rect1 is {:?}", rect1);

// 函数
fn <函数名> ( <参数> ) <函数体> -> <返回类型>

fn add(a: i32, b: i32) -> i32 {
    return a + b;
}
```

引用内存结构
![[img/Pasted image 20230323142552.png]]

## 所有权规则

所有权有以下三条规则：

- Rust 中的每个值都有一个变量，称为其所有者。
- 一次只能有一个所有者。
- 当所有者不在程序运行范围时，该值将被删除。

```rust
// 当变量超出范围时，Rust 自动调用释放资源函数并清理该变量的堆内存。但是 s1 和 s2 都被释放的话堆区中的 "hello" 被释放两次，这是不被系统允许的。为了确保安全，在给 s2 赋值时 s1 已经无效了。没错，在把 s1 的值赋给 s2 以后 s1 将不可以再被使用。下面这段程序是错的：
let s1 = String::from("hello");
let s2 = s1;
// 错误！s1 已经失效 ,因为所有权已经转移给s2了，那么s1已经失效
println!("{}, world!", s1);
```

```rust
fn main() {
    let s = String::from("hello");
    // s 被声明有效

    takes_ownership(s);
    // s 的值被当作参数传入函数
    // 所以可以当作 s 已经被移动，从这里开始已经无效

    let x = 5;
    // x 被声明有效

    makes_copy(x);
    // x 的值被当作参数传入函数
    // 但 x 是基本类型，依然有效
    // 在这里依然可以使用 x 却不能使用 s

} // 函数结束, x 无效, 然后是 s. 但 s 已被移动, 所以不用被释放
```

## match 语法

```rust
fn main() {
	// 声明枚举
    enum Book {
        Papery {index: u32},
        Electronic {url: String},
    }
    // 枚举类型
    let book = Book::Papery{index: 1001};
    let ebook = Book::Electronic{url: String::from("url...")};
    // 类似java switch,用于判断枚举是哪个类型
    match book {
        Book::Papery { index } => {
            println!("Papery book {}", index);
        },
        Book::Electronic { url } => {
            println!("E-book {}", url);
        }
    }
}
```

## use 关键字

use 关键字能够将模块标识符引入当前作用域：

```rust
// 这样就解决了局部模块路径过长的问题。可以直接使用
// std是标准库
use std::io::{Read, Write};
use std::net::TcpStream;

// 如果不这样引入的话
fn main() {
	// 就要这样使用了
	std::mem::drop(port);
}

```

整数，浮点数类似 浮点使用 f8,f32
| 位长度 | 有符号 | 无符号 |
| ---- | ---- |---- |
| 8-bit| i8|u8 |
| 16 | i16 | u16 |
| 32 | i32 | u32 |
| 64 | i64 | u64 |
| 128 | i128 | u128 |
| arch | isize | usize |

## if while for

```rust
fn main() {
	// if
	if a > 0 {
        b = 1;
    }  
    else if a < 0 {
        b = -1;
    }  
    else {
        b = 0;
    }
    // while 循环
    let mut number = 1;
    while number != 4 {
        println!("{}", number);
        number += 1;
    }
    // for
    let a = [10, 20, 30, 40, 50];
    for i in a.iter() {
        println!("值为 : {}", i);
    }
    // loop 循环 (无限循环)
    let s = ['R', 'U', 'N', 'O', 'O', 'B'];
    let mut i = 0;
    loop {
        let ch = s[i];
        if ch == 'O' {
            break;
        }
        println!("\'{}\'", ch);
        i += 1;
    }
}
```

## 结构体

类似于 java 里面的类

```rust
struct Site {
    domain: String,
    name: String,
    nation: String,
    found: u32
}
// Rust 很多地方受 JavaScript 影响，在实例化结构体的时候用 JSON 对象的 key: value 语法来实现定义：
let runoob = Site {
    domain: String::from("www.runoob.com"),
    name: String::from("RUNOOB"),
    nation: String::from("China"),
    found: 2013
};
// 元组结构体
struct Color(u8, u8, u8);
struct Point(f64, f64);

let black = Color(0, 0, 0);
let origin = Point(0.0, 0.0);



// 结构体方法
struct Rectangle {
    width: u32,
    height: u32,
}
   
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    println!("rect1's area is {}", rect1.area());
}

// 结构体关联方法
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn create(width: u32, height: u32) -> Rectangle {
        Rectangle { width, height }
    }
}

fn main() {
    let rect = Rectangle::create(30, 50);
    println!("{:?}", rect);
}

```

## 错误处理

Rust 有一套独特的处理异常情况的机制，它并不像其它语言中的 try 机制那样简单。

首先，程序中一般会出现两种错误：可恢复错误和不可恢复错误。

可恢复错误的典型案例是文件访问错误，如果访问一个文件失败，有可能是因为它正在被占用，是正常的，我们可以通过等待来解决。

但还有一种错误是由编程中无法解决的逻辑错误导致的，例如访问数组末尾以外的位置。

大多数编程语言不区分这两种错误，并用 Exception （异常）类来表示错误。在 Rust 中没有 Exception。

对于可恢复错误用 Result<T, E> 类来处理，对于不可恢复错误使用 panic! 宏来处理。

```rust
use std::fs::File;

fn main() {
	// 在 Rust 标准库中可能产生异常的函数的返回值都是 Result 类型的。例如：当我们尝试打开一个文件时：
    let f = File::open("hello.txt");
    match f {
        Ok(file) => {
            println!("File opened successfully.");
        },
        Err(err) => {
            println!("Failed to open the file.");
        }
    }
}
```

如果想使一个可恢复错误按不可恢复错误处理，Result 类提供了两个办法：unwrap() 和 expect(message: &str) ：

```rust
use std::fs::File;

fn main() {
    let f1 = File::open("hello.txt").unwrap();
    let f2 = File::open("hello.txt").expect("Failed to open.");
}
```

## 可恢复的错误的传递

之前所讲的是接收到错误的处理方式，但是如果我们自己编写一个函数在遇到错误时想传递出去怎么办呢？

```rust
fn f(i: i32) -> Result<i32, bool> {
    if i >= 0 { Ok(i) }
    else { Err(false) }
}

fn main() {
    let r = f(10000);
    if let Ok(v) = r {
        println!("Ok: f(-1) = {}", v);
    } else {
        println!("Err");
    }
}

// 运行结果 Ok: f(-1) = 10000

这段程序中函数 f 是错误的根源，现在我们再写一个传递错误的函数 g ：
fn g(i: i32) -> Result<i32, bool> {
    let t = f(i);
    return match t {
        Ok(i) => Ok(i),
        Err(b) => Err(b)
    };
}
```

函数 g 传递了函数 f 可能出现的错误（这里的 g 只是一个简单的例子，实际上传递错误的函数一般还包含很多其它操作）。
这样写有些冗长，Rust 中可以在 Result 对象后添加 ? 操作符将同类的 Err 直接传递出去：

```rust
fn f(i: i32) -> Result<i32, bool> {
    if i >= 0 { Ok(i) }
    else { Err(false) }
}

fn g(i: i32) -> Result<i32, bool> {
	// 出现错误直接返回
    let t = f(i)?;
    Ok(t) // 因为确定 t 不是 Err, t 在这里已经是 i32 类型
}

fn main() {
    let r = g(10000);
    if let Ok(v) = r {
        println!("Ok: g(10000) = {}", v);
    } else {
        println!("Err");
    }
}
```
