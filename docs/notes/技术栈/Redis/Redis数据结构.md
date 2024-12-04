[官方文档地址]([了解 Redis 数据类型 |文档](https://redis.io/docs/latest/develop/data-types/))

## String（字符串）

[Redis 字符串](https://redis.io/docs/latest/develop/data-types/strings/)是最基本的 Redis 数据类型，表示一个字节序列。

默认情况下，单个 Redis 字符串的最大大小为 512 MB。

```bash
# SET key value
SET bike:1 Deimos
OK
# GET key
GET bike:1
"Deimos"
```

## Hash（哈希）

类似 java 中的 hashmap

### 基本命令

- [`HSET：`](https://redis.io/docs/latest/commands/hset/)设置哈希值上一个或多个字段的值。
- [`HGET：`](https://redis.io/docs/latest/commands/hget/)返回给定字段的值。
- [`HMGET：`](https://redis.io/docs/latest/commands/hmget/)返回一个或多个给定字段的值。
- [`HINCRBY`](https://redis.io/docs/latest/commands/hincrby/)：将给定字段的值增加提供的整数。

```bash
# key=redis的key field 相当于map中的 key
HSET key field value [field value ...]

HSET myhash field1 "Hello"
(integer) 1
HGET myhash field1
"Hello"
HSET myhash field2 "Hi" field3 "World"
(integer) 2
HGET myhash field2
"Hi"
HGET myhash field3
"World"
```

### 应用场景

- 购物车
  - 以用户 id 为 key，商品 id 为 field，商品数量为 value
- 存储对象
  - 比直接用字符串存储对象更加灵活，可以修改对应字段
  - 一般对象用 string + json 存储，对象中某些频繁变化的属性抽出来用 hash 存储。
- 计数器（限流）

### 底层实现数据结构

hash 的底层存储有两种数据结构，一种是 ziplist，另外一种是 hashtable。

hash 对象只有同时满足以下条件，才会采用 ziplist 编码：

- hash 对象保存的键和值字符串长度都小于 64 字节
- hash 对象保存的键值对数量小于 512 ziplist 存储的结构如下
  ![image.png](https://image.oyyp.top/img/202411261503216.png)

## Lists（列表）

[Redis 数据结构：List 类型全面解析-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2463431)

- 有序，按照插入顺序排序
- 元素可重复
- 插入和删除快
- 查询速度一般
- 列表对于两端的操作性能较高 ,  对于通过索引下标查询元素的性能较低 ;
- 是字符串列表
- 本质是双向链表  , 可以将字符串元素添加到列表的头部或尾部
- 最大长度为 2^32 - 1 （4,294,967,295） 个元素。

根据 Redis 双向列表的特性，因此其也被用于异步队列的使用。实际开发中将需要延后处理的任务结构体序列化成字符串，放入 Redis 的队列中，另一个线程从这个列表中获取数据进行后续处理。

### 基本命令

- [`LPUSH`](https://redis.io/docs/latest/commands/lpush/)  将新元素添加到列表的头部;[`RPUSH`](https://redis.io/docs/latest/commands/rpush/)  添加到尾部。
- [`LPOP`](https://redis.io/docs/latest/commands/lpop/)  从列表的头部删除并返回一个元素;[`RPOP`](https://redis.io/docs/latest/commands/rpop/)  执行相同的操作，但从列表的尾部开始。
- [`LLEN`](https://redis.io/docs/latest/commands/llen/)  返回列表的长度。
- [`LMOVE`](https://redis.io/docs/latest/commands/lmove/)  以原子方式将元素从一个列表移动到另一个列表。
- [`LRANGE`](https://redis.io/docs/latest/commands/lrange/)  从列表中提取一系列元素。
- [`LTRIM`](https://redis.io/docs/latest/commands/ltrim/)  将列表缩减到指定的元素范围。
- [`BLPOP`](https://redis.io/docs/latest/commands/blpop/)  从列表的头部删除并返回一个元素。 如果列表为空，则命令将阻止，直到元素可用或达到指定的超时。
- [`BLMOVE`](https://redis.io/docs/latest/commands/blmove/)  以原子方式将元素从源列表移动到目标列表。 如果源列表为空，则命令将阻塞，直到有新元素可用。

### 应用场景

- 实现堆栈和队列。
- 消息队列可以利用 List 的 push 和 pop 操作，实现生产者消费者模型。(只支持单消费者，获取消息后处理失败无法恢复)
- 时间线、动态消息：比如微博的时间线，可以将最新的内容放在 List 的最前面。
- 常用来存储一个有序数据，例如：朋友圈点赞列表，评论列表等

### 底层实现数据结构

底层由  **快速链表 QuickList** （快速链表是链表和压缩列表结合起来的产物 ） 实现

- 在 3.2 版本之前，Redis List 底层采用**压缩链表 ZipList**和**双向链表 LinkedList**来实现 List。当元素数量小于 512 并且元素大小小于 64 字节时采用 ZipList 编码，超过则将自动采用 LinkedList 编码
- 在 3.2 版本之后，Redis 统一采用**快速链表 QuickList**来实现 List

不使用LinkedLis的原因： 使用LinkedList的附加空间相对太高，因为 64bit 系统中指针是 8 个字节，所以 prev 和 next 指针需要占据 16 个字节，且链表节点在内存中单独分配，会加剧内存的碎片化，影响内存管理效率

#### 压缩列表 ZipList

ZipList 是一种特殊的“双端链表”（并非链表），由一系列特殊编码的**连续内存块**组成，像内存连续的数组。可以在任意一端进行压入/弹出操作，并且该操作的时间复杂度为 O(1)。

压缩列表底层数据结构：本质是一个数组，增加了列表长度、尾部偏移量、列表元素个数、以及列表结束标识，有利于快速寻找列表的首尾节点；但对于其他正常的元素，如元素 2、元素 3，只能一个个遍历，效率仍没有很高效。

当我们的 List 列表数据量比较少的时候，且存储的数据轻量的（如小整数值、短字符串）时候， Redis 就会通过压缩列表来进行底层实现。
ZipList 虽然节省内存，但申请内存必须是连续空间，如果内存占用较多，申请效率较低。

问题 1：ZipList 虽然节省内存，但申请内存必须是连续空间，如果内存占用较多，申请内存效率很低。怎么办?
为了缓解这个问题，我们必须限制 ZipList 的长度和 entry 大小。

问题 2：但是我们要存储大量数据，超出了 ZipList 最佳的上限该怎么办?
我们可以创建多个 ZipList 来分片存储数据。

问题 3：数据拆分后比较分散，不方便管理和查找，这多个 ZipList 如何建立联系?
Redis 在 3.2 版本引入了新的数据结构 QuickList，它是一个双端链表，只不过链表中的每个节点都是一个 ZipList。

#### 快速链表 QuickList

QuickList 底层 LinkedList + ZipList，可以从双端访问，内存占用较低，保含多个 ZipList，存储上限高。其特点：

- 是一个节点为 ZipList 的双端链表
- 节点采用 ZipList，解决了传统链表的内存占用问题
- 控制了 ZipList 大小，解决连续内存空间申请效率问题
- 中间节点可以压缩，进一步节省了内存(中间节点访问频次低，可以压缩，头尾访问频次高)

## Set（集合）

[Redis 数据结构：Set 类型全面解析-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2343213)

- 唯一，不可重复
- 无序

### 基本命令

- [`SADD`](https://redis.io/docs/latest/commands/sadd/)  将新成员添加到集合中，存在不添加返回。
- [`SREM`](https://redis.io/docs/latest/commands/srem/)  将从集中删除指定的成员。
- [`SISMEMBER`](https://redis.io/docs/latest/commands/sismember/)  测试字符串的集成员身份。
- [`SINTER`](https://redis.io/docs/latest/commands/sinter/)  返回两个或多个集合共有的成员集（即交集）。
- [`SCARD`](https://redis.io/docs/latest/commands/scard/)  返回集合的大小 （也称为基数） 。

请参阅  [set 命令的完整列表](https://redis.io/docs/latest/commands/?group=set)。

### 应用场景

常见的应用场景有：投票系统、标签系统、共同好友、共同关注、共同爱好、抽奖、商品筛选栏，访问 IP 统计等

- 标签：比如我们博客网站常常使用到的兴趣标签，把一个个有着相同爱好，关注类似内容的用户利用一个标签把他们进行归并。
- 统计网站的独立 IP。利用 set 集合当中元素唯一性，可以快速实时统计访问网站的独立 IP。
- 执行常见的集操作，例如交集、并集和差集。
- 点赞、踩、收藏：Set 类型可以保证一个用户只能点一个赞；
- 共同关注、标签：Set 类型支持交集运算，所以可以用来计算共同关注的好友、公众号等；
- 抽奖活动：存储某活动中中奖的用户名 ，Set 类型因为有去重功能，可以保证同一个用户不会中奖两次

### 底层实现数据结构

redis 的集合对象 set 的底层存储结构，底层使用了 intset 和 hashtable 两种数据结构存储的，intset 我们可以理解为数组，hashtable 就是普通的哈希表（key 为 set 的值，value 为 null）。

set 的底层存储 intset 和 hashtable 是存在编码转换的，使用**intset**存储必须满足下面两个条件，否则使用 hashtable，条件如下：

- 集合对象保存的所有元素都是整数值
- 集合对象保存的元素数量不超过 512 个 （REDIS_SET_MAX_INTSET_ENTRIES 可以配置）

#### intset 的数据结构

intset 内部其实是一个数组（int8_t coentents[]数组），而且存储数据的时候是有序（大小排序）的，因为在查找数据的时候是通过二分查找来实现的。

### 性能

大多数集合操作（包括添加、删除和检查项是否为集合成员）都是 O（1）。 这意味着它们的效率很高。 但是，对于具有数十万个或更多成员的大型集，在运行  [`SMEMBERS`](https://redis.io/docs/latest/commands/smembers/)  命令时应小心谨慎。 此命令为 O（n） ，并在单个响应中返回整个集合。 作为替代方法，请考虑使用  [`SSCAN，`](https://redis.io/docs/latest/commands/sscan/)它允许您以迭代方式检索集的所有成员。

## Sorted Set（有序集合）

- 元素唯一且有序

### 基本命令

- [`ZADD`](https://redis.io/docs/latest/commands/zadd/)  将新成员和关联的分数添加到排序集。如果该成员已存在，则更新分数。
- [`ZRANGE`](https://redis.io/docs/latest/commands/zrange/)  返回在给定范围内排序的排序集的成员。
- [`ZRANK`](https://redis.io/docs/latest/commands/zrank/)  返回所提供成员的排名，假设排序按升序排列。
- [`ZREVRANK`](https://redis.io/docs/latest/commands/zrevrank/)  返回所提供成员的排名，假设排序集按降序排列。

请参阅[排序集命令的完整列表](https://redis.io/docs/latest/commands/?group=sorted-set)。

### 应用场景

- 排行榜

### 底层实现数据结构

压缩列表 zipList，与跳跃列表 skipList。这两种实现对于用户来说是透明的，但用户写入不同的数据，系统会自动使用不同的实现。 只有同时满足配置文件 redis.conf 中相关集合元素数量阈值与元素大小阈值两个条件，使用的就是压缩列表 zipList，只要有一个条件不满足使用的就是跳跃列表 skipList。例如，对于 ZSet 集合中这两个条件如下：

- 集合元素个数小于 redis.conf 中 zset-max-ziplist-entries 属性的值，其默认值为 128
- 每个集合元素大小都小于 redis.conf 中 zset-max-ziplist-value 属性的值，其默认值为 64 字节

#### skipList 跳跃列表

skipList，跳跃列表，简称跳表，是一种随机化的数据结构，基于并联的链表，实现简单， 查找效率较高。简单来说跳表也是链表的一种，只不过它在链表的基础上增加了跳跃功能。 也正是这个跳跃功能，使得在查找元素时，能够提供较高的效率。

### 性能

大多数排序集操作是 O（log（n）），其中  *n*  是成员数。

在运行具有较大返回值（例如，数万或更多）的  [`ZRANGE`](https://redis.io/docs/latest/commands/zrange/)  命令时要小心。 此命令的时间复杂度为 O（log（n） + m），其中  *m*  是返回的结果数。

## Stream（流信息）

Streams 是一种仅追加的数据结构

### 基本命令

- [`XADD`](https://redis.io/docs/latest/commands/xadd/)  将新条目添加到流中。
- [`XREAD`](https://redis.io/docs/latest/commands/xread/)  读取一个或多个条目，从给定位置开始并在时间上向前移动。
- [`XRANGE`](https://redis.io/docs/latest/commands/xrange/)  返回两个提供的条目 ID 之间的条目范围。
- [`XLEN`](https://redis.io/docs/latest/commands/xlen/)  返回流的长度。

请参阅  [stream 命令的完整列表](https://redis.io/docs/latest/commands/?group=stream)。

### 应用场景

- 事件溯源（例如，跟踪用户操作、点击等）
- 传感器监控（例如，来自现场设备的读数）
- 通知（例如，将每个用户的通知记录存储在单独的数据流中）
- 订阅发布
- 消息队列

### 底层实现数据结构

- Redis `Stream` 的底层数据结构是基于 **Radix Tree**（压缩字典树）和 **双端链表** 的组合。
- **Radix Tree 的作用：**
    - 用于高效存储 Stream 的消息数据（ID 和消息内容）。
    - 压缩存储相同前缀的消息 ID，节省内存空间。

## geospatial（地理空间）

Redis 地理空间索引允许您存储坐标并进行搜索。 此数据结构可用于查找给定半径或边界框内的附近点。

### 基本命令

- [`GEOADD`](https://redis.io/docs/latest/commands/geoadd/)  将位置添加到给定的地理空间索引中（请注意，此命令的经度位于纬度之前）。
- [`GEOSEARCH`](https://redis.io/docs/latest/commands/geosearch/)  返回具有给定半径或边界框的位置。

请参阅[地理空间索引命令的完整列表](https://redis.io/docs/latest/commands/?group=geo)。

### 应用场景

- 查找附近多少 km 的充电站或者其他
- 实时位置
- 最近距离，最远距离

### 底层数据结构

## Bitmap（位图）

## Bitfields（位域）
