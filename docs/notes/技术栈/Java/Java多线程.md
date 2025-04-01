---
title: Java多线程
createTime: 2024/11/14 10:21:26
permalink: /技术栈/yjxfgcia/
---

线程上下文切换非常浪费资源，发生线程切换的时候，会利用程序计数器记录当前线程执行到那个指令

## 线程状态

java 中定义了`Thread.State`枚举中有 6 种状态

操作系统中线程有 5 种状态

1. 初始状态，在语言方法创建了线程对象，如 new Thread
2. 可运行状态，线程已经被创建等待 cpu 调用
3. 运行状态
4. 阻塞状态
5. 终止状态

## sleep 和 yield

sleep 会让线程进入阻塞状态，让出 cpu 片给其他线程执行，阻塞毫秒结束后并不会立马执行，还需要等待分配 cpu 执行时间片
yield 让线程运行状态却换为就绪状态，让出 cpu 时间片给其他同级别优先级的线程，如果没有其他优先级相同的线程，会导致不会让出 cpu 时间片继续执行

```java
Thread t1 = new Thread(()->{
    while(true){
	    // 获取当前线程的打断标识
	    boolean interrupt = Thread.currentThread().isInterrupted();
	    if(interrupt){
		    break;
	    }
    }
},"t1");
t1.start();
t1.interrupt();
```

- interrupt 打断线程，如果线程在 sleep 会抛出异常，并且会把线程的 interrupt 变成 false，如果线程没有在 sleep 那么会把对应线程的打断标志变成`true`,线程可以通过这个判断是否停止线程

## 线程安全类

- Sring
- Integer 等包装类
- StringBuffer
- Random
- Vector
- Hashtable
- java.util.concurrent 包下的类

这里说它们是线程安全的是指，多个线程调用它们同一个实例的某个方法时，是线程安全的。也可以理解为

- 它们的每个方法是原子的
- 但注意它们多个方法的组合不是原子的，见后面分析

```java
Hashtable table = new Hashtable();
//线程1，线程2
if（ table.get（"key")== null）{
	table.put("key",value);
}
上面代码会存在线程安全

1.线程1调用get方法后还没有执行put方法
2.线程2开始执行也调用了get方法也没获取到数据
3.线程1和线程2执行put导致重复执行了2次put，value发生了变化

原因Hashtable保证了单一方法的原子性，但是多个方法的组合不是原子的

因为线程1执行完get后释放了锁，然后线程2又获取了锁

```

### string 包装类

他们是不可变类

## 原子性

