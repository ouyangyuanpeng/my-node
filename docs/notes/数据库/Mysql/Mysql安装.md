---
title: Mysql安装
createTime: 2024/11/14 10:21:26
permalink: /数据库/er4d727g/
---
## Linux 安装

下载地址：[MySQL ：： 下载 MySQL 社区服务器（存档版本）](https://downloads.mysql.com/archives/community/)

### 创建 mysql 用户组和用户并修改权限

```bash
groupadd mysql
useradd -r -g mysql mysql
```

上传服务器，cd 到对应目录

解压缩

```sh
tar -xvf mysql-8.0.37-linux-glibc2.28-x86_64.tar.xz
```

修改压缩出来的文件夹名称(非必须)，只是为了方便后续操作

```sh
mv mysql-8.0.37-linux-glibc2.28-x86_64 mysql
```

创建数据目录和配置文件

```sh
cd mysql
#在mysql安装目录下
mkdir data
vim my.cnf
```

输入以下配置，可自行调整

```
# 数据库服务器设置
[mysqld]
# MySQL 服务监听的端口，默认是 3306
port=3306

# MySQL 运行的用户
user=mysql

# MySQL 的安装目录，即 `basedir`，指定 MySQL 二进制文件的位置
basedir=/usr/local/mysql

# 数据存放目录，指定数据库文件存储的路径
datadir=/usr/local/mysql/data

# MySQL 错误日志文件的位置，记录错误、警告和其他信息
log-error=/usr/local/mysql/logs/mysql.err

# MySQL 进程 ID 文件，保存当前 MySQL 服务的进程号
pid-file=/usr/local/mysql/logs/mysql.pid

# Unix socket 文件的路径，客户端可以通过此文件与 MySQL 服务进行本地连接
socket=/tmp/mysql.sock

# 最大允许的客户端连接数，超过此数目后新的连接会被拒绝
max_connections=200

# 客户端允许的最大连接错误次数，超过此数目后，客户端 IP 会被阻止连接
#max_connect_errors=1000

# 服务器等待一个连接的超时时间（秒），如果超过该时间没有活动，则关闭连接
#wait_timeout=600

# 交互式会话的超时时间（秒），与 `wait_timeout` 类似，专门针对交互式会话
#interactive_timeout=600

# 服务器默认使用的字符集，utf8mb4 支持完整的 Unicode，包括 emoji 字符
character-set-server=utf8mb4

# 服务器默认使用的字符排序规则，`utf8mb4_general_ci` 不区分大小写
collation-server=utf8mb4_general_ci

# MySQL 创建新表时默认使用的存储引擎，InnoDB 是现代数据库中常用的事务存储引擎
default-storage-engine=INNODB

# InnoDB 存储引擎的缓冲池大小，建议设置为服务器内存的 50% 左右（此处为 1GB）
innodb_buffer_pool_size=1G

# InnoDB 日志文件的大小，适当增大以减少日志切换次数（此处为 256MB）
innodb_log_file_size=256M

# 事务提交的日志刷新策略，设置为 2 提高性能，但可能在崩溃时丢失少量数据
innodb_flush_log_at_trx_commit=2

# 每个 InnoDB 表独立存储为一个表空间文件，便于管理和备份
innodb_file_per_table=1

# InnoDB 的刷新方法，O_DIRECT 避免双重缓存，提高 SSD 硬盘上的性能
innodb_flush_method=O_DIRECT

# 默认认证插件，`caching_sha2_password` 是 MySQL 8.0 之后推荐的更安全的认证方式
default_authentication_plugin=caching_sha2_password

# 将表名设为不区分大小写，适合跨平台应用（如 Windows 系统和 Linux 系统）
lower_case_table_names=1

# mysql命令设置 使用client可以不用单独设置除非特殊需求
[mysql]
# 设置 MySQL 客户端的默认字符集为 utf8mb4
default-character-set=utf8mb4

# mysql客户端设置包含mysql mysqladmin
[client]
# 客户端连接 MySQL 时默认使用的端口
port=3306

# 客户端连接时使用的默认字符集
default-character-set=utf8mb4

```

文件授权

```bash
chown mysql:mysql -R /usr/local/mysql
chmod 750 /usr/local/mysql
```

### 设置环境变量

添加到对应环境变量文件中  
​export PATH=$PATH:/usr/local/mysql/bin​  
加载环境变量  
如：source /home/用户目录/.bashrc​

### 初始化 mysql

```bash
mysqld --defaults-file=/opt/mysql/mysql/etc/my.cnf --user=mysql --initialize

```

参数说明：  
​--defaults-file​ 指向配置文件  
​--user​ 启动 mysql 的用户

执行后会在控制台中生成 root 密码

​![image.png](https://image.oyyp.top/img/202408211750848.png)​

查看密码

```bash
cat /usr/local/mysql/data/mysql.err
```

### 启动 mysql

```mysql

# 官方推荐使用mysqld_safe，使用mysqld_safe会出现一个守护进程，mysql服务停止后会自行恢复
mysqld_safe --user=mysql &
#指定配置文件启动
#  mysqld_safe  --defaults-file=/mnt/mysql8/my.cnf --user=mysql &
#
# 也可使用
mysql.server start
# 停止
mysql.server stop

```

```bash
cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql
service mysql start
```

参数说明：  
​--user​ 启动 mysql 的用户

使用 mysql -uroot -p 连接 mysql 然后修改 root 密码

```mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
# 刷新权限
FLUSH PRIVILEGES;
```

### 允许远程访问

使用 root 账号登录后创建一个可以远程访问的用户

```mysql
CREATE USER 'ycroot'@'%' IDENTIFIED BY 'YourNewPassword';

GRANT ALL PRIVILEGES ON *.* TO 'ycroot'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
```

### 停止 mysql

如果使用 mysqld_safe

```bash
mysqladmin -u root -p shutdown
```

### 如果非 root 用户

如果是使用非 root 用户，需要调用 mysql 的指令需要放入 bash -c 中或者直接 su 到 mysql 用户下执行  
建议直接通过 mysql 用户执行，以免出现问题

```bash
sudo -u mysql bash -c '/home/oyyp/db/mysql/bin/mysqld --defaults-file=/home/oyyp/db/mysql/my.cnf --user=mysql --initialize'
```

- ​sudo -u mysql​: 以 mysql​ 用户的身份执行后续命令。
- ​bash -c​: 启动一个新的 bash​ 子 Shell，以确保整个命令在同一环境下执行。
- ​'/home/oyyp/db/mysql/bin/mysqld --defaults-file=/home/oyyp/db/mysql/my.cnf --user=mysql --initialize'​: 这是你实际要执行的命令，它指定了 mysqld​ 的配置文件路径，并使用 mysql​ 用户来初始化数据库。

### 开机自启动

参考：[MySQL ：： MySQL 安全部署指南 ：： 5 安装后设置](https://dev.mysql.com/doc/mysql-secure-deployment-guide/8.0/en/secure-deployment-post-install.html#secure-deployment-systemd-startup)

创建：mysqld.service，文件内容如下：
```
[Unit]
Description=MySQL Community Server
After=network.target

[Service]
Type=forking
User=mysql
Group=mysql
ExecStart=/home/oyyp/db/mysql/bin/mysqld_safe --user=mysql
ExecStop=/home/oyyp/db/mysql/bin/mysqladmin shutdown
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```
# [Unit] 部分定义了服务的基本信息以及它与其他单元的关系。
[Unit]
Description=MySQL Server  # 对服务的一个简短描述。
Documentation=man:mysqld(8)  # 指向手册页中的 mysqld 命令文档。
Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html  # 指向 MySQL 官方在线文档关于使用 systemd 的部分。
After=network.target  # 确保 MySQL 在网络服务启动之后开始。
After=syslog.target  # 确保 MySQL 在系统日志服务启动之后开始。

# [Install] 部分定义了当该服务被启用时应该如何处理。
[Install]
WantedBy=multi-user.target  # 当系统进入多用户模式（非图形界面）时，此服务应被激活。

# [Service] 部分定义了如何控制和管理服务。
[Service]
User=mysql  # 使用 'mysql' 用户运行 MySQL 服务，提高安全性。
Group=mysql  # 使用 'mysql' 组运行 MySQL 服务，提高安全性。

# Have mysqld write its state to the systemd notify socket
Type=notify  # 设置为 notify 类型，以便 mysqld 可以通过 systemd 的通知套接字告知其状态变化。

# Disable service start and stop timeout logic of systemd for mysqld service.
TimeoutSec=0  # 禁用启动和停止超时逻辑，不限制 MySQL 启动或停止的时间。

# Start main service
ExecStart=/usr/local/mysql/bin/mysqld --defaults-file=/etc/my.cnf $MYSQLD_OPTS  # 启动 MySQL 服务的命令，使用 /etc/my.cnf 作为默认配置文件，并允许传递额外选项。

# Use this to switch malloc implementation
EnvironmentFile=-/etc/sysconfig/mysql  # 引入环境变量文件，如果文件不存在则不报错。

# Sets open_files_limit
LimitNOFILE = 10000  # 设置 MySQL 进程的最大打开文件数限制。

Restart=on-failure  # 如果服务非正常退出，则自动重启服务。

RestartPreventExitStatus=1  # 如果服务退出状态码为 1，则不触发自动重启。

# Set environment variable MYSQLD_PARENT_PID. This is required for restart.
Environment=MYSQLD_PARENT_PID=1  # 设置环境变量 MYSQLD_PARENT_PID，可能对于正确重启服务是必要的。

PrivateTmp=false  # 不为 MySQL 创建独立的临时文件系统，使用系统的全局临时目录。
```

- ​ExecStart​: 启动 MySQL 服务的命令。
- ​ExecStop​: 停止 MySQL 服务的命令。

```bash
# 重新加载 `systemd` 配置
sudo systemctl daemon-reload

# 启用 MySQL 服务开机自启动
sudo systemctl enable mysql

# 启动 MySQL 服务
sudo systemctl start mysql

# 检查 MySQL 服务状态
sudo systemctl status mysql

#禁用开机自启动
sudo systemctl disable mysql

```

注：如果 mysql.sock 不是默认名称，那么 mysql -u 需要添加 -S /tmp/mysql8.sock 指定文件 mysqladmin 也需要添加才能正常退出
