---
title: JDK1.8升级到JDK17新特性
createTime: 2024/11/14 10:21:26
permalink: /技术栈/na3nwzan/
---
## JDK14 新特性

### 支持文本块

```java
        //原始
        String before = "{\n" +
                        "     \"name\":\"cyk\",\n" +
                        "     \"age\": 20;\n" +
                        "}";
        //增强
        String after = """
                      {
                          "name": "cyk",
                          "age": 20
                      }
                      """;
```

### instanceof 类型转换

以往 instanceof 只能帮我们检查数据类型是否符合，JDK14 中不仅可以进行类型匹配，还会将匹配到的类型直接赋值新的引用，简化了开发，提高了可读性.

```java
        Object val = "aaa";

        //before
        if(val instanceof String) {
            String newVal = (String) val;
            System.out.println(newVal);
        }
        //after
        if(val instanceof String newVal) {
            System.out.println(newVal);
        }
```

## JDK17 新特性

### switch 增强

JDK17 中的 switch 主要是使用 -> 替代了 break 语句，看上去更加简洁.

```java
        //1.字符串匹配
        String val1 = "aaa";

        //before
        switch (val1) {
            case "abc":
                System.out.println("abc!");
                break;
            case "aaa":
                System.out.println("aaa!");
                break;
            default:
                System.out.println("error!");
        }
        //after
        switch (val1) {
            case "abc" -> System.out.println("abc!");
            case "aaa" -> System.out.println("aaa");
            default -> System.out.println("error");
        }
```

```java
        //2.类型判断
        Object val2 = "aaa";

        //before
        if(val2 instanceof String) {
            String newVal = (String) val2;
            System.out.println("String:" + newVal);
        } else if(val2 instanceof Integer) {
            Integer newVal = (Integer) val2;
            System.out.println("Integer:" + newVal);
        } else {
            System.out.println(val2);
        }

        //after
        switch (val2) {
            case String str -> {
                String newVal = str;
                System.out.println("String:" + newVal);
            }
            case Integer num -> {
                Integer newVal = num;
                System.out.println("Integer:" + newVal);
            }
            default -> System.out.println(val2);
        }
```

```java
        //3.对 null 的处理
        String val3 = null;
        switch (val3) {
            case null -> System.out.println("null!");
            case "aaa" -> System.out.println("aaa!");
            case "bbb" -> System.out.println("bbb!");
            default -> System.out.println("error");
        }
```

```java
        //4.对条件判断的处理
        Object obj = 1;
        switch (obj) {
            case String str -> {
                String newVal = str;
                System.out.println("String:" + newVal);
            }
            case Integer num && num < 3 -> {
                Integer newVal = num;
                System.out.println("Integer:" + newVal);
            }
            default -> System.out.println("error!");
        }
```

### 记录（Records）

`Record` 是一种特殊的类，用于简化数据类的创建，它会自动生成构造器、`equals`、`hashCode` 和 `toString` 方法。

```java
// JDK 17
public record Point(int x, int y) {}

Point point = new Point(10, 20);
System.out.println(point.x()); // 输出: 10
System.out.println(point.y()); // 输出: 20
System.out.println(point);     // 输出: Point[x=10, y=20]

```

### 密封类（Sealed Classes）

密封类限制哪些类可以继承它，用于更精细地控制类层次结构。

```java
// JDK 17
public sealed class Shape
    permits Circle, Square { }

public final class Circle extends Shape { }
public final class Square extends Shape { }

```

### 局部变量类型推断 (`var`)

`var` 关键字允许在本地变量声明时省略类型，编译器会自动推断类型。

```java
// JDK 10+
var list = List.of("apple", "banana", "cherry");
for (var fruit : list) {
    System.out.println(fruit);
}

```

### 新的垃圾回收器

jdk17 中引入了新的垃圾回收器

目前正常微服务综合内存占用+延迟+吞吐量，还是 G1 更优秀。但是如果你的微服务本身压力没到机器极限，要求延迟低，那么 ZGC 最好。如果你是实现数据库那样的需求（大量缓存对象，即长时间生存对象，老年代很大，并且还会可能分配大于区域的对象），那么必须使用 ZGC。

在一个只有 2GB 内存和 2 核 CPU 的服务器上，G1GC 是更好的选择，因为它更适合这种资源受限的环境。如果将来你的应用需要迁移到更大的服务器，并且对延迟有更高的要求，那么你可以考虑使用 ZGC。如果你有更高的内存和 CPU 资源，并且应用对延迟特别敏感，那么 ZGC 是一个很好的选择。在更大的服务器上，例如 8GB 内存、4 核或以上的环境，ZGC 的低延迟特性将会非常有用。

`-XX:+UseG1GC` 或者 `-XX:+UseZGC`
在 JDK 17 中，`-XX:+UseParallelOldGC` 是用于启用并行老年代垃圾回收的选项。然而，ZGC 是一种全新的垃圾回收器，不再依赖于并行垃圾回收器或并行老年代垃圾回收器。
因此，如果你决定使用 ZGC，不再需要 `-XX:+UseParallelOldGC` 这个选项。ZGC 会自动处理老年代的垃圾回收，并且它的设计目标之一就是降低垃圾收集的停顿时间。
