`HashMap`  是基于哈希表实现的，它由数组和链表（或红黑树）组成。JDK 1.8 之后，`HashMap`  引入了红黑树来优化链表过长时的查询性能。

- **数组**：`HashMap`  的主体是一个  `Node<K,V>[] table`  数组，每个数组元素是一个链表或红黑树的头节点。
- **链表**：当哈希冲突发生时，冲突的键值对会以链表的形式存储。
- **红黑树**：当链表长度超过阈值（默认是 8）时，链表会转换为红黑树，以提高查询效率。

### 核心源码解析

####  Node 节点

`HashMap`  中的每个键值对都是一个  `Node`  对象，定义如下：

```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash; // 键的哈希值
    final K key;    // 键
    V value;        // 值
    Node<K,V> next; // 下一个节点（链表结构）

    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }
}
```

#### 核心属性

- `Node<K,V>[] table`：存储键值对的数组。
- `int size`：当前键值对的数量。
- `int threshold`：扩容阈值，当  `size > threshold`  时触发扩容。
- `float loadFactor`：负载因子，默认是 0.75，用于计算扩容阈值。
- `int modCount`：修改次数，用于快速失败机制（fail-fast）。

#### 哈希计算

`HashMap`  通过  `key`  的哈希值来确定存储位置。JDK 1.8 对哈希计算做了优化：

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

- 将  `key`  的哈希值  `h`  与  `h`  的高 16 位异或，目的是让哈希值的高位也参与运算，减少哈希冲突。

#### 确定数组下标

通过哈希值和数组长度计算下标：

```java
int index = (n - 1) & hash;
```

- `n`  是数组长度，必须是 2 的幂次方（通过扩容保证）。
- `&`  操作比  `%`  操作更快。

### 扩容机制

#### 扩容条件

- 当  `size > threshold`  时触发扩容。
- 默认初始容量是 16，负载因子是 0.75，扩容阈值是  `capacity * loadFactor`。

#### 扩容过程

1. 创建一个新的数组，长度是原数组的 2 倍。
2. 遍历原数组，将每个节点重新哈希到新数组中。
3. 如果是链表，可能会拆分为两个链表（低位链表和高位链表）。
   - 把之前冲突的节点均匀分布到桶中
4. 如果是红黑树，可能会退化为链表。
5. 扩容后不会出现更加严重的 hash 冲突

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table; // 旧数组
    int oldCap = (oldTab == null) ? 0 : oldTab.length; // 旧容量
    int oldThr = threshold; // 旧阈值
    int newCap, newThr = 0; // 新容量和新阈值

    // 1. 计算新容量和新阈值
    if (oldCap > 0) {
        // 如果旧容量已经达到最大值（2^30），不再扩容
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        // 新容量是旧容量的 2 倍
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // 新阈值是旧阈值的 2 倍
    }
    // 2. 如果旧容量为 0，但旧阈值大于 0（初始化时指定了容量）
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;
    // 3. 如果旧容量和旧阈值都为 0（默认初始化）
    else {               // zero initial threshold signifies using defaults
        newCap = DEFAULT_INITIAL_CAPACITY; // 默认初始容量 16
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY); // 默认阈值 12
    }

    // 4. 如果新阈值为 0，重新计算
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr; // 更新阈值

    // 5. 创建新数组
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab; // 更新数组

    // 6. 重新哈希
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null; // 清空旧数组
                // 如果桶中只有一个节点，直接插入新数组
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                // 如果桶中是红黑树，调用红黑树的拆分方法
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // 如果桶中是链表，拆分为两个链表
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        // 判断节点应该分配到低位链表还是高位链表
                        // 低位链表（原位置）
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        // 高位链表（原位置 + 旧容量）
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    // 将低位链表放入新数组的原位置
                    if (loTail != null)
                        loTail.next = null;
                    newTab[j] = loHead;
                    // 将高位链表放入新数组的原位置 + 旧容量
                    if (hiTail != null)
                        hiTail.next = null;
                    newTab[j + oldCap] = hiHead;
                }
            }
        }
    }
    return newTab;
}
```

### 哈希冲突解决

#### 链表法

- 当哈希冲突发生时，冲突的键值对会以链表的形式存储。
- 查询时需要遍历链表，时间复杂度是 O(n)。

#### 红黑树

- 当链表长度超过 8 时，链表会转换为红黑树。
- 红黑树的查询时间复杂度是 O(log n)。

### put 方法

6. **计算键的哈希值**。
7. **检查数组是否为空**，如果为空则初始化数组。
8. **计算数组下标**，找到对应的桶（bucket）。
9. **检查桶是否为空**：

   - 如果为空，直接插入节点。
   - 如果不为空，遍历链表或红黑树：
     - 如果找到相同的  `key`，更新  `value`。
     - 如果没有找到，插入到链表末尾或红黑树中。

10. **检查链表长度**，如果超过阈值（默认是 8），则将链表转换为红黑树。
11. **检查是否需要扩容**，如果  `size > threshold`，则触发扩容。

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
```

