---
title: Netty
date: '2025-04-26 11:30:55'
meta: []
permalink: /post/netty-2pvsr5.html
author:
  name: terwer
  link: https://github.com/ouyangyuanpeng
---


<!-- more -->




# Netty

netty使用epoll  
Netty 是一个高性能的异步事件驱动的网络应用框架，用于快速开发可维护的高性能协议服务器和客户端。Netty 使用了一种称作 "事件循环" 的设计模式来处理并发，并通过多种传输机制实现，包括 NIO (非阻塞IO)。

在 Linux 系统中，Netty 支持使用 epoll 作为其底层网络传输的实现方式。epoll 是 Linux 下多路复用 IO 接口的其中一种，它是 select 和 poll 的增强版本，提供了更好的性能和可伸缩性。

如何在使用 Netty 时启用 epoll？  
要在 Netty 中使用 epoll，你需要确保你的系统支持 epoll 并且正确地配置你的 Netty 服务器或客户端以使用 epoll。以下是一些步骤和提示：

1. 确认操作系统支持  
    确保你的操作系统是 Linux，因为 epoll 只在 Linux 系统上可用。
2. 使用 Netty 的 Epoll 事件循环组  
    在创建 Netty 服务器或客户端时，你可以使用 EpollEventLoopGroup 来代替默认的 NioEventLoopGroup。例如：

```java
EventLoopGroup bossGroup = new EpollEventLoopGroup(1); // 用于接受新的连接
EventLoopGroup workerGroup = new EpollEventLoopGroup(); // 用于处理已接受的连接
try {
    ServerBootstrap b = new ServerBootstrap();
    b.group(bossGroup, workerGroup)
     .channel(EpollServerSocketChannel.class) // 使用 EpollServerSocketChannel
     .handler(new LoggingHandler(LogLevel.INFO))
     .childHandler(new ChannelInitializer<SocketChannel>() {
         @Override
         public void initChannel(SocketChannel ch) throws Exception {
             ch.pipeline().addLast(new MyServerHandler());
         }
     });
 
    ChannelFuture f = b.bind(port).sync(); // 绑定端口并启动服务器
    f.channel().closeFuture().sync();
} finally {
    bossGroup.shutdownGracefully();
    workerGroup.shutdownGracefully();
}
```

‍
