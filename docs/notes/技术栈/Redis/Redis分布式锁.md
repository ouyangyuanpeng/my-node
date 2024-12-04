|     |       Mysql       |       Redis       |    Zookeeper     |
| :-: | :---------------: | :---------------: | :--------------: |
| 互斥  | 利用 mysql 本身的互斥锁机制 | 利用 setnx 这样的互斥命令  | 利用节点的唯一性和有序性实现互斥 |
| 高可用 |         好         |         好         |        好         |
| 高性能 |        一般         |         好         |        一般        |
| 安全性 |   断开连接，自动释放锁（好）   | 利用锁的到期时间，到期释放（一般） | 临时节点，断开连接自动释放（好） |

## SETNX 命令（简单方案）

利用 setnx 互斥的效果实现，如果存在 key,其他 setnx 命令会失败，只有等 del 后才能成功

```bash
# 创建锁 value可以是唯一标识或者线程唯一标识，防止误删除问题
SETNX key value

# 添加过期时间，防止应用服务宕机导致死锁
# 如果在获取锁后，应用服务宕机或者其他原因导致没有释放锁，添加过期时间防止死锁
EXPIRE KEY 时间

# 原子性放在一条命令中执行
SET key value NX EX 时间

# 释放锁
DEL key
```

代码实现：[[Redis分布式锁#^d1592c]]

### 缺点

1. 不可重入，同一个线程无法多次获取同一把锁
2. 不可重试，获取锁只尝试一次就返回 false，没有重试机制
3. 超时释放，锁超时释放虽然可以避免死锁，但如果是业务执行耗时较长，也会导致锁释放，存在安全隐患（线程1在执行，然后锁释放，线程2进来执行存在线程1执行的过程中线程2也可能执行）
4. 主从一致性，如果redis存在集群，主从存在同步延迟，如果主宕机了，从机没有同步也会导致加锁失败

以上1，2，3都可以通过代码解决，可以通过使用第三方工具实现比如 Redisson,通过查看redisson查看实现原理

## Redis 分布式锁误删问题

### 产生场景

![image.png](https://image.oyyp.top/img/202411301515440.png)

1. 线程 1 获取锁，然后阻塞时间很长，超过了锁的过期时间，锁自动释放了
2. 线程 2 获取到锁，执行自己的业务
3. 线程 1 执行完毕然后释放锁，此时这个锁是线程 2 的，导致了线程 1 释放了线程 2 的锁
4. 因为线程 1 释放了线程 2 的锁，然后线程 3 获取锁成功然后执行自己的业务，导致分布式锁失效了

### 解决方案

#### 通过标识判断

我们在获取锁的时候，给锁的存入一个唯一标识，可以是 UUID或者是线程唯一标识

![image.png](https://image.oyyp.top/img/202411301520547.png)

```java
/**
 以下代码是简单方案实现分布式锁，存在问题
**/
class RedisLock{


	// 业务标识
	private String name;

	// redis工具类
	private StringRedisTemplate stringRedisTemplate;

	public SimpleRedisLock(String name,StringRedisTemplate stringRedisTemplate) {
		this.name = name;
		this.stringRedisTemplate = stringRedisTemplate;
	}


    // 锁的key前缀
    private static final String KEY_PREFIX = "lock";

    // 锁的值前缀
    private static final String ID_PREFIX = UUID.randomUUID.toStrin(true)+"-";



    public boolean tryLock(long timeoutSec) {
        // 获取线程标识
        String threadId = ID_PREFIX+Thread.currentThread().getId();
        // 获取锁 name = 业务标识
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name,threadId,timeoutSec,TimeUnit.SECONDS);
        // 防止拆包出现空指针异常
        return Boolean.TRUE.equals(success);
    }

    public void unlock(）{
        // 获取线程标示
        String threadId =ID_PREFIX + Thread.currentThread().getId();
        // 获取锁中的标示
        String id = stringRedisTemplate.opsForValue().get(KEY_PREFIX + name);
        // 判断标示是否一致
        if(threadId.equals(id)){
            // 释放锁,这里可能产生极端情况，如果这个时候jvm进行垃圾回收了，导致阻塞。然后锁超时释放，其他线程获取到了锁，然后gc结束，这里又开始执行就会再次产生锁误删除情况
            // 因为获取锁和删除锁是两步操作，无法保证原子性，所以需要获取锁和删除锁是原子性的，可以通过使用LUA脚本
            stringRedisTemplate.delete(KEY_PREFIX + name);
        }

    }

}
```

^d1592c

#### Lua 脚本

[参考](https://www.runoob.com/lua/lua-tutorial.html)

Redis 支持使用 lua 脚本，在脚本中编写 Redis 命令，确保多条命令执行时的原子性

```bash
# redis提供调用命令的函数 （在lua脚本中执行redis命令的函数）
redis.call('命令名称',’key‘,'其他参数',...)

# 实例 set name oyyp
redis.call('set','name','oyyp')

```

```bash
# 调用脚本 0： 表示没有参数
EVAL "return redis.call('set','name','oyyp')" 0
```

如果脚本中的 key、value 不想写死，可以作为参数传递。key 类型参数会放入 KEYS 数组，其它参数会放入 ARGV 数组，在脚本中可以从 KEYS 和 ARGV 数组获取这些参数，这些数组都是下标为 1 开始：

```bash
# 1代表key类型的参数只有一个，也就是说后面的第一个参数是key，如果2的话后面2个就是key
EVAL "return redis.call('set',KEYS[1],ARGV[1])" 1 name Rose

```

使用 lua 脚本释放锁，可以通过 redis 工具类去执行这个脚本并且传递参数

```lua
if(redis.call('get',KEYS[1]) == ARGV[1]） then
    --释放锁delkey
	return redis.call('del',KEYS[1])
end
return
```


## Redisson

[Home · redisson/redisson Wiki](https://github.com/redisson/redisson)

1. 支持可重入锁，重试，超时续期
2. Redisson的multiLock可以解决主从同步问题产生的分布式锁问题

### Redisson可重入锁原理

利用redis中的hash结构

hash数据存储的内容是：key是线程唯一标识，value是获取锁次数，同一个线程获取锁的时候，会把value加1，用于实现可重入锁

![image.png](https://image.oyyp.top/img/202411301718452.png)

过程，Redisson是通过lua脚本实现的


![未命名绘图.drawio.png](https://image.oyyp.top/img/202411301740533.png)

获取锁脚本如下：

```lua
local key = KEYS[1]；--锁的key
local threadId = ARGV[1]；--线程唯一标识
local releaseTime = ARGV[2]；--锁的自动释放时间
--判断是否存在
if (redis.call('exists',key） == 0 ) then
	--不存在，获取锁
	redis.call('hset',key,threadId,'1');
	--设置有效期
	redis.call('expire',key,releaseTime);
	return 1；--返回结果
end;
--锁已经存在，判断threadId是否是自己
if(redis.call('hexists',key,threadId) == 1) then
	--重入次数+1
	redis.call('hincrby'，key，threadId,'1');
	--设置有效期
	redis.call('expire',key,releaseTime);
	return 1;--返回结果
end;
return 0;--代码走到这里，说明获取锁的不是自己，获取锁失败
```

释放锁脚本如下：

```lua
local key = KEYS[1];-- 锁的ke
local threadId = ARGV[1]；--线程唯一标识
local releaseTime = ARGV[2]；--锁的自动释放时间
--判断当前锁是否还是被自己持有
if(redis.call('HEXISTS',key,threadId) == 0) then
	return nil；--如果已经不是自己，则直接返回
end;
--是自己的锁，则重入次数-1
local count = redis.call('HINcRBY',key, threadId,-1);
--判断是否重入次数是否已经为0
if（count>0） then
	--大于0说明不能释放锁，重置有效期然后返回
	redis.call('EXPIRE',key,releaseTime);
	return nil;
else --等于说明可以释放锁，直接删除
	redis.call('DEL',key);
	return nil;
end;
```

### Redisson可重试原理

释放锁的时候会发生通知，利用信号量和pubsub订阅发布功能实现等待、唤醒，获取锁失败的重试机制。

代码参考: RedissonLock

this.entryName = id + ":" + name;  id是这个连接的id，name是当前锁的名称 


```
public boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException {  
        // 转换等待时间为毫秒  
        long time = unit.toMillis(waitTime);  
        // 获取当前时间  
        long current = System.currentTimeMillis();  
        // 获取线程id  
        long threadId = Thread.currentThread().getId();  
        // 获取锁，如果获取到了直接返回null,如果没有获取到返回锁的过期剩余时间  
        Long ttl = tryAcquire(waitTime, leaseTime, unit, threadId);  
        // lock acquired  
        // 获取到锁直接返回  
        if (ttl == null) {  
            return true;  
        }  
  
        // 计算剩余等待时间（获取锁需要花费一定时间，-去这部分时间获取实际还需要等待的实际）  
        time -= System.currentTimeMillis() - current;  
        // 没有剩余等待时间，获取锁失败  
        if (time <= 0) {  
            acquireFailed(waitTime, unit, threadId);  
            return false;  
        }  
  
        // 重新获取时间  
        current = System.currentTimeMillis();  
        // 订阅当前锁通知  
        CompletableFuture<RedissonLockEntry> subscribeFuture = subscribe(threadId);  
        try {  
            // 阻塞等待订阅通知  
            subscribeFuture.get(time, TimeUnit.MILLISECONDS);  
        } catch (TimeoutException e) {  
            // 超时处理释放资源  
            if (!subscribeFuture.completeExceptionally(new RedisTimeoutException(  
                    "Unable to acquire subscription lock after " + time + "ms. " +  
                            "Try to increase 'subscriptionsPerConnection' and/or 'subscriptionConnectionPoolSize' parameters."))) {  
                subscribeFuture.whenComplete((res, ex) -> {  
                    if (ex == null) {  
                        unsubscribe(res, threadId);  
                    }  
                });  
            }  
            acquireFailed(waitTime, unit, threadId);  
            return false;  
        } catch (ExecutionException e) {  
            LOGGER.error(e.getMessage(), e);  
            acquireFailed(waitTime, unit, threadId);  
            return false;  
        }  
  
        // 订阅通知获取到了锁释放的通知，去尝试获取锁  
        try {  
            // 计算剩余等待时间  
            time -= System.currentTimeMillis() - current;  
            if (time <= 0) {  
                acquireFailed(waitTime, unit, threadId);  
                return false;  
            }  
  
            // 循环获取锁直到成功或超时  
            while (true) {  
                long currentTime = System.currentTimeMillis();  
                ttl = tryAcquire(waitTime, leaseTime, unit, threadId);  
                // lock acquired  
                if (ttl == null) {  
                    return true;  
                }  
  
                time -= System.currentTimeMillis() - currentTime;  
                if (time <= 0) {  
                    acquireFailed(waitTime, unit, threadId);  
                    return false;  
                }  
  
                // waiting for message  
                currentTime = System.currentTimeMillis();  
  
                // 如果过期时间小于等待时间，我们只等待ttl  
                if (ttl >= 0 && ttl < time) {  
                    // 立马去获取异步操作结果这里是获取RedissonLockEntry  
                    // 相当于等待其他线程释放锁的通知，通过信号量方法获取（防止并发），如果获取到了释放锁通知往下执行
                    commandExecutor.getNow(subscribeFuture).getLatch().tryAcquire(ttl, TimeUnit.MILLISECONDS);  
                } else {  
                    // 如果 ttl 是负数（表示锁不存在或已释放）或 ttl 大于等于 time，则直接使用剩余的 time 作为等待时间。  
                    commandExecutor.getNow(subscribeFuture).getLatch().tryAcquire(time, TimeUnit.MILLISECONDS);  
                }  
  
                time -= System.currentTimeMillis() - currentTime;  
                if (time <= 0) {  
                    acquireFailed(waitTime, unit, threadId);  
                    return false;  
                }  
            }  
        } finally {  
            unsubscribe(commandExecutor.getNow(subscribeFuture), threadId);  
        }  
//        return get(tryLockAsync(waitTime, leaseTime, unit));  
    }
```


### Redisson超时续约原理

其实是通过一个timeout 去执行一个任务去重置过期时间。


RedissonLock -> tryAcquireOnceAsync方法：

```java
/**  
 * 获取锁方法  (没有设置超时时间)
 * @param waitTime 获取锁超时等待时间  
 * @param leaseTime 锁过期时间  
 * @param unit 时间单位  
 * @param threadId Thread.currentThread().getId() 线程id  
 * @return 异步回调函数  
 */  
private RFuture<Boolean> tryAcquireOnceAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId) {  
    CompletionStage<Boolean> acquiredFuture;  
  
    // 如果设置了过期时间  
    if (leaseTime > 0) {  
        acquiredFuture = tryLockInnerAsync(waitTime, leaseTime, unit, threadId, RedisCommands.EVAL_NULL_BOOLEAN);  
    } else {  
        // 没有设置过期时间添加默认时间 internalLockLeaseTime = 30 * 1000 毫秒  
        acquiredFuture = tryLockInnerAsync(waitTime, internalLockLeaseTime,  
                TimeUnit.MILLISECONDS, threadId, RedisCommands.EVAL_NULL_BOOLEAN);  
    }  
  
    acquiredFuture = handleNoSync(threadId, acquiredFuture);  
  
    CompletionStage<Boolean> f = acquiredFuture.thenApply(acquired -> {  
        // 如果获取到锁  
        if (acquired) {  
            // 如果设置了过期时间使用过期时间  
            if (leaseTime > 0) {  
                internalLockLeaseTime = unit.toMillis(leaseTime);  
            } else {  
                // 没有设置过期时间开启看门狗去续期 定期刷新锁的过期时间，以防止锁因超时而自动释放。
                scheduleExpirationRenewal(threadId);  
            }  
        }  
        return acquired;  
    });  
    return new CompletableFutureWrapper<>(f);  
}
```


scheduleExpirationRenewal 方法实现：

```java
protected void scheduleExpirationRenewal(long threadId) {  
    // 首先创建一个新的ExpirationEntry实例，并将当前线程ID添加到该条目中。  
    // 一个锁就对应自己的一个ExpirationEntry类，EXPIRATION_RENEWAL_MAP存放所有的锁信息。  
    ExpirationEntry entry = new ExpirationEntry();  
    entry.addThreadId(threadId);  
    // 使用putIfAbsent方法尝试将ExpirationEntry放入名为EXPIRATION_RENEWAL_MAP的映射中。如果该键已经存在（即已经有其他线程正在处理续期），则返回已存在的条目。
    // 如果不存在，则将新锁放入
    ExpirationEntry oldEntry = EXPIRATION_RENEWAL_MAP.putIfAbsent(getEntryName(), entry);  
    // 如果EXPIRATION_RENEWAL_MAP中已经有了，那么+1 （可重入锁）  
    if (oldEntry != null) {  
        oldEntry.addThreadId(threadId);  
    } else {  
        try {  
            // 看门狗续期  
            renewExpiration();  
        } finally {  
            // 检查线程是否中断，中断释放资源  
            if (Thread.currentThread().isInterrupted()) {  
                cancelExpirationRenewal(threadId, null);  
            }  
        }  
    }  
}
```

renewExpiration方法实现：

```java
private void renewExpiration() {  
    // 获取锁对象  
    ExpirationEntry ee = EXPIRATION_RENEWAL_MAP.get(getEntryName());  
    if (ee == null) {  
        return;  
    }  
  
    // 创建一个定时任务  
    Timeout task = getServiceManager().newTimeout(new TimerTask() {  
        @Override  
        public void run(Timeout timeout) throws Exception {  
            // 首先从EXPIRATION_RENEWAL_MAP中获取与当前锁相关的ExpirationEntry。如果不存在（即没有线程持有锁或续期任务已被取消），则直接返回，不进行任何操作。  
            ExpirationEntry ent = EXPIRATION_RENEWAL_MAP.get(getEntryName());  
            if (ent == null) {  
                return;  
            }  
            Long threadId = ent.getFirstThreadId();  
            if (threadId == null) {  
                return;  
            }  
  
            // 异步更新锁的过期时间  
            CompletionStage<Boolean> future = renewExpirationAsync(threadId);  
            future.whenComplete((res, e) -> {  
                if (e != null) {  
                    if (getServiceManager().isShuttingDown(e)) {  
                        return;  
                    }  
  
                    log.error("Can't update lock {} expiration", getRawName(), e);  
                    EXPIRATION_RENEWAL_MAP.remove(getEntryName());  
                    return;  
                }  
  
                // 更新成功  
                if (res) {  
                    // 重新设置下一次的过期时间更新任务（递归）  
                    renewExpiration();  
                } else { // 更新失败  
                    // 取消过期时间的更新任务  
                    cancelExpirationRenewal(null, null);  
                }  
            });  
        }  
    }, internalLockLeaseTime / 3, TimeUnit.MILLISECONDS); // 默认是30秒也就是 10秒执行一次这个任务  
  
    // 把定时任务放入锁对象中，释放的时候删除这个定时任务  
    ee.setTimeout(task);  
}
```

### Redisson分布式锁主从一致性问题

如果主节点发生宕机，然后导致从节点没有及时同步消息，redis集群哨兵机制自动把从节点升级为主节点，但是没有锁的消息，导致下一次可以直接获取到锁，导致并发问题。

Redisson解决的方案简单粗暴，他不分主从节点全部是主，所以每次获取锁的时候会向全部节点去获取锁，如果有一个失败那就是失败的，相当于我们去获取锁的时候会向全部的节点去执行命令

```java
RLock mylock1 = CLIENT1.getLock("mylock");  
RLock mylock2 = CLIENT2.getLock("mylock");  
RLock mylock3 = CLIENT3.getLock("mylock");  
RLock multiLock = CLIENT.getMultiLock(mylock1, mylock2, mylock3);  
// 获取锁  
multiLock.tryLock();
```