```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
    Node<K,V>[] tab; // 数组
    Node<K,V> p;     // 当前节点
    int n, i;        // n: 数组长度, i: 数组下标

    // 1. 检查数组是否为空，如果为空则初始化
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;

    // 2. 计算数组下标，检查对应的桶是否为空
    if ((p = tab[i = (n - 1) & hash]) == null)
        // 如果为空，直接插入新节点
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; // 用于存储已存在的节点（如果找到相同的 key）
        K k;

        // 3. 检查当前节点的 key 是否与插入的 key 相同
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            // 如果相同，记录当前节点
            e = p;
        // 4. 如果当前节点是红黑树节点，调用红黑树的插入方法
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            // 5. 遍历链表
            for (int binCount = 0; ; ++binCount) {
                // 如果到达链表末尾，插入新节点
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    // 如果链表长度超过阈值（默认是 8），转换为红黑树
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                // 如果找到相同的 key，记录当前节点
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }

        // 6. 如果找到相同的 key，更新 value
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }

    // 7. 修改次数加 1（用于快速失败机制）
    ++modCount;

    // 8. 检查是否需要扩容
    if (++size > threshold)
        resize();

    // 9. 插入后的回调方法（LinkedHashMap 使用）
    afterNodeInsertion(evict);
    return null;
}
```

### get 方法

```java
final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; // 数组
    Node<K,V> first, e; // first: 桶中的第一个节点, e: 当前节点
    int n; // 数组长度
    K k; // 当前节点的 key

    // 1. 检查数组是否为空，以及桶是否为空
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {
        // 2. 检查第一个节点是否匹配
        if (first.hash == hash && // 哈希值匹配
            ((k = first.key) == key || (key != null && key.equals(k)))) // key 匹配
            return first; // 返回第一个节点

        // 3. 如果第一个节点不匹配，遍历链表或红黑树
        if ((e = first.next) != null) {
            // 4. 如果是红黑树节点，调用红黑树的查找方法
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);

            // 5. 如果是链表节点，遍历链表
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e; // 返回匹配的节点
            } while ((e = e.next) != null);
        }
    }

    // 6. 如果没有找到匹配的节点，返回 null
    return null;
}
```

### 常见问题

#### 为什么数组长度是 2 的幂次方？

- 方便通过  `(n - 1) & hash`  计算下标。
- 扩容时，节点的新位置要么是原位置，要么是原位置 + 原容量。
- 如果不是 2 的幂次方会导致哈希分布不均匀，增加哈希冲突的概率。

#### 6.2 为什么负载因子默认是 0.75？

- 负载因子是空间和时间的折中：
  - 负载因子过小，空间浪费。
  - 负载因子过大，哈希冲突增加。

#### **6.3 HashMap 是否线程安全？**

- 不是线程安全的。
- 多线程环境下，可以使用  `ConcurrentHashMap`  或  `Collections.synchronizedMap`。
