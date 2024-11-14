---
title: Debian12安装
createTime: 2024/11/14 10:21:26
permalink: /Linux/k1bnw63l/
---
# Debian12 安装

```ad-tip
💡本文安装的是Debian12是为了给服务器，所以不需要图形化桌面
```

# 系统安装

选择第一个使用图形化来安装系统

​![image.png](https://image.oyyp.top/pc/202311031018204.png)​

选择 English,选择中文会出现乱码

​![image.png](https://image.oyyp.top/pc/202311031021049.png)​

选择地区为 Hong Kong 因为这个也是 UTC+8 时区

​![image.png](https://image.oyyp.top/pc/202311031023405.png)​

服务器安装默认选择美式键盘

​![image.png](https://image.oyyp.top/pc/202311031024319.png)​

系统加载和扫描。。。。

设置主机(计算机)名称

​![image.png](https://image.oyyp.top/pc/202311031028304.png)​

设置域名可为 null

​![image.png](https://image.oyyp.top/pc/202311031030467.png)​

设置 root 密码

​![image.png](https://image.oyyp.top/pc/202311031031167.png)​

添加一个普通用户，设置用户名称

​![image.png](https://image.oyyp.top/pc/202311031032546.png)​

设置普通用户登录账户

​![image.png](https://image.oyyp.top/pc/202311031033580.png)​

设置普通用户密码

​![image.png](https://image.oyyp.top/pc/202311031033708.png)​

- 等待设定磁盘。。。

|     | 英文描述                                        | 中文释义                                                                                           |
| --- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | Guided-use entire disk                          | 带引导模式方式直接使用整块磁盘                                                                     |
| 2   | Guided-use entire disk and set up LVM           | 带引导模式方式使用整块磁盘并使用 LVM，LVM(Logical Volume Mananger)逻辑卷管理，可对磁盘进行弹性管理 |
| 3   | Guided-use entire disk and set up encrypted LVM | 带引导模式方式使用整块磁盘并使用加密的 LVM                                                         |
| 4   | Manual                                          | 完全手动模式                                                                                       |

​![image.png](https://image.oyyp.top/pc/202311031035610.png)​

按需求自己选择，本文选择第二个

- 选择磁盘

​![image.png](https://image.oyyp.top/pc/202311031036045.png)​

- 选择磁盘空间划分

|     | 英文描述                                              | 中文释义                                  |
| --- | ----------------------------------------------------- | ----------------------------------------- |
| 1   | All files in one partition(recommended for new users) | 所有的文件都位于一个分区中(推荐新用户)    |
| 2   | Separate /home partition                              | 单独设置 home 分区                        |
| 3   | Separate /home,/var,and /tmp partitions               | 单独设置 home 分区，var 分区以及 tmp 分区 |

单独设置 home 分区，好处是重装系统 home 分区可以不被格式化，本文不设置

​![image.png](https://image.oyyp.top/pc/202311031142290.png)​

- 确定分区修改

​![image.png](https://image.oyyp.top/pc/202311031144470.png)​

- 指定分区要使用的磁盘大小，默认使用整个磁盘的大小，默认即可

![image.png](https://image.oyyp.top//pc/202311031145705.png)

- 设置分区中。。。
- 获取将要对磁盘的操作信息，磁盘将被改变并分区格式化，选择：Yes

![image.png](https://image.oyyp.top//pc/202311031146224.png)

- 开始安装系统。。。
- 是否扫描介质

![image.png](https://image.oyyp.top//pc/202311031331172.png)

- 是否使用网络镜像源，选择：No ,后面会单独说明配置镜像源
- 是否每周发送脚本 NO

![image.png](https://image.oyyp.top/pc/202311031333145.png)

- 安装中。。。
- 选择桌面环境和服务，需要把 SSH Server 选择上，作为服务端把桌面环境全部关闭

![image.png](https://image.oyyp.top/pc/202311031335463.png)

- 安装中。。。
- 这里直接到了是否重启系统

![image.png](https://image.oyyp.top//pc/202311031337501.png)

可能安装桌面端是出现以下，我通过虚拟机并没有出现

```ad-warning
没有出现
1. 主硬盘安装GRUB引导加载程序，选择：Yes
2. 为GRUB加载引导程序选择安装的磁盘

```

# 安装后一些基本设置

vi 编辑器启用了兼容模式，就是兼容更古老版本的 vi 编辑器，导致无法正常按 i 键后输入字符，回退键也不好用，因此需要设置.

先用 vi 修改配置文件/etc/vim/vimrc.tiny 修改之前最好备份一下

将 set compatible 改为 set nocompatible

然后重新进入 vi 编辑，在 set nocompatible 的后面添加一行
set backspace=2

## 配置 Debian 软件源

[清华大学源](https://mirror.tuna.tsinghua.edu.cn/help/debian)

```sh
// 更新软件源
apt update
// 更新升级本机软件包
apt upgrade

apt install vim sudo
```

## 开启 root 远程

编辑 sshd 配置文件

```text
vi /etc/ssh/sshd_config
```

修改或添加内容（按 i 进入编辑，修改完，按 ESC，并输入:wq 保存退出）

```text
#PermitRootLogin prohibit-password
修改为
PermitRootLogin yes
```

应用并生效，重启 ssh

```sh
systemctl restart sshd.service
```

## 设置网络

```text
sudo vim /etc/network/interfaces
```

enp0s3 是你的网络接口名称

```text
auto enp0s3
iface enp0s3 inet static
        address 192.168.2.31/24
        network 192.168.2.0
        broadcast 192.168.2.255
        gateway 192.168.2.3
        dns-nameservers 223.5.5.5
```

要使上述更改生效，请重新启动网络服务

```text
sudo systemctl restart networking.service
```

end...

‍
