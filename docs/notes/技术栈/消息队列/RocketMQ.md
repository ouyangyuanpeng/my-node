---
title: RocketMQ
createTime: 2024/11/14 10:21:26
permalink: /技术栈/xj4lud05/
---

[文档地址](https://rocketmq.apache.org/)

## 概念

### Name Server

1. 它负责管理整个集群的路由信息，提供轻量级的服务发现功能。Name Server 是无状态的，可以水平扩展，以提高系统的可用性和性能。

2. 相当于一个服务注册中心，负责管理全部的 Broker，当 Broker 启动时，会向所有 Name Server 发送心跳包，注册自己的地址和状态信息。

3. Name Server 负责管理 Topic 的路由信息，包括哪些 Broker 存储了哪些 Topic 的消息队列。当一个新的 Broker 加入集群或一个 Broker 离线时，Name Server 会更新路由信息，确保生产者和消费者能够正确地找到目标 Broker。

4. 存储的是所有 Broker 的路由信息，包括 Master 和 Slave 节点。Name Server 不区分 Master 和 Slave 节点，而是将所有 Broker 的信息都注册到其内部的路由表中。这样，生产者和消费者可以通过 Name Server 获取到完整的 Broker 列表，并根据这些路由信息选择合适的 Broker 进行消息的发送和接收。

5. 生产者或者消费者都需要通过 Name Server 来获取对应 Topic 下的 Broker，然后创建连接进行生产消费信息

Name Server 相当于是一个服务注册中心，他可以找到对应的 Broker，也可以找到对应的消费者，通过 Name Server 我们可以找到我们 Broker,，然后进行连接，实际处理消息的是 Broker。

他可以维护 Topic 和 Broker 的关系，这样的话消费者生产者可以 Name Server 找到想要的 Broker

### Broker

Broker 是 RocketMQ 中的一个重要组件，它负责存储消息、管理消息队列、处理生产者和消费者的请求。Broker 可以分为 Master 节点和 Slave 节点，形成主从架构，以提高系统的可靠性和可用性。

生产者消费者实际是通过连接 Broker 来生产消费信息

### Topic

是消息的主题，是生产者和消费者之间传递消息的逻辑通道。一个 Topic 可以包含多个消息队列。Topic 包含的队列其实是在 Broker 中

生产者通过 Name Server 获取到对应 Topic 下的 Broker，通过一些算法获取对应的 Broker，优先是 Master 节点，建立连接，然后发生消息到 Broker 中，Broker 接收到消息后，返回确认响应给生产者

消费者通过 Name Server 获取到对应 Topic 下的 Broker
