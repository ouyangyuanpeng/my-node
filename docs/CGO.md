---
title: CGO
date: '2025-06-24 23:35:27'
meta: []
permalink: /post/cgo-yqlws.html
author:
  name: oyyp
  link: https://github.com/ouyangyuanpeng
---


<!-- more -->




# CGO

# CGO类型对应关系表格

## 1. 基本数据类型

|C类型|Go类型|CGO类型|示例|
| -------| --------| ---------| ------|
|​`char`​|​`int8`​|​`C.char`​|​`var c C.char = C.char(goInt8)`​|
|​`unsigned char`​|​`uint8`​|​`C.uchar`​|​`var uc C.uchar = C.uchar(goUint8)`​|
|​`short`​|​`int16`​|​`C.short`​|​`var s C.short = C.short(goInt16)`​|
|​`unsigned short`​|​`uint16`​|​`C.ushort`​|​`var us C.ushort = C.ushort(goUint16)`​|
|​`int`​|​`int32`​|​`C.int`​|​`var i C.int = C.int(goInt32)`​|
|​`unsigned int`​|​`uint32`​|​`C.uint`​|​`var ui C.uint = C.uint(goUint32)`​|
|​`long`​|​`int32/int64`​|​`C.long`​|​`var l C.long = C.long(goInt)`​|
|​`unsigned long`​|​`uint32/uint64`​|​`C.ulong`​|​`var ul C.ulong = C.ulong(goUint)`​|
|​`long long`​|​`int64`​|​`C.longlong`​|​`var ll C.longlong = C.longlong(goInt64)`​|
|​`unsigned long long`​|​`uint64`​|​`C.ulonglong`​|​`var ull C.ulonglong = C.ulonglong(goUint64)`​|
|​`float`​|​`float32`​|​`C.float`​|​`var f C.float = C.float(goFloat32)`​|
|​`double`​|​`float64`​|​`C.double`​|​`var d C.double = C.double(goFloat64)`​|
|​`size_t`​|​`uint`​|​`C.size_t`​|​`var size C.size_t = C.size_t(goUint)`​|
|​`_Bool`​|​`bool`​|​`C.bool`​|​`var b C.bool = C.bool(goBool)`​|

## 2. 复合数据类型

|C类型|Go类型|CGO类型|示例|
| ---------------| -------------| ---------| ------------|
|​`T[]` (数组)|​`[]T` (切片)|​`C.array`​|见下方示例|
|​`struct T`​|​`struct`​|​`C.struct_T`​|见下方示例|
|​`T*` (指针)|​`*T`​|​`*C.T`​|​`var ptr *C.int = (*C.int)(unsafe.Pointer(&goInt))`​|
|​`char*` (字符串)|​`string`​|​`*C.char`​|​`cs := C.CString(goString)`​<br />`defer C.free(unsafe.Pointer(cs))`​|

## 3. 特殊类型

|C类型|Go类型|CGO类型|示例|
| ----------| --------| ---------| --------------------------|
|​`void*`​|​`unsafe.Pointer`​|​`unsafe.Pointer`​|​`var vp unsafe.Pointer = unsafe.Pointer(&goVar)`​|
|​`void`​|-|-|用于函数返回值为空的情况|
|​`uintptr_t`​|​`uintptr`​|​`C.uintptr_t`​|​`var handle C.uintptr_t = C.uintptr_t(cgo.NewHandle(goValue))`​|
|函数指针|函数|见示例|见下方示例|

## 代码示例

### 基本类型转换

```golang
package main

/*
#include <stdlib.h>
*/
import "C"
import "fmt"

func main() {
    // Go到C的基本类型转换
    var goInt int32 = 42
    cInt := C.int(goInt)
    
    // C到Go的基本类型转换
    goIntAgain := int32(cInt)
    
    fmt.Printf("Go: %d -> C: %d -> Go: %d\n", goInt, cInt, goIntAgain)
}
```

### 字符串处理

```golang
package main

/*
#include <stdlib.h>
#include <string.h>
*/
import "C"
import (
    "fmt"
    "unsafe"
)

func main() {
    // Go字符串转C字符串
    goStr := "Hello, CGO"
    cStr := C.CString(goStr)
    // 必须手动释放C字符串内存
    defer C.free(unsafe.Pointer(cStr))
    
    // C字符串转Go字符串
    goStrAgain := C.GoString(cStr)
    
    // 字节数组转换
    goBytes := []byte{65, 66, 67, 0} // "ABC\0"
    cBytes := C.CBytes(goBytes)
    defer C.free(cBytes)
    
    // C字节数组转Go切片
    goBytesAgain := C.GoBytes(cBytes, C.int(len(goBytes)))
    
    fmt.Println(goStr, goStrAgain, goBytes, goBytesAgain)
}
```

