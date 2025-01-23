import{_ as n,c as a,a as e,o as i}from"./app-Cafa1CHb.js";const l={};function p(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h2 id="安装-redis" tabindex="-1"><a class="header-anchor" href="#安装-redis"><span>安装 Redis</span></a></h2><p><a href="https://blog.csdn.net/Tomwildboar/article/details/116155163" target="_blank" rel="noopener noreferrer">Redis 集群之主从、哨兵、分片集群，SpringBoot 整合 Redis 集群_redis 集群之主从,哨兵,分片集群-CSDN 博客</a></p><p><a href="https://redis.io/downloads/" target="_blank" rel="noopener noreferrer">下载 - Redis</a></p><p>将下载的压缩包放入/usr/local/中 tar -zxvf 解压</p><p>安装编译工具 yum install gcc</p><p>进入解压后文件夹中 使用 make 当前目录下有 src，里面有 redis-server 说明成功 进入 src 目录 执行 make install 判断是否安装成功</p><div class="language-sh line-numbers-mode" data-ext="sh" data-title="sh"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 编译，大概需要五分钟左右</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">make</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 安装，默认可执行文件存放的路径为：/usr/local/bin</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># PREFIX 参数配置自定义存放路径</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">make</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">#make PREFIX=/usr/local/redis install 安装到指定目录后，可执行文件会在这个目录下</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 进入可执行文件目录</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">cd</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> /usr/local/bin</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="主从搭建" tabindex="-1"><a class="header-anchor" href="#主从搭建"><span>主从搭建</span></a></h2><p>主：负责写请求</p><p>从： 负责读请求</p><p>配置文件方式：</p><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span># slave节点配置文件添加</span></span>
<span class="line"><span>slaveof 192.168.1.100 6379</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 主服务器设置了密码保护，从服务器也需要配置 masterauth 指令来进行认证</span></span>
<span class="line"><span>masterauth pasword</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>命令行方式：</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">redis-server</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --slaveof</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> &lt;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">master-i</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">p</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">&gt;</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> &lt;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">master-por</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">t</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">&gt;</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --masterauth</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> &lt;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">master-passwor</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">d</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="主从数据同步原理" tabindex="-1"><a class="header-anchor" href="#主从数据同步原理"><span>主从数据同步原理</span></a></h2><h3 id="全量同步" tabindex="-1"><a class="header-anchor" href="#全量同步"><span>全量同步</span></a></h3><p>💡 主从第一次同步是全量同步</p><p>master 如何判断 slave 是不是第一次来同步数据？这里会用到两个很重要的概念：</p><ul><li>ReplicationId：简称 replid，是数据集的标记，id 一致则说明是同一数据集。每一个 master 都有唯一的 replid，slave 则会继承 master 节点的 replid</li><li>offset：偏移量，随着记录在 repl_baklog 中的数据增多而逐渐增大。slave 完成同步时也会记录当前同步的 offset。如果 slave 的 offset 小于 master 的 offset，说明 slave 数据落后于 master，需要更新。 因此 slave 做数据同步，必须向 master 声明自己的 replicationid 和 offset，master 才可以判断到底需要同步哪些数据</li></ul><p><img src="https://image.oyyp.top/img/202412221452771.png" alt="image.png"></p><p>1.1：步骤中 slave 会带上自己 replid 和 offset 给 master 1.2：master 判断是否是第一次同步，slave 的 replid 和 master 的 replid 不一致就是第一次同步 1.3：是第一次的话返回 master 的 replid 和 offset 1.4：slave 保存 1.3 的 replid 和 offset</p><p>repl_baklog: 他是一个命令缓冲区，在同步过程中的写命令会保存在这个缓冲区中</p><h3 id="增量同步" tabindex="-1"><a class="header-anchor" href="#增量同步"><span>增量同步</span></a></h3><p>主从第一次同步是全量同步，如果 slave 宕机重启后，就是增量同步</p><p>基于 repl_baklog 进行增量同步：</p><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>repl_baklog底层其实是一个类似数组的结构，有固定大小，当命令写满了这个数组的时候，有新的数据需要写入，那么他就会从头开始覆盖原来的数据</span></span>
<span class="line"><span>1. repl_baklog类似一个环，环满了就一直重复写入，覆盖之前的数据</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>slave 在同步的时候会带 offset，master 节点通过这个判断哪些数据没有同步，master 节点的 offset 其实是记录了 repl_baklog 的最新写入的数据的下标，master 通过比较 slave 的 offset 判断哪些数据需要同步</p><p>因为 repl_baklog 的大小有上限，所以如果 slave 节点宕机太久，导致需要同步的被覆盖，导致数据增量失败，这个时候只能<code>全量同步</code></p><h3 id="优化" tabindex="-1"><a class="header-anchor" href="#优化"><span>优化</span></a></h3><p>全量同步优化：</p><ul><li>master 中配置 repl-diskless-sync yes 启用无磁盘复制，避免全量同步时的磁盘 iO。</li><li>redis 单节点上的内存占用不要太大，如果太大生成的 rdb 文件过大，导致写入到本地 rdb 文件过多磁盘 IO</li><li>限制一个 master 上的 slave 节点数量，如果实在是太多 slave，则可以采用主-从-从链式结构，减少 master 压力</li></ul><p><img src="https://image.oyyp.top/img/202412221521496.png" alt="image.png"></p><p>增量同步优化：</p><ul><li>适当提高 repl_baklog 的大小，发现 slave 岩机时尽快实现故障恢复，尽可能避免全量同步</li></ul><h2 id="搭建集群" tabindex="-1"><a class="header-anchor" href="#搭建集群"><span>搭建集群</span></a></h2><p>mkdir -p /usr/local/redis-cluster</p><p>创建不同 redis 目录。区分不同节点 mkdir 8001 mkdir 8002 mkdir 8003 mkdir 8004 mkdir 8005 mkdir 8006</p><p>把以下配置文件修改对应端口后分别放入上面的目录中</p><p>redis.conf 配置文件</p><div class="language-conf line-numbers-mode" data-ext="conf" data-title="conf"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>#去掉bind绑定访问ip信息</span></span>
<span class="line"><span>bind 0.0.0.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#关闭保护模式</span></span>
<span class="line"><span>protected-mode no</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#修改对应的端口</span></span>
<span class="line"><span>port 8001</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#启动集群模式</span></span>
<span class="line"><span>cluster-enabled yes</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#集群节点信息文件，这里500x最好和port对应上</span></span>
<span class="line"><span>cluster-config-file nodes-8001.conf</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#节点离线的超时时间</span></span>
<span class="line"><span>cluster-node-timeout 5000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#如果要设置密码需要增加如下配置：</span></span>
<span class="line"><span>#设置redis访问密码</span></span>
<span class="line"><span>requirepass xdx97</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#设置集群节点间访问密码，跟上面一致</span></span>
<span class="line"><span>masterauth xdx97</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 修改启动进程号存储位置</span></span>
<span class="line"><span>pidfile /var/run/redis_8001.pid</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#指定数据文件存放位置，必须要指定不同的目录位置，不然会丢失数据</span></span>
<span class="line"><span>dir /usr/local/redis-cluster/redis-8001</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#修改为后台启动</span></span>
<span class="line"><span>daemonize yes</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#启动AOF文件</span></span>
<span class="line"><span>appendonly yes</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tcp-backlog 511</span></span>
<span class="line"><span>timeout 0</span></span>
<span class="line"><span>tcp-keepalive 300</span></span>
<span class="line"><span>supervised no</span></span>
<span class="line"><span>loglevel notice</span></span>
<span class="line"><span>logfile &quot;&quot;</span></span>
<span class="line"><span>databases 16</span></span>
<span class="line"><span>always-show-logo yes</span></span>
<span class="line"><span>save 900 1</span></span>
<span class="line"><span>save 300 10</span></span>
<span class="line"><span>save 60 10000</span></span>
<span class="line"><span>stop-writes-on-bgsave-error yes</span></span>
<span class="line"><span>rdbcompression yes</span></span>
<span class="line"><span>rdbchecksum yes</span></span>
<span class="line"><span>dbfilename dump.rdb</span></span>
<span class="line"><span>replica-serve-stale-data yes</span></span>
<span class="line"><span>replica-read-only yes</span></span>
<span class="line"><span>repl-diskless-sync no</span></span>
<span class="line"><span>repl-diskless-sync-delay 5</span></span>
<span class="line"><span>repl-disable-tcp-nodelay no</span></span>
<span class="line"><span>replica-priority 100</span></span>
<span class="line"><span>lazyfree-lazy-eviction no</span></span>
<span class="line"><span>lazyfree-lazy-expire no</span></span>
<span class="line"><span>lazyfree-lazy-server-del no</span></span>
<span class="line"><span>replica-lazy-flush no</span></span>
<span class="line"><span>appendfilename &quot;appendonly.aof&quot;</span></span>
<span class="line"><span>appendfsync everysec</span></span>
<span class="line"><span>no-appendfsync-on-rewrite no</span></span>
<span class="line"><span>auto-aof-rewrite-percentage 100</span></span>
<span class="line"><span>auto-aof-rewrite-min-size 64mb</span></span>
<span class="line"><span>aof-load-truncated yes</span></span>
<span class="line"><span>aof-use-rdb-preamble yes</span></span>
<span class="line"><span>lua-time-limit 5000</span></span>
<span class="line"><span>slowlog-log-slower-than 10000</span></span>
<span class="line"><span>slowlog-max-len 128</span></span>
<span class="line"><span>latency-monitor-threshold 0</span></span>
<span class="line"><span>notify-keyspace-events &quot;&quot;</span></span>
<span class="line"><span>hash-max-ziplist-entries 512</span></span>
<span class="line"><span>hash-max-ziplist-value 64</span></span>
<span class="line"><span>list-max-ziplist-size -2</span></span>
<span class="line"><span>list-compress-depth 0</span></span>
<span class="line"><span>set-max-intset-entries 512</span></span>
<span class="line"><span>zset-max-ziplist-entries 128</span></span>
<span class="line"><span>zset-max-ziplist-value 64</span></span>
<span class="line"><span>hll-sparse-max-bytes 3000</span></span>
<span class="line"><span>stream-node-max-bytes 4096</span></span>
<span class="line"><span>stream-node-max-entries 100</span></span>
<span class="line"><span>activerehashing yes</span></span>
<span class="line"><span>client-output-buffer-limit normal 0 0 0</span></span>
<span class="line"><span>client-output-buffer-limit replica 256mb 64mb 60</span></span>
<span class="line"><span>client-output-buffer-limit pubsub 32mb 8mb 60</span></span>
<span class="line"><span>hz 10</span></span>
<span class="line"><span>dynamic-hz yes</span></span>
<span class="line"><span>aof-rewrite-incremental-fsync yes</span></span>
<span class="line"><span>rdb-save-incremental-fsync yes</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分别使用命令启动 redis /usr/local/redis-6.2.14/src/redis-server /usr/local/redis-cluster/redis-8001/redis.conf /usr/local/redis-6.2.14/src/redis-server /usr/local/redis-cluster/redis-8002/redis.conf ... 如果通过 make PREFIX=/usr/local/redis install /usr/local/redis-6.2.14/src/redis-server 替换为/usr/local/redis/bin/redis-serve</p><p>使用 redis-cli 创建整个 redis 集群</p><p>/usr/local/redis-6.2.14/src/redis-cli -a xdx97 --cluster create --cluster-replicas 1 127.0.0.1:8001 127.0.0.1:8002 127.0.0.1:8003 127.0.0.1:8004 127.0.0.1:8005 127.0.0.1:8006</p><p>执行完后会出现下面的界面，输入<mark>yes</mark>回车即可，我们可以得到以下信息</p><p>连接到任意一个 redis 节点 ./redis-cli -c -h 127.0.0.1 -p 8001 -a xdx97 -c 集群模式 -h redis ip -a 密码</p><p>集群状况 cluster info 节点状况 cluster nodes</p><p>关闭集群需要一个一个关闭</p><p>/usr/local/redis-6.2.14/src/redis-cli -c -h 127.0.0.1 -p 8001 -a &quot;密码&quot; shutdown</p><h3 id="异常情况" tabindex="-1"><a class="header-anchor" href="#异常情况"><span>异常情况</span></a></h3><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span> WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add &#39;vm.overcommit_memory = 1&#39; to /etc/sysctl.conf and then reboot or run the command &#39;sysctl vm.overcommit_memory=1&#39; for this to take effect.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>编辑 /etc/sysctl.conf ，新增一行 vm.overcommit_memory=1，然后 sysctl -p 使配置文件生效。 或者/sbin/sysctl -p</p>`,51)]))}const c=n(l,[["render",p],["__file","index.html.vue"]]),t=JSON.parse('{"path":"/%E6%8A%80%E6%9C%AF%E6%A0%88/ux49g43u/","title":"Redis集群搭建","lang":"zh-CN","frontmatter":{"title":"Redis集群搭建","createTime":"2024/11/14 10:21:26","permalink":"/技术栈/ux49g43u/"},"headers":[],"readingTime":{"minutes":5.61,"words":1684},"git":{"updatedTime":1735383939000,"contributors":[{"name":"oyyp","email":"513150165@qq.com","commits":3,"avatar":"https://avatars.githubusercontent.com/oyyp?v=4","url":"https://github.com/oyyp"}]},"filePathRelative":"notes/技术栈/Redis/Redis主从.md","categoryList":[{"id":"4358b5","sort":10000,"name":"notes"},{"id":"659f61","sort":10003,"name":"技术栈"},{"id":"5e6003","sort":10007,"name":"Redis"}],"bulletin":false}');export{c as comp,t as data};