[参考](https://worktile.com/kb/p/2102550)

**原子性**是指在编程中，一个或多个操作在 CPU 执行过程中是不可中断的，即这些操作要么全部完成，要么全部不起作用，没有中间状态。**原子操作**通常需要硬件或操作系统的支持来保证在并发环境中的一致性。

一组操作指令不可以被中断

可以这样理解。代码如果是原子性的，那么他的代码执行不会因为线程的上下文切换导致出现并发问题，就算发生了线程的上下文切换其他线程也影响不到具有原子性的代码

可以想象 redis 的 lua 脚本，lua 脚本中包含多个指令，但是 redis 会把 lua 脚本当作一个整体，执行完这个 lua 脚本才会执行下一个，代码中也是一样，要执行完原子性的代码才会让下一个线程去执行

## synchronized

```java
synchronized(对象){
	代码（临界区）
}

public synchronized void function(){}
```

### Monitor

每一个 java 对象都可以关联一个 Monitor 对象，如果使用 synchronized 给对象上锁之后，升级到了重量级锁之后，该对象头的 markword 中就被设置指向 Monitor 指针地址

![image.png](https://image.oyyp.top/img/202503231706254.png)

在 HotSpot 虚拟机中，Monitor 是基于 C++的**ObjectMonitor 类**实现的，其主要成员包括：

- \_owner：指向持有 ObjectMonitor 对象的线程
- \_WaitSet：存放处于 wait 状态的线程队列，即调用 wait()方法的线程
- \_EntryList：存放处于等待锁 block 状态的线程队列
- \_count：约为\_WaitSet 和 \_EntryList 的节点数之和
- \_cxq: 多个线程争抢锁，会先存入这个单向链表
- \_recursions: 记录重入次数

`_cxq`  的定位与作用

- ​**用途**：`_cxq`  是一个单向链表队列，用于存放 ​**首次竞争锁失败**  的线程（如自旋失败后未进入阻塞的线程）。
- ​**设计目标**：减少锁竞争时的线程阻塞开销，提高锁分配的吞吐量（尤其在非公平锁模式下）。
- ​**与  `_EntryList`  的区别**：
  - `_cxq`：存放尚未进入阻塞的新竞争线程（未经过唤醒流程）。
  - `_EntryList`：存放被唤醒后重新竞争锁的线程（如从  `_WaitSet`  迁移的线程，或  `_cxq`  转移来的线程）。

ObjectMonitor 的基本工作机制：

（1）当多个线程同时访问一段同步代码时，首先会进入 \_EntryList 队列中。

（2）当某个线程获取到对象的 Monitor 后进入临界区域，并把 Monitor 中的 \_owner 变量设置为当前线程，同时 Monitor 中的计数器 \_count 加 1。即获得对象锁。

（3）若持有 Monitor 的线程调用 wait() 方法，将释放当前持有的 Monitor，\_owner 变量恢复为 null，\_count 自减 1，同时该线程进入 \_WaitSet 集合中等待被唤醒。

（4）在\_WaitSet 集合中的线程会被再次放到\_EntryList 队列中，重新竞争获取锁。

（5）若当前线程执行完毕也将释放 Monitor 并复位变量的值，以便其他线程进入获取锁。

ObjectMonitor::enter() 和 ObjectMonitor::exit() 分别是 ObjectMonitor 获取锁和释放锁的方法。线程解锁后还会唤醒之前等待的线程，根据策略选择直接唤醒\_cxq 队列中的头部线程去竞争，或者将\_cxq 队列中的线程加入\_EntryList，然后再唤醒\_EntryList 队列中的线程去竞争。

![image.png](https://image.oyyp.top/img/202503231708927.png)

### 轻量级锁

markword 的锁标志位默认是 01，

- 01 代表没有锁
- 00 轻量锁

加锁过程：
  当线程尝试进入  `synchronized`  代码块的时候，线程内部的栈帧中会生成一个内存区域叫做 lockrecord，里面保存了锁对象的 markword 内容的拷贝
  然后通过 cas 尝试去更新对象的 markword，修改 markword 指向当前线程 lockrecord 的指针和修改标志位为 00
  如果更新失败了可能出现两种情况：

1. 检查当前 markword 是否指向当前线程 lockrecord，如果是就再加一个 lockrecord（可重入锁），然后指向代码
2. 如果没有指向当前线程 lockrecord，说明存在锁竞争，进入锁膨胀流程

解锁过程：
检查是否还是指向当前线程那就通过CAS操作把之前拷贝在lockrecord中的还原，还原成功代表解锁成功，
如果替换失败说明有其他线程尝试获取锁，进入重量级锁解锁流程
###  ​锁的膨胀与优化

`ObjectMonitor`  是“重量级锁”的实现，但 HotSpot 通过锁膨胀策略优化性能：

1. ​**无锁状态**：初始时对象头标记为无锁（Mark Word 未关联 Monitor）。
2. ​**偏向锁**：单个线程重复获取锁时，对象头标记偏向该线程（避免 CAS）。
3. ​**轻量级锁**：多个线程轻度竞争时，通过 CAS 和自旋尝试获取锁。
4. ​**重量级锁**：竞争激烈时，对象头关联  `ObjectMonitor`，线程进入  `_EntryList`  阻塞。

### 加锁流程（以重量级锁为例）​

当线程尝试进入  `synchronized`  代码块且锁已升级为重量级锁时，流程如下：

通过 cas 尝试去更新对象的 markword，发现没有指向当前线程 lockrecord，说明存在锁竞争。
就会为对象申请Monitor对象然后修改对象的 markword指向Monitor，然后把自己加入到_EntryList中


#### ​1. 尝试快速获取锁

- ​**检查  `_owner`**：若  `_owner`  为  `NULL`（锁未被持有），线程通过 ​**CAS**  操作尝试直接获取锁：

  ```cpp
  if (CAS(&_owner, NULL, current_thread) == success) {
      _recursions = 1;  // 设置重入计数
      return;           // 成功获取锁
  }
  ```

- ​**若当前线程是锁的持有者**​（可重入），递增  `_recursions`  计数器：

  ```cpp
  if (_owner == current_thread) {
      _recursions++;
      return;           // 直接重入
  }
  ```

#### ​**2. 自旋优化（避免立即阻塞）​**

- 线程在进入阻塞前进行短暂 ​**自旋**​（循环尝试 CAS），尝试在锁释放前获取锁。
- ​**自旋条件**：
  - 锁未被释放（`_owner != NULL`）。
  - 未达到自旋次数限制（由 JVM 参数  `-XX:+UseSpinning`  和  `-XX:PreBlockSpin`  控制）。

#### ​**3. 加入竞争队列（\_cxq）​**

- ​**封装为  `ObjectWaiter`  节点**：自旋失败后，线程被封装为  `ObjectWaiter`，并插入 `_cxq`  队列头部\*\*​（CAS 操作保证线程安全）：

```cpp
 ObjectWaiter node(current_thread);
 node._next = _cxq;
 while (!CAS(&_cxq, node._next, &node)) {
     // CAS 失败则重试
 }
```

- ​**线程阻塞**：通过操作系统原语（如  `pthread_cond_wait`）挂起线程，等待被唤醒。

#### ​**4. 锁膨胀的触发条件**

- 当多个线程频繁竞争同一锁时，轻量级锁会膨胀为重量级锁，关联  `ObjectMonitor`，后续竞争直接进入重量级锁流程。

### ​ 释放锁流程

当线程执行完  `synchronized`  代码块并调用  `monitorexit`  时：

#### ​**1. 递减重入计数**

- 若当前线程是锁的持有者，递减  `_recursions`  计数器：

  ```cpp
  _recursions--;
  if (_recursions != 0) {
      return;  // 未完全释放锁（仍处于重入状态）
  }
  ```

#### ​**2. 完全释放锁**

- ​**清空  `_owner`**：将  `_owner`  设为  `NULL`，表示锁已释放：

  ```cpp
  _owner = NULL;  // 释放锁
  ```

#### ​**3. 唤醒等待线程**

这里会根据策略选择直接唤醒\_cxq 队列中的头部线程去竞争，或者将\_cxq 队列中的线程加入\_EntryList，然后再唤醒\_EntryList 队列中的线程去竞争。

- ​**处理  `_cxq`  队列**：

  - 若  `_cxq`  非空，将其所有节点一次性移动到  `_EntryList`（头插法或尾插法，取决于 JVM 实现）。

  ```cpp
  if (_cxq != NULL) {
      ObjectWaiter* q;
      do {
          q = _cxq;
      } while (!CAS(&_cxq, q, NULL));  // 清空 _cxq
      // 将 q 附加到 _EntryList
      if (_EntryList == NULL) {
          _EntryList = q;
      } else {
          // 遍历到 _EntryList 尾部并链接 q（或头插）
      }
  }
  ```

- ​**唤醒  `_EntryList`  头部线程**：

  ```cpp
  if (_EntryList != NULL) {
      Thread* to_unlock = _EntryList._thread;
      _EntryList = _EntryList._next;
      unpark(to_unlock);  // 唤醒线程（通过操作系统原语）
  }
  ```

- ​**若  `_EntryList`  为空**：从  `_WaitSet`（调用  `wait()`  的线程）迁移线程到  `_EntryList`，再唤醒。

## ThreadLocal 内存泄露

https://cloud.tencent.com/developer/article/2355282

## 注意

使用线程对象的 stop()方法停止线程

- stop 方法会真正杀死线程，如果这时线程锁住了共享资源，那么当它被杀死后就再也没有机会释放锁，其它线程将永远无法获取锁
  使用 System.exit(int)方法停止线程
- 目的仅是停止一个线程，但这种做法会让整个程序都停止
