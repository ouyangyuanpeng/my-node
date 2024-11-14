---
title: Dart语法
createTime: 2024/11/14 10:21:26
permalink: /技术栈/q754wf5z/
---
flutter 依赖于 dart,需要掌握

[dart 命令参考](https://dart.cn/tools/dart-tool/)

入口类

```dart
void main(){

}

main(){

}

// 以下是接受参数的命令行应用程序的main（）函数示例： 执行方式 dart cs.dart 1,2  1,2是参数
void main(List<String> arguments) {
  print(arguments);

  assert(arguments.length == 2);
  assert(int.parse(arguments[0]) == 1);
  assert(arguments[1] == 'test');
}

```

## 变量

[变量 | Dart](https://dart.cn/language/variables/)

使用 `var` 声明
支持类型推断
变量大小写敏感 age 和 AGE 不是一个变量

```dart
void main() {
  var age = 10;
  int AGE = 10;
  var str = "10";
  String STR = "10";
  print(age);
  print(str);

  //允许为null 后续使用这个变量的时候不会进行判断是否null
  String? name;
  // 不加？默认是非空变量 如果没有设置值，使用这个变量编译器提示错误
  String NAME;
  // 声明多个变量
  var (a, b) = ('left', 'right');
}

```

### 交换两个变量的值

```dart
var (a, b) = ('left', 'right');
(b, a) = (a, b); // 交换.
print('$a $b'); // Prints "right left".
```

### as is ?? 关键字操作符

[Operators | Dart](https://dart.cn/language/operators/)

> **as：类型转换**

只有你确定这个对象是该类型的时候，才可以使用 as 把对象转换为特定的类型

(employee as Person).firstName = 'xxxx';

> **is：如果对象是指定类型则返回 true**
>
> **is!：如果对象是指定类型则返回 false**

在你不确定这个对象类型的时候，用作判断是否是该类型检测。

if（str is String）{}

> **赋值运算符=、??=**

a = value;

b ??= value;//判断 b 是否为 null，如果为 null，value 为 b 的默认值。

### 常量（final const）

虽然  `final`  对象不能被修改，但它的字段可能可以被更改。相比之下，`const`  对象及其字段不能被更改：它们是  **不可变的**。

请使用  `const`  修饰  **编译时常量**  的变量。如果 const 变量位于类级别，请将其标记为  `static const`（静态常量）。在声明变量的位置，将其值设置为编译时常量，比如数字、字符串、`const`  常量或在常量数字上进行的算术运算的结果：

```dart
void main(){
   // 常量
   // final 可以不赋值 只能赋值一次，const 必须赋值
   final A;
   final String nickname = 'Bobby';
   const B = 100;
   const baz = [];
}

```

实例变量可以是  `final`  但不能是  `const`：

```dart
class User {
  String name;

  User(this.name);

}

void main() {
  // 错误不能使用const声明实例变量 如果需要使用const,那就添加const修饰的构造函数
  const a = User("欧阳");
  // 实例变量可以使用final
  final b = User("欧阳");
}

```

需要使用 const

```dart
class User {
  String name;

   const User(this.name);

}

void main() {
  // 调用 const 构造函数
  const a = User("欧阳");
  // a和b不是一个变量 调用的不是const修饰的构造函数
  final b = User("欧阳");
  final c = const User("欧阳");
  // 比较两个变量是否指向同一个内存地址
  print(identical(a, b)); // false
  print(identical(a, c)); // true

}

```

`const`  关键字不仅仅可用于声明常量，你还可以使用它来创建常量  **值(values)**，以及声明  **创建(create)**  常量值的构造函数。任何变量都可以拥有常量值。

```dart
// 使用const修饰的列表，长度无法改变，final修饰可以改变常量
var foo = const [];
final bar = const [];
const baz = []; // 等于 `const []`
```

### 延迟初始化变量（late）

`late`  修饰符有两种用法：

- 声明一个非空变量，但不在声明时初始化。
- 延迟初始化一个变量。

通常 Dart 的语义分析可以检测非空变量在使用之前是否被赋值，但有时会分析失败。常见的两种情况是在分析顶级变量和实例变量时，Dart 通常无法确定它们是否已设值，因此不会尝试分析。

如果你确定变量在使用之前已设置，但 Dart 推断错误的话，可以将变量标记为  `late`  来解决这个问题：

```dart
late String description;

void main() {
  description = 'Feijoada!';
  print(description);
}
```

当一个  `late`  修饰的变量在声明时就指定了初始化方法，那么内容会在第一次使用变量时运行初始化。这种延迟初始化在以下情况很方便：

- （Dart 推断）可能不需要该变量，并且初始化它的开销很高。
- 你正在初始化一个实例变量，它的初始化方法需要调用  `this`。

在下面的例子中，如果  `temperature`  变量从未被使用，则  `readThermometer()`  这个开销较大的函数也永远不会被调用：

```dart
// 这是程序对readTherometeter（）的唯一调用
late String temperature = readThermometer(); // Lazily initialized.
```

## 包导入

[Libraries | Dart](https://dart.cn/language/libraries/)

```dart
// 导入dart提供的
import 'dart:html';
// 导入第三方库 导入第三方库需要在更目录添加 pubspec.yaml文件，使用dart pub get拉取
import 'package:test/test.dart';
//导入自己定义的
import './lib/test.dart';

// 只导入fool.
import 'package:lib1/lib1.dart' show foo;

// 不导入foo.
import 'package:lib2/lib2.dart' hide foo;

// 延时加载，使用时才加载需要配合as使用
import 'package:greetings/hello.dart' deferred as hello;


```

## operator 关键字

他是运算符重载

1. `将操作符重载实现为类的成员函数；`
2. `操作符重载实现为非类的成员函数（即全局函数）`

```dart
class Person
{
   int age;
   public Person(int nAge){
         this->age = nAge;
   }
   // 重载 ==
   bool operator==(Person ps){
   if (this.age == ps.age) {
        return true;
    }
        return false;
  }
};

int main()
{
    Person p1 = new Person(10);
    Person p2 = new Person(10);
   // 调用bool operator==(Person ps) 函数
    if (p1 == p2) {

     } else {

     }
    return 0;
}
```

```dart
class ColorSwatch<T> extends Color {
  final Map<T, Color> _swatch;

  const ColorSwatch(super.primary, this._swatch);
  /// 重载 []，那么可以通过ColorSwatch[]来直接访问
  Color? operator [](T index) => _swatch[index];

}

// 使用
ColorSwatch[100]


```

## 数据类型

[数据类型参考文档](https://dart.cn/language/built-in-types/)

- String
- int
- double
- bool
- List
- num (可以是 double 和 int)

注：具有可空类型的未初始化变量的初始值为  `null`即使是具有数值类型的变量，初始值也为空，因为数字（就像 Dart 中的其他所有东西一样）都是对象。

### 字符串 String

```dart
void main(){

	// 字符串变量申明
	var str1 = "你好";
	String str2 = "世界";

	// 多行字符串
	String str3 = """
	你好，世界
	你好，世界
	你好，世界
	""";

	// 字符串拼接
	String str4 = "你好";
	String str5 = "世界";
	print("$str4 $str5")
	print(str4+str5)
	print("实例变量：${object.username}")
	String result = a["iv"] + a["data"];
	String result1 = "$iv$data";
}
```

### 数值类型

int 整型
double 可以是整型也可以是浮点型

```dart
void main(){
	int int1 = 10;
	double double1 = 10
	double double2 = 10.1;
}
```

### 布尔类型

```dart
void main(){
	bool bool1 = true;
}
```

### list

参考文档：[Collections | Dart](https://dart.cn/language/collections/)

```dart
void main() {
  // 可以存放任何值
  var list1 = ["str", 10, true];
  // 长度
  print(list1.length);
  // 获取值
  print(list1[0]);

  //第二种创建 指定类型
  var strs = <String>["str1", "str2"];
  List<int> ints = [1, 2];

  //第三种创建空集合,可以存放任何类型
  var l1 = [];
  // 添加数据
  l1.add("str");
  l1.add(100);

  var list = [1, 2, 3];
  var list2 = [0, ...list];
  assert(list2.length == 4);

  // 防止list为null ,null空不把list存入
  var list2 = [0, ...?list];
  assert(list2.length == 1);
  // 常量list 不可改变
  var list3 = const [1,2,3]
}

```

### Sets

无序不重复集合

```dart
void main() {
  Set<int> a = {1, 2, 3};
  var seti = {1, "2", 3};

  var names = <String>{};
  var elements = <String>{};
  elements.add('fluorine');
  elements.addAll(names);

  final constantSet = const {
    'fluorine',
    'chlorine',
    'bromine',
    'iodine',
    'astatine',
  };
}
```

### Maps

```dart
void main() {
  var gifts = {
    // Key:    Value
    'first': 'partridge',
    'second': 'turtledoves',
    'fifth': 'golden rings'
  };

  Map<String, String> gifts = {
    // Key:    Value
    'first': 'partridge',
    'second': 'turtledoves',
    'fifth': 'golden rings'
  };

  var nobleGases = {
    2: 'helium',
    10: 'neon',
    18: 'argon',
  };
 var nobleGases = <String,String>{
    2: 'helium',
    10: 'neon',
    18: 'argon',
  };

  var gifts1 = Map<String, String>();
  gifts['first'] = 'partridge';
  gifts['second'] = 'turtledoves';
  gifts['fifth'] = 'golden rings';

  var nobleGases1 = Map<int, String>();
  nobleGases[2] = 'helium';
  nobleGases[10] = 'neon';
  nobleGases[18] = 'argon';

  print(nobleGases[2])

}

```

使用 Map 构造函数创建相同的对象:

```dart
var gifts = Map<String, String>();
gifts['first'] = 'partridge';
gifts['second'] = 'turtledoves';
gifts['fifth'] = 'golden rings';

var nobleGases = Map<int, String>();
nobleGases[2] = 'helium';
nobleGases[10] = 'neon';
nobleGases[18] = 'argon';
```

如果您查找不在 map 中的键，则返回 null：

```dart
var gifts = {'first': 'partridge'};
assert(gifts['fifth'] == null);
```

### 集合一些不常用

```dart
void main() {

  var listOfInts = [1, 2, 3];
  var listOfStrings = ['#0', for (var i in listOfInts) '#$i'];

  print(listOfStrings); // [#0, #1, #2, #3]
  var promoActive = false;
  var nav = ['Home', 'Furniture', 'Plants', if (promoActive) 'Outlet'];
  print(nav); // [Home, Furniture, Plants]

}

```

```dart
void main() {
  var login = "Manager";
  var nav = [
    'Home',
    'Furniture',
    'Plants',
    if (login case 'Manager') 'Inventory'
  ];
  print(nav);// [Home, Furniture, Plants, Inventory]
}
```

## 模式匹配

### Switch

```dart
void main() {
  var number = 1;

  switch (number) {
    case 1:
      print("one"); // 匹配成功
  }

  const a = 'a';
  const b = 'b';
  var obj = ["a", "b"];
  switch (obj) {
    // obj是一个长度为2的列表
    // 如果obj的值是'a','b'
    case [a, b]: //obj是一个长度为2的列表并且分别是a和b匹配成功
      print('$a, $b');
  }
}

```

```dart
var numList = [1, 2, 3];
// 把列表的值按序分配给abc
var [a, b, c] = numList;
print(a + b + c); // 6
```

```dart
void main() {
  var list = ["a", "c"];
  switch (list) {
    // 如果list[0]是a或者b那么c=list[0]
    case ['a' || 'b', var c]:
      print(c); // c
  }
}

```

## 循环

参考文档：[Loops | Dart](https://dart.cn/language/loops/)

```dart
var message = StringBuffer('Dart is fun');
for (var i = 0; i < 5; i++) {
  message.write('!');
}

var callbacks = [];
for (var i = 0; i < 2; i++) {
  // 把函数对象添加到callbacks中
  callbacks.add(() => print(i));
}

for (final c in callbacks) {
  // 调用callbacks中的函数
  c(); // 0 1
}
```

```dart
var collection = [1, 2, 3];
collection.forEach(print); // 1 2 3
```

## 分支

[Branches | Dart](https://dart.cn/language/branches/)

## 错误处理

[Error handling | Dart](https://dart.cn/language/error-handling/)

```dart
throw FormatException('Expected at least 1 section');

// 可以抛出任意对象
throw 'Out of llamas!';
```

```dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  // A specific exception
  buyMoreLlamas();
} on Exception catch (e) {
  // 如果是这个异常，进入并且把错误参数赋值给e
  print('Unknown exception: $e');
} catch (e,s) {
  // 没有指定类型处理全部 e为错误类型 s为错误详细
  print('Something really unknown: $e');
}
```

```dart
void misbehave() {
  try {
    // dynamic允许任意类型 并且可以调用任何方法只有在运行的时候才出错误
    dynamic foo = true;
    print(foo++); // Runtime error
  } catch (e) {
    print('misbehave() partially handled ${e.runtimeType}.');
    rethrow; // Allow callers to see the exception.
  }
}

void main() {
  try {
    misbehave();
  } catch (e) {
    print('main() finished handling ${e.runtimeType}.');
  }
}
```

## 运算符

参考地址：[Operators | Dart](https://dart.cn/language/operators/)

## 函数

```dart
bool isNoble(int atomicNumber) {
  return _nobleGases[atomicNumber] != null;
}

// 函数只有一个表达式
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;


/// 命名参数
void enableFlags({bool? bold, bool? hidden}) {...}
/// 调用命名参数函数
enableFlags(bold: true, hidden: false);


/// 如果参数为null设置默认值
void enableFlags({bool bold = false, bool hidden = false}) {...}

/// 强制参数不能为null 参数添加 required
void enableFlags({required bool bold, required bool hidden}) {};

/// 可选参数使用 []包裹，可以传也可以不传 必须添加？
String say(String from, String msg, [String? device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}

// 接受2个参数，一个Key 一个child key接受后传递给父类
const Scrollbar({super.key, required Widget child});


// 匿名函数
var myFunction = () {
    print('Hello, World!');
  };
 // 调用匿名函数
myFunction();

// 返回多个值
(String, int) foo() {
  return ('something', 42);
}


```

泛型方法

```dart
T first<T>(List<T> ts) {
  // Do some initial work or error checking, then...
  T tmp = ts[0];
  // Do some additional checking or processing...
  return tmp;
}
```

## 类与对象

[Classes | Dart](https://dart.cn/language/classes/)

### 构造函数

```dart
class Person {
  String? username;
  String? password;

  /// 普通构造函数
  Person(this.username, this.password);


  /// 1.会去调用有参构造函数 this.username相当于简写了对象赋值，创建对象后直接赋值
  // Person.createPerson1(this.username,this.password)

  Person.createPerson2({String? username ,String? password}){
    Person(username,password);
  }


  /// 工厂构造函数需要有返回值,这种写法返回一个子类的对象，会去调用子类构造函数返回子类对象
  factory Person.createObj({String? username, String? password}) = Job;

  // 通过工厂构造函数返回指定对象
  factory Person.createObj2({String? username, String? password}){
    return Person(username,password);
  }

  /// 通过命名参数做json转换
  Person.formJson(Map<String, String> map) {
    Person(map["username"], map["password"]);
  }

  /// 对象转json
  Map<String, String> toJosn(Person person) {
    return {
      "username": person.username!,
      "password": person.password!,
    };
  }
}

class Job extends Person {
  String? jobTitle;

  /// :后是在构造函数方法体里面内容执行之前执行的方法，这里是执行父类的构造函数
  Job({String? username, String? password,String? jobTitle}):super(username,password);
}
```
