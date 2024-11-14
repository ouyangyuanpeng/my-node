---
title: Java安装部署
createTime: 2024/11/14 10:21:26
permalink: /技术栈/p3ojeuke/
---
## java 启动参数说明

```ad-info
以下为jdk1.8
~~~sh
java -Dname=sjy-cabinet-admin -Duser.timezone=Asia/Shanghai -Xms1024m -Xmx2048m -XX:MetaspaceSize=512m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:NewRatio=1 -XX:SurvivorRatio=30 -XX:+UseParallelGC -XX:+UseParallelOldGC -jar sjy-cabinet-admin.jar
~~~
```

**参数说明**

- `-Dname=sjy-cabinet-admin`: 设置系统属性 `name` 的值为 `sjy-cabinet-admin`。
- `-Duser.timezone=Asia/Shanghai`: 设置系统的时区为亚洲/上海时区。
- `-Dfile.encoding=UTF-8` 指定编码为 UTF-8
- `-XX:MaxGCPauseMillis=50` 目标最大 STW（Stop-the-world） 时间，这个越小，GC 占用 CPU 资源，占用内存资源就越多，微服务吞吐量就越小，但是延迟低。这个需要做成可配置的
- `-Xms1024m`: 设置初始堆大小为 1024MB。
- `-Xmx2048m`: 设置最大堆大小为 2048MB。
- **`-Xss512k`**: 设置每个线程的栈大小为 512KB。默认值通常是 1MB，但对于多数应用，512KB 可能已经足够。
- `-XX:MetaspaceSize=512m`: 设置元空间初始大小为 512MB。
- `-XX:MaxMetaspaceSize=1024m`: 设置元空间最大大小为 1024MB。
- `-XX:+HeapDumpOnOutOfMemoryError`: 当发生 OutOfMemoryError 时生成堆转储文件。
- `-XX:+PrintGCDateStamps`: 打印垃圾回收的日期时间戳。
- `-XX:+PrintGCDetails`: 打印详细的垃圾回收信息。
- `-XX:NewRatio=1`: 配置新生代（Young Generation）与老年代（Old Generation）的大小比例为 1:1。
- `-XX:SurvivorRatio=30`: 配置 Eden 区与 Survivor 区的大小比例为 30:1。
- `-XX:+UseParallelGC`: 启用并行垃圾回收器（Parallel Garbage Collector）。
- `-XX:+UseParallelOldGC`: 启用并行老年代垃圾回收器。
- **`-XX:+UseContainerSupport`**: 启用容器支持，让 JVM 更好地适应容器环境下的资源限制。
- **`-XX:+UseStringDeduplication`**: 启用字符串去重，这对大量相同字符串的应用可以减少内存占用。
- **`-XX:MetaspaceSize=128m`**: 设置初始元空间大小为 128MB。
- **`-XX:MaxMetaspaceSize=256m`**: 设置最大元空间大小为 256MB。
- **`-XX:MaxGCPauseMillis=200`**: 目标 GC 暂停时间设置为 200 毫秒。这可以帮助 G1 优化暂停时间，使应用在处理垃圾回收时更具响应性。

jdk17 中引入了新的垃圾回收器

目前正常微服务综合内存占用+延迟+吞吐量，还是 G1 更优秀。但是如果你的微服务本身压力没到机器极限，要求延迟低，那么 ZGC 最好。如果你是实现数据库那样的需求（大量缓存对象，即长时间生存对象，老年代很大，并且还会可能分配大于区域的对象），那么必须使用 ZGC。

在一个只有 2GB 内存和 2 核 CPU 的服务器上，G1GC 是更好的选择，因为它更适合这种资源受限的环境。如果将来你的应用需要迁移到更大的服务器，并且对延迟有更高的要求，那么你可以考虑使用 ZGC。如果你有更高的内存和 CPU 资源，并且应用对延迟特别敏感，那么 ZGC 是一个很好的选择。在更大的服务器上，例如 8GB 内存、4 核或以上的环境，ZGC 的低延迟特性将会非常有用。

`-XX:+UseG1GC` 或者 `-XX:+UseZGC`
在 JDK 17 中，`-XX:+UseParallelOldGC` 是用于启用并行老年代垃圾回收的选项。然而，ZGC 是一种全新的垃圾回收器，不再依赖于并行垃圾回收器或并行老年代垃圾回收器。
因此，如果你决定使用 ZGC，不再需要 `-XX:+UseParallelOldGC` 这个选项。ZGC 会自动处理老年代的垃圾回收，并且它的设计目标之一就是降低垃圾收集的停顿时间。

## 安装

```
rpm -ivh jdk-8u361-linux-x64.rpm
```

vim /etc/profile

```
export JAVA_HOME=/usr/java/jdk1.8.0_361-amd64
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```

source /etc/profile

### 非 root 用户安装

如果无法使用 root 用户，但是服务器已经配置了 jdk1.8 的环境变量，我们不使用全局配置的 jdk
但是需要使用 jdk17，无法编辑 vim /etc/profile
可以使用当前用户自己的环境变量
vim /home/用户目录/.bashrc
`export PATH=$PATH:$JAVA_HOME/bin` 替换为`export PATH=$JAVA_HOME/bin:$PATH`

```
export JAVA_HOME=/usr/java/jdk1.8.0_361-amd64
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```

source /home/用户目录/.bashrc

## 开机自启动 java 应用

创建文件

sudo vim /etc/systemd/system/cabinet.service

输入以下内容

```bash
[Unit]
Description=My Java Application
After=network.target

[Service]
Type=simple
User=你要启动这个应用的用户
WorkingDirectory=jar包所在目录
ExecStart=jdk目录/bin/java -XX:+HeapDumpOnOutOfMemoryError -XX:+UseG1GC -jar jar包目录
Restart=always
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

```bash
# 加载。每次修改*.service都需要重新加载
sudo systemctl daemon-reload
# 启动
sudo systemctl start cabinet.service
# 开机自启动
sudo systemctl enable cabinet.service
```

停止和重启服务

```bash
sudo systemctl stop cabinet.service

sudo systemctl restart cabinet.service

# 查看服务状态
sudo systemctl status cabinet.service
```
