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
