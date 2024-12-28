---
title: Redis集群搭建
createTime: 2024/11/14 10:21:26
permalink: /技术栈/ux49g43u/
---

## 安装 Redis

[Redis 集群之主从、哨兵、分片集群，SpringBoot 整合 Redis 集群\_redis 集群之主从,哨兵,分片集群-CSDN 博客](https://blog.csdn.net/Tomwildboar/article/details/116155163)

[下载 - Redis](https://redis.io/downloads/)

将下载的压缩包放入/usr/local/中
tar -zxvf 解压

安装编译工具
yum install gcc

进入解压后文件夹中 使用
make
当前目录下有 src，里面有 redis-server 说明成功
进入 src 目录 执行 make install 判断是否安装成功

```sh
# 编译，大概需要五分钟左右
make
# 安装，默认可执行文件存放的路径为：/usr/local/bin
# PREFIX 参数配置自定义存放路径
make install
#make PREFIX=/usr/local/redis install 安装到指定目录后，可执行文件会在这个目录下
# 进入可执行文件目录
cd /usr/local/bin

```

## 主从搭建

主：负责写请求

从： 负责读请求

配置文件方式：

```
# slave节点配置文件添加
slaveof 192.168.1.100 6379

# 主服务器设置了密码保护，从服务器也需要配置 masterauth 指令来进行认证
masterauth pasword

```

命令行方式：

```bash
redis-server --slaveof <master-ip> <master-port> --masterauth <master-password>
```

## 主从数据同步原理

### 全量同步

💡 主从第一次同步是全量同步

master 如何判断 slave 是不是第一次来同步数据？这里会用到两个很重要的概念：

- ReplicationId：简称 replid，是数据集的标记，id 一致则说明是同一数据集。每一个 master 都有唯一的 replid，slave 则会继承 master 节点的 replid
- offset：偏移量，随着记录在 repl_baklog 中的数据增多而逐渐增大。slave 完成同步时也会记录当前同步的 offset。如果 slave 的 offset 小于 master 的 offset，说明 slave 数据落后于 master，需要更新。
  因此 slave 做数据同步，必须向 master 声明自己的 replicationid 和 offset，master 才可以判断到底需要同步哪些数据

![image.png](https://image.oyyp.top/img/202412221452771.png)

1.1：步骤中 slave 会带上自己 replid 和 offset 给 master
1.2：master 判断是否是第一次同步，slave 的 replid 和 master 的 replid 不一致就是第一次同步
1.3：是第一次的话返回 master 的 replid 和 offset
1.4：slave 保存 1.3 的 replid 和 offset

repl_baklog: 他是一个命令缓冲区，在同步过程中的写命令会保存在这个缓冲区中

### 增量同步

主从第一次同步是全量同步，如果 slave 宕机重启后，就是增量同步

基于 repl_baklog 进行增量同步：

```
repl_baklog底层其实是一个类似数组的结构，有固定大小，当命令写满了这个数组的时候，有新的数据需要写入，那么他就会从头开始覆盖原来的数据
1. repl_baklog类似一个环，环满了就一直重复写入，覆盖之前的数据
```

slave 在同步的时候会带 offset，master 节点通过这个判断哪些数据没有同步，master 节点的 offset 其实是记录了 repl_baklog 的最新写入的数据的下标，master 通过比较 slave 的 offset 判断哪些数据需要同步

因为 repl_baklog 的大小有上限，所以如果 slave 节点宕机太久，导致需要同步的被覆盖，导致数据增量失败，这个时候只能`全量同步`

### 优化

全量同步优化：

- master 中配置 repl-diskless-sync yes 启用无磁盘复制，避免全量同步时的磁盘 iO。
- redis 单节点上的内存占用不要太大，如果太大生成的 rdb 文件过大，导致写入到本地 rdb 文件过多磁盘 IO
- 限制一个 master 上的 slave 节点数量，如果实在是太多 slave，则可以采用主-从-从链式结构，减少 master 压力

![image.png](https://image.oyyp.top/img/202412221521496.png)

增量同步优化：

- 适当提高 repl_baklog 的大小，发现 slave 岩机时尽快实现故障恢复，尽可能避免全量同步

## 搭建集群

mkdir -p /usr/local/redis-cluster

创建不同 redis 目录。区分不同节点
mkdir 8001
mkdir 8002
mkdir 8003
mkdir 8004
mkdir 8005
mkdir 8006

把以下配置文件修改对应端口后分别放入上面的目录中

redis.conf 配置文件

```conf
#去掉bind绑定访问ip信息
bind 0.0.0.0

#关闭保护模式
protected-mode no

#修改对应的端口
port 8001

#启动集群模式
cluster-enabled yes

#集群节点信息文件，这里500x最好和port对应上
cluster-config-file nodes-8001.conf

#节点离线的超时时间
cluster-node-timeout 5000

#如果要设置密码需要增加如下配置：
#设置redis访问密码
requirepass xdx97

#设置集群节点间访问密码，跟上面一致
masterauth xdx97

# 修改启动进程号存储位置
pidfile /var/run/redis_8001.pid

#指定数据文件存放位置，必须要指定不同的目录位置，不然会丢失数据
dir /usr/local/redis-cluster/redis-8001

#修改为后台启动
daemonize yes

#启动AOF文件
appendonly yes

tcp-backlog 511
timeout 0
tcp-keepalive 300
supervised no
loglevel notice
logfile ""
databases 16
always-show-logo yes
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-disable-tcp-nodelay no
replica-priority 100
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
```

分别使用命令启动 redis
/usr/local/redis-6.2.14/src/redis-server /usr/local/redis-cluster/redis-8001/redis.conf
/usr/local/redis-6.2.14/src/redis-server /usr/local/redis-cluster/redis-8002/redis.conf
...
如果通过 make PREFIX=/usr/local/redis install
/usr/local/redis-6.2.14/src/redis-server 替换为/usr/local/redis/bin/redis-serve

使用 redis-cli 创建整个 redis 集群

/usr/local/redis-6.2.14/src/redis-cli -a xdx97 --cluster create --cluster-replicas 1 127.0.0.1:8001 127.0.0.1:8002 127.0.0.1:8003 127.0.0.1:8004 127.0.0.1:8005 127.0.0.1:8006

执行完后会出现下面的界面，输入==yes==回车即可，我们可以得到以下信息

连接到任意一个 redis 节点
./redis-cli -c -h 127.0.0.1 -p 8001 -a xdx97
-c 集群模式
-h redis ip
-a 密码

集群状况
cluster info
节点状况
cluster nodes

关闭集群需要一个一个关闭

/usr/local/redis-6.2.14/src/redis-cli -c -h 127.0.0.1 -p 8001 -a "密码" shutdown

### 异常情况

```
 WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.

```

编辑 /etc/sysctl.conf ，新增一行 vm.overcommit_memory=1，然后 sysctl -p 使配置文件生效。
或者/sbin/sysctl -p
