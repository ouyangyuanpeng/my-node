---
title: ElasticSearch
createTime: 2024/11/14 10:21:26
permalink: /微服务/15cjfnxq/
---
[官网地址]([Elasticsearch：官方分布式搜索和分析引擎 | Elastic](https://www.elastic.co/cn/elasticsearch))

[使用 Docker 安装 Elasticsearch |Elasticsearch 指南 [8.11] |弹性的](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)

[参考网址](https://www.cnblogs.com/buchizicai/p/17093719.html)

```ad-info
当前文档使用的ElasticSearch版本为8.11.1
```

# ES 分布式搜索引擎

什么是 elasticsearch？

- 一个开源的分布式搜索引擎，可以用来实现搜索、日志统计、分析、系统监控等功能

什么是 elastic stack（ELK）？

- 是以 elasticsearch 为核心的技术栈，包括 beats、Logstash、kibana、elasticsearch

什么是 Lucene？

- 是 Apache 的开源搜索引擎类库，提供了搜索引擎的核心 API

elasticsearch 是一款非常强大的开源搜索引擎，具备非常多强大功能，可以帮助我们从海量数据中快速找到需要的内容

**ELK 技术栈**

elasticsearch 结合 kibana、Logstash、Beats，也就是 elastic stack（ELK）。被广泛应用在日志数据分析、实时监控等领域

### 倒排索引

倒排索引的概念是基于 MySQL 这样的正向索引而言的。

倒排索引中有两个非常重要的概念：

- 文档（`Document`）：用来搜索的数据，其中的每一条数据就是一个文档。例如一个网页、一个商品信息
- 词条（`Term`）：对文档数据或用户搜索数据，利用某种算法分词，得到的具备含义的词语就是词条。例如：我是中国人，就可以分为：我、是、中国人、中国、国人这样的几个词条

**创建倒排索引**是对正向索引的一种特殊处理，流程如下：

- 将每一个文档的数据利用算法分词，得到一个个词条
- 创建表，每行数据包括词条、词条所在文档 id、位置等信息
- 因为词条唯一性，可以给词条创建索引，例如 hash 表结构索引

如图：

![image.png](https://image.oyyp.top/pc/202311231703237.png)

倒排索引的**搜索流程**如下（以搜索"华为手机"为例）：

1）用户输入条件`"华为手机"`进行搜索。

2）对用户输入内容**分词**，得到词条：`华为`、`手机`。

3）拿着词条在倒排索引中查找，可以得到包含词条的文档 id：1、2、3。

4）拿着文档 id 到正向索引中查找具体文档。

如图：

![image.png](https://image.oyyp.top/pc/202311231706838.png)

虽然要先查询倒排索引，再查询倒排索引，但是无论是词条、还是文档 id 都建立了索引，查询速度非常快！无需全表扫描。

#### 正向和倒排对比

概念区别：

- **正向索引**是最传统的，根据 id 索引的方式。但根据词条查询时，必须先逐条获取每个文档，然后判断文档中是否包含所需要的词条，是**根据文档找词条的过程**。

- 而**倒排索引**则相反，是先找到用户要搜索的词条，根据词条得到保护词条的文档的 id，然后根据 id 获取文档。是**根据词条找文档的过程**。

优缺点：

**正向索引**：

- 优点：
  - 可以给多个字段创建索引
  - 根据索引字段搜索、排序速度非常快
- 缺点：
  - 根据非索引字段，或者索引字段中的部分词条查找时，只能全表扫描。

**倒排索引**：

- 优点：
  - 根据词条搜索、模糊搜索时，速度非常快
- 缺点：
  - 只能给词条创建索引，而不是字段
  - 无法根据字段做排序

### ES 数据库基本概念

elasticsearch 中有很多独有的概念，与 mysql 中略有差别，但也有相似之处。

#### 文档和字段

> 一个文档就像数据库里的一条数据，字段就像数据库里的列

elasticsearch 是面向**文档（Document）**存储的，可以是**数据库中的一条商品数据**，一个订单信息。文档数据会被序列化为 json 格式后存储在 elasticsearch 中：

![image.png](https://image.oyyp.top/pc/202311231708239.png)

而 Json 文档中往往包含很多的**字段（Field）**，类似于**mysql 数据库中的列**。

#### 索引和映射

> 索引就像数据库里的表，映射就像数据库中定义的表结构

**索引（Index）**，就是相同类型的文档的集合【**类似 mysql 中的表**】

例如：

- 所有用户文档，就可以组织在一起，称为用户的索引；
- 所有商品的文档，可以组织在一起，称为商品的索引；
- 所有订单的文档，可以组织在一起，称为订单的索引；

![image.png](https://image.oyyp.top/pc/202311231708959.png)

因此，我们可以把索引当做是数据库中的表。

数据库的表会有约束信息，用来定义表的结构、字段的名称、类型等信息。因此，索引库中就有**映射（mapping）**，是索引中文档的字段约束信息，类似表的结构约束。

#### mysql 与 elasticsearch

> 各自长处：
>
> Mysql：擅长事务类型操作，可以确保数据的安全和一致性
>
> Elasticsearch：擅长海量数据的搜索、分析、计算

我们统一的把**mysql 与 elasticsearch 的概念做一下对比**：

| **MySQL** | **Elasticsearch** | **说明**                                                                           |
| --------- | ----------------- | ---------------------------------------------------------------------------------- |
| Table     | Index             | 索引(index)，就是文档的集合，类似数据库的表(table)                                 |
| Row       | Document          | 文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是 JSON 格式    |
| Column    | Field             | 字段（Field），就是 JSON 文档中的字段，类似数据库中的列（Column）                  |
| Schema    | Mapping           | Mapping（映射）是索引中文档的约束，例如字段类型约束。类似数据库的表结构（Schema）  |
| SQL       | DSL               | DSL 是 elasticsearch 提供的 JSON 风格的请求语句，用来操作 elasticsearch，实现 CRUD |

在企业中，往往是两者结合使用：

- 对安全性要求较高的写操作，使用 mysql 实现
- 对查询性能要求较高的搜索需求，使用 elasticsearch 实现
- 两者再基于某种方式，实现数据的同步，保证一致性

![image.png](https://image.oyyp.top/pc/202311231710882.png)

### docker 安装 es、kibana、分词器

分词器的作用是什么？

- 创建倒排索引时对文档分词
- 用户搜索时，对输入的内容分词

IK 分词器有几种模式？

- ik_smart：智能切分，粗粒度
- ik_max_word：最细切分，细粒度

IK 分词器如何拓展词条？如何停用词条？

- 利用 config 目录的 IkAnalyzer.cfg.xml 文件添加拓展词典和停用词典
- 在词典中添加拓展词条或者停用词条

####   部署单点 es

##### 创建网络

因为我们还需要部署 kibana 容器，因此需要让 es 和 kibana 容器互联。这里先创建一个网络：

```sh
docker network create elastic
```

##### 下载镜像

```sh
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.11.1
```

##### 运行

运行 docker 命令，部署单点 es：

先使用以下命令启动，不挂载目录，启动成功后把 config 目录拷贝出来，后续方便修改配置

```sh
docker run -d \
	--name es \
	--privileged \
    --network elastic \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    -e "discovery.type=single-node" \
    -p 9200:9200 \
    -p 9300:9300 \
docker.elastic.co/elasticsearch/elasticsearch:8.11.1
```

-e "network.bind_host=0.0.0.0" -e "network.publish_host=192.168.2.12" 此配置为了解决 elasticsearch 默认创建证书时，证书的 ip 列表只包含了容器本地 ip，宿主机 ip 没有包含，导致外部无法访问 elasticsearch。参考网址：https://www.jianshu.com/p/93376c5bc11c，这种方式较为简单
如果想手动生成证书可以参考：https://elasticstack.blog.csdn.net/article/details/130643942

```sh
docker run -d \
	--name es \
	--privileged \
    --network elastic \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    -e "discovery.type=single-node" \
    -e "network.bind_host=0.0.0.0" \
    -e "network.publish_host=192.168.2.12" \
    -p 9200:9200 \
    -p 9300:9300 \
docker.elastic.co/elasticsearch/elasticsearch:8.11.1
```

拷贝目录

```sh
docker cp es:/usr/share/elasticsearch/config /mydata/elasticSearch/es-config/
docker cp es:/usr/share/elasticsearch/data /mydata/elasticSearch/data/
docker cp es:/usr/share/elasticsearch/logs /mydata/elasticSearch/logs/
docker cp es:/usr/share/elasticsearch/plugins /mydata/elasticSearch/plugins/
```

docker 启动后拷贝出来的`elasticsearch.yml` 配置信息

```yaml
cluster.name: "docker-cluster"
network.host: 0.0.0.0

#----------------------- BEGIN SECURITY AUTO CONFIGURATION -----------------------
#
# The following settings, TLS certificates, and keys have been automatically
# generated to configure Elasticsearch security features on 12-01-2024 09:46:13
#
# --------------------------------------------------------------------------------

# Enable security features
xpack.security.enabled: true

xpack.security.enrollment.enabled: true

# Enable encryption for HTTP API client connections, such as Kibana, Logstash, and Agents
xpack.security.http.ssl:
  enabled: true
  keystore.path: certs/http.p12

# Enable encryption and mutual authentication between cluster nodes
xpack.security.transport.ssl:
  enabled: true
  verification_mode: certificate
  keystore.path: certs/transport.p12
  truststore.path: certs/transport.p12
#----------------------- END SECURITY AUTO CONFIGURATION -------------------------

```

容器**以用户  ` userid:1000 身份运行 Elasticsearch`，使用 uid：gid `1000：0`**。绑定挂载的主机目录和文件必须可由此用户访问， 并且数据和日志目录必须可由该用户写入。如果挂载的目录不允许`elasticsearch`访问将会启动失败，直接运行容器会失败，需要设置挂载的目录权限,需要提前创建好全部挂载目录

设置目录权限 `我的挂载目录父目录为:/mydata/elasticSearch`

```sh
// 设置文件的所有者的id为1000的用户和组id是0的组
chown -R 1000:0 /mydata/elasticSearch
// 设置文件读写权限
chmod -R 775 /mydata/elasticSearch
```

重新启动

```sh
docker run -d \
	--name es \
	--privileged \
    --network elastic \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    -e "discovery.type=single-node" \
    -v /mydata/elasticSearch/data:/usr/share/elasticsearch/data \
    -v /mydata/elasticSearch/plugins:/usr/share/elasticsearch/plugins \
    -v /mydata/elasticSearch/es-config:/usr/share/elasticsearch/config \
    -v /mydata/elasticSearch/logs:/usr/share/elasticsearch/logs \
    -p 9200:9200 \
    -p 9300:9300 \
docker.elastic.co/elasticsearch/elasticsearch:8.11.1
```

```sh
docker run -d \
	--name es \
	--privileged \
    --network elastic \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    -e "discovery.type=single-node" \
    -e "network.bind_host=0.0.0.0" \
    -e "network.publish_host=192.168.2.12" \
    -v /mydata/elasticSearch/data:/usr/share/elasticsearch/data \
    -v /mydata/elasticSearch/plugins:/usr/share/elasticsearch/plugins \
    -v /mydata/elasticSearch/es-config:/usr/share/elasticsearch/config \
    -v /mydata/elasticSearch/logs:/usr/share/elasticsearch/logs \
    -p 9200:9200 \
    -p 9300:9300 \
docker.elastic.co/elasticsearch/elasticsearch:8.11.1
```

命令解释：

- `-e "cluster.name=es-docker-cluster"`：设置集群名称
- `-e "http.host=0.0.0.0"`：监听的地址，可以外网访问
- `-e "ES_JAVA_OPTS=-Xms512m -Xmx512m"`：内存大小
- `-e "discovery.type=single-node"`：非集群模式
- `-e "ELASTIC_PASSWORD=123456"`：设置 elastic 密码，也可以不设置使用自动生成
- `-v es-data:/usr/share/elasticsearch/data`：挂载逻辑卷，绑定 es 的数据目录
- `-v es-logs:/usr/share/elasticsearch/logs`：挂载逻辑卷，绑定 es 的日志目录
- `-v es-plugins:/usr/share/elasticsearch/plugins`：挂载逻辑卷，绑定 es 的插件目录
- `--privileged`：授予逻辑卷访问权
- `--network elastic `：加入一个名为 elastic 的网络中
- `-p 9200:9200`：端口映射配置

`默认开启了安全验证`,需要重置一下密码
复制生成的密码和注册令牌。这些凭据仅在您首次启动 Elasticsearch 时显示。您可以重新生成 使用以下命令的凭据。`elastic`
如果没有指定密码，日志中可以找到，找不到重置密码

```sh
# 重置elastic密码
docker exec -it es /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
# 生成kibana访问token
docker exec -it es /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

使用 https://{ip}:9200 或者 http://{ip}:9200 访问
elastic
dPTsAbetfl0+GpyLo4oF

eyJ2ZXIiOiI4LjExLjEiLCJhZHIiOlsiMTcyLjE5LjAuMjo5MjAwIl0sImZnciI6IjRjMjUwMDk5ZTY5ZjIyZjI2YmE4ZmE3MGU4ZTc0ZjJiM2FkOWI1OTc4ZWRhNjJiNThkYmRjMTE0NWM0MTZjMjUiLCJrZXkiOiJOYk5tQVkwQjRXeDM5ZG9DMGNpLTpVamc1TmlsQVJpR19jdGx2YU1aZ213In0=

## 安装 IK 分词器

直接解压分词器，放在 plugins 下

## 安装 kibana

```sh
docker pull docker.elastic.co/kibana/kibana:8.11.1

docker run -d --name kib01 --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.11.1
```

设置中文

```sh
# 拷贝配置文件
docker cp kib01:/usr/share/kibana/config/kibana.yml .
# 在拷贝出来的文件添加
i18n.locale: "zh-CN"
# 把修改后的配置文件放入容器中
docker cp kibana.yml kib01:/usr/share/kibana/config/kibana.yml
# 重启容器
docker restart kib01
```

## 安全模式下安装 es+kibana 集群

[参考文档](https://elasticstack.blog.csdn.net/article/details/130643942)

### 生成证书

我们使用如下的命令来生成根证书：

```cobol
/usr/share/elasticsearch/bin/elasticsearch-certutil ca --silent --pem -out config/certs/ca.zip
```

我们接下来解压缩上面得到的 ca.zip 文件：
unzip config/certs/ca.zip -d config/certs

我们在  es 安装目录/config/certs  目录底下创建一个 instances.yml 文件，它将包含我们要使用 SSL 保护的不同节点的实例。

instances.yml

```yml
instances:
  - name: "es-test-01"
    dns:
      - localhost
      - es-test-01
    ip:
      - "192.168.2.7"
  - name: "es-test-02"
    dns:
      - localhost
      - es-test-02
    ip:
      - "192.168.2.8"
  - name: "es-test-03"
    dns:
      - localhost
      - es-test-03
    ip:
      - "192.168.2.9"
  - name: "Kibana"
    ip:
      - "192.168.2.7"
```

生成每个节点证书

```sh
 ./bin/elasticsearch-certutil cert --silent --pem -out config/certs/certs.zip --in config/certs/instances.yml --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key
```

我们接下来解压缩上面得到的 certs.zip 的文件
unzip config/certs/certs.zip -d config/certs

我们接下来把上面生成的证书拷贝到 es 安装目录/config/certs  下面去。

### 配置 Elasticsearch 节点

##### elasticsearch.yml

```yml
# ======================== Elasticsearch Configuration =========================
#
# NOTE: Elasticsearch comes with reasonable defaults for most settings.
#       Before you set out to tweak and tune the configuration, make sure you
#       understand what are you trying to accomplish and the consequences.
#
# The primary way of configuring a node is via this file. This template lists
# the most important settings you may want to configure for a production cluster.
#
# Please consult the documentation for further information on configuration options:
# https://www.elastic.co/guide/en/elasticsearch/reference/index.html
#
# ---------------------------------- Cluster -----------------------------------
#
# Use a descriptive name for your cluster:
#
#cluster.name: my-application
#集群名称
cluster.name: es-test
# 初始主节点列表，用于集群自动发现
#
# ------------------------------------ Node ------------------------------------
#
# Use a descriptive name for the node:
#
#node.name: node-1
#节点名称
node.name: es-test-01
#
# Add custom attributes to the node:
#
#node.attr.rack: r1
#
# ----------------------------------- Paths ------------------------------------
#
# Path to directory where to store the data (separate multiple locations by comma):
#
#path.data: /path/to/data
#
# Path to log files:
#
#path.logs: /path/to/logs
#
# ----------------------------------- Memory -----------------------------------
#
# Lock the memory on startup:
#
#bootstrap.memory_lock: true
#
# Make sure that the heap size is set to about half the memory available
# on the system and that the owner of the process is allowed to use this
# limit.
#
# Elasticsearch performs poorly when the system is swapping the memory.
#
# ---------------------------------- Network -----------------------------------
#
# By default Elasticsearch is only accessible on localhost. Set a different
# address here to expose this node on the network:
#
#network.host: 192.168.0.1
network.host: 0.0.0.0
#
# By default Elasticsearch listens for HTTP traffic on the first free port it
# finds starting at 9200. Set a specific HTTP port here:
#
#http.port: 9200
#
# For more information, consult the network module documentation.
#
# --------------------------------- Discovery ----------------------------------
#
# Pass an initial list of hosts to perform discovery when this node is started:
# The default list of hosts is ["127.0.0.1", "[::1]"]
#
#discovery.seed_hosts: ["host1", "host2"]
discovery.seed_hosts: ["192.168.2.7"]
#
# Bootstrap the cluster using an initial set of master-eligible nodes:
#
#cluster.initial_master_nodes: ["node-1", "node-2"]
#
# For more information, consult the discovery and cluster formation module documentation.
#
# ---------------------------------- Various -----------------------------------
#
# Allow wildcard deletion of indices:
#
#action.destructive_requires_name: false

#----------------------- BEGIN SECURITY AUTO CONFIGURATION -----------------------
#
# The following settings, TLS certificates, and keys have been automatically
# generated to configure Elasticsearch security features on 13-01-2024 07:03:52
#
# --------------------------------------------------------------------------------

# Enable security features
xpack.security.enabled: true

xpack.security.enrollment.enabled: true

# Enable encryption for HTTP API client connections, such as Kibana, Logstash, and Agents
#这里修改为上一步生成的证书
xpack.security.http.ssl:
  enabled: true
  key: /data/elasticsearch-8.11.4/config/certs/es-test-01/es-test-01.key
  certificate: /data/elasticsearch-8.11.4/config/certs/es-test-01/es-test-01.crt
  certificate_authorities: /data/elasticsearch-8.11.4/config/certs/ca/ca.crt
  verification_mode: certificate

# Enable encryption and mutual authentication between cluster nodes
#这里修改为上一步生成的证书
xpack.security.transport.ssl:
  enabled: true
  key: /data/elasticsearch-8.11.4/config/certs/es-test-01/es-test-01.key
  certificate: /data/elasticsearch-8.11.4/config/certs/es-test-01/es-test-01.crt
  certificate_authorities: /data/elasticsearch-8.11.4/config/certs/ca/ca.crt
  verification_mode: certificate

# Create a new cluster with the current node only
# Additional nodes can still join the cluster later
# 初始主节点列表，用于集群自动发现
cluster.initial_master_nodes: ["es-test-01"]

# Allow HTTP API connections from anywhere
# Connections are encrypted and require user authentication
http.host: 0.0.0.0
http.port: 9200
# Allow other nodes to join the cluster from anywhere
# Connections are encrypted and mutually authenticated
#transport.host: 0.0.0.0

#----------------------master-- END SECURITY AUTO CONFIGURATION -------------------------

```

正常启动 Elasticsearch 验证是否配置成功

### 配置 kibana

我们针对 Kibana 进行配置。首先把之前生成的 kibana 证书拷贝过来
ca 和 kibana 两个目录

cp -R ca /etc/kibana/certs/
cp -R kibana /etc/kibana/certs/

根据文档  [https://www.elastic.co/guide/en/elasticsearch/reference/current/service-accounts.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/service-accounts.html "https://www.elastic.co/guide/en/elasticsearch/reference/current/service-accounts.html")，我们创建一个 elastic/kibana 服务账号。我们在 terminal 下打入如下的命令：
`./bin/elasticsearch-service-tokens create elastic/kibana kibana-token`
我们记下这个 service token。将在下面的配置中使用。

我们是使用如下的命令来把上面的 service token 放进 keystore。我们可以在如下的地址发现已经存在一个叫做 kibana.keystore 的文件。我们无需去重新创建这个文件。
kibana 安装目录/bin

```sh
# 以下命令都在kibana的bin目录下执行
#创建密钥库
./kibana-keystore create
#添加密钥
./kibana-keystore add elasticsearch.serviceAccountToken
#输入上一步生成的service token
#检查是否设置成功
./kibana-keystore list
```

##### kibana.yml

```yaml
server.publicBaseUrl: "https://192.168.2.7:5601"
server.host: "0.0.0.0"
server.port: 5601
server.ssl.enabled: true
server.ssl.certificate: /data/kibana-8.11.4/config/certs/Kibana/Kibana.crt
server.ssl.key: /data/kibana-8.11.4/config/certs/Kibana/Kibana.key
elasticsearch.ssl.certificateAuthorities: [ "/data/kibana-8.11.4/config/certs/ca/ca.crt" ]
elasticsearch.ssl.verificationMode: full
elasticsearch.hosts: ["https://192.168.2.7:9200"]
i18n.locale: "zh-CN"
```

## 索引库操作

索引库就类似数据库表，mapping 映射就类似表的结构。

我们要向 es 中存储数据，必须先创建“库”和“表”。

### 1. Mapping 映射属性

mapping 是对索引库中文档的约束，常见的 mapping 属性包括：

- type：字段数据类型，常见的简单类型有：

  - 字符串：text（可分词的文本）、keyword（精确值，例如：品牌、国家、ip 地址）
  - **keyword 类型只能整体搜索，不支持搜索部分内容,就是完全匹配**
  - 数值：long、integer、short、byte、double、float、
  - 布尔：boolean
  - 日期：date
  - 对象：object

- index：是否创建索引，默认为 true (设置为 true 说明这个字段可以搜索，可以通过这个字段搜索数据)

- analyzer：使用哪种分词器

- properties：该字段的子字段

例如下面的 json 文档：

```json
PUT /索引库名称
{
  "mappings": {
    "properties": {
      "字段名":{
        "type": "text",
        "analyzer": "ik_smart"
      },
      "字段名2":{
        "type": "keyword",
        "index": "false"
      },
      "字段名3":{
        "properties": {
          "子字段": {
            "type": "keyword"
          }
        }
      },
      // ...略
    }
  }
}

```

**示例：**

```json
PUT /conan
{
  "mappings": {
    "properties": {
      "column1":{
        "type": "text",
        "analyzer": "ik_smart"
      },
      "column2":{
        "type": "keyword",
        "index": "false"
      },
      "column3":{
        "properties": {
          "子字段1": {
            "type": "keyword"
          },
          "子字段2": {
            "type": "keyword"
          }
        }
      },
      // ...略
    }
  }
}

```

## ES 集群

集群读写流程

参考：
[ElasticSearch 查询流程详解](https://www.jianshu.com/p/56a74784d6ad)
[ElasticSearch 写入流程详解](https://www.jianshu.com/p/792f55451b89)