### 结构体转换

```golang
package main

/*
typedef struct {
    int id;
    char* name;
} Person;
*/
import "C"
import (
    "fmt"
    "unsafe"
)

func main() {
    // 创建C结构体
    cPerson := C.Person{
        id:   C.int(1),
        name: C.CString("John"),
    }
    defer C.free(unsafe.Pointer(cPerson.name))
    
    // 访问C结构体字段
    goID := int(cPerson.id)
    goName := C.GoString(cPerson.name)
    
    fmt.Printf("Person: ID=%d, Name=%s\n", goID, goName)
}
```

### 数组和切片

```golang
package main

/*
#include <stdlib.h>
*/
import "C"
import (
    "fmt"
    "unsafe"
)

func main() {
    // Go切片转C数组
    goSlice := []int{1, 2, 3, 4, 5}
    
    // 分配C内存
    cArray := C.malloc(C.size_t(len(goSlice) * int(unsafe.Sizeof(goSlice[0]))))
    defer C.free(cArray)
    
    // 复制数据
    for i, v := range goSlice {
        // 计算偏移量并设置值
        ptr := unsafe.Pointer(uintptr(cArray) + uintptr(i)*unsafe.Sizeof(goSlice[0]))
        *(*C.int)(ptr) = C.int(v)
    }
    
    // C数组转Go切片
    goSliceAgain := make([]int, len(goSlice))
    for i := range goSliceAgain {
        ptr := unsafe.Pointer(uintptr(cArray) + uintptr(i)*unsafe.Sizeof(goSlice[0]))
        goSliceAgain[i] = int(*(*C.int)(ptr))
    }
    
    fmt.Println(goSlice, goSliceAgain)
}
```

### 函数指针

```golang
package main

/*
#include <stdio.h>

extern void goCallback(int);

static inline void callGoFunction(int x) {
    goCallback(x);
}
*/
import "C"
import (
    "fmt"
    "runtime/cgo"
    "unsafe"
)

//export goCallback
func goCallback(x C.int) {
    fmt.Printf("Go回调函数被C调用: %d\n", int(x))
}

// 使用cgo.Handle传递Go函数到C
func main() {
    // 直接回调
    C.callGoFunction(42)
    
    // 使用Handle传递上下文
    data := "来自Go的数据"
    handle := cgo.NewHandle(data)
    defer handle.Delete()
    
    // 将handle作为uintptr_t传递给C
    fmt.Printf("传递handle: %v\n", handle)
    C.callGoFunction(C.int(uintptr(handle)))
}
```

‍

```golang
unsafe.Pointer强制转换为char指针，&resultBuffer[0]获取切片首地址并且转换成c语言指针
(*C.char)(unsafe.Pointer(&resultBuffer[0])
```

‍

- ​`unsafe.Pointer` 是 Go 中唯一可以**在不同类型指针之间转换的中介类型**。相当于他可以吧有类型的指针转换成无类型，可以强制转换成任意指针
- ​`uintptr` 是一个**无符号整数类型**，足够大以存储任何指针的地址值

## 注意事项和陷阱

1. **内存管理**：

    - 使用`C.CString`、`C.CBytes`或`C.malloc`分配的内存必须手动调用`C.free`释放
    - 使用`defer C.free()`确保内存被释放
2. **指针安全**：

    - Go指针不能直接传递给C函数长期保存
    - 使用`cgo.Handle`安全地在C和Go之间传递数据
3. **类型大小差异**：

    - ​`int`、`long`等类型在不同平台上大小可能不同
    - 使用明确大小的类型如`int32`、`int64`避免平台差异
4. **字符串处理**：

    - Go字符串是UTF-8编码且不可变，C字符串是以null结尾的字节数组
    - 使用`C.CString`/`C.GoString`进行转换
5. **结构体对齐**：

    - C和Go的结构体内存对齐规则可能不同
    - 使用`#pragma pack`或手动计算偏移量处理对齐问题
6. **并发安全**：

    - CGO调用会阻塞Go运行时调度器
    - 长时间运行的C函数会影响Go程序的并发性能
7. **回调函数**：

    - 从C调用Go函数需要使用`//export`导出
    - 使用`cgo.Handle`安全传递上下文数据
