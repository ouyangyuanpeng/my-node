---
title: Ubuntu20安装
createTime: 2024/11/14 10:21:26
permalink: /Linux/fih4p8h0/
---
💡 本文安装 UbuntuServer，不带桌面

# 系统安装

- 开始安装
- 选择语言 默认即可，推荐英语

​![image.png](https://image.oyyp.top/pc/202311051526204.png)​

- 接下来如果出现下面的菜单，说明您安装的 Ubuntu Server 系统不是最新版本。 是否更新系统，默认即可

​![image.png](https://image.oyyp.top//pc/202311051529532.png)​

- 现在我们准备好选择您要安装的内容。 菜单中有三个选项：  
   Ubuntu Server - 默认安装常用的软件包，为您提供良好的操作体验。  
   Ubuntu Server (minimized) - 最小化安装，不建议选择此项。  
   Additonal options - 搜索第三方驱动程序。有一定的安全风险。

​![image.png](https://image.oyyp.top/pc/202311231504860.png)​

- 键盘布局。默认

​![image.png](https://image.oyyp.top//pc/202311051530842.png)​

- 配置 ip 地址，配置动态 ip 地址

​![image.png](https://image.oyyp.top/pc/202311051532977.png)​

- 服务器代理 直接回车

​![image.png](https://image.oyyp.top//pc/202311051532268.png)​

- 设置镜像源地址  
   接下来选择安装软件包的镜像源，Ubuntu 默认的官方镜像源下载很慢，需要更换成国内其他镜像源，更改为阿里云(https://mirrors.aliyun.com/ubuntu/)或者清华镜像源(https://mirrors.tuna.tsinghua.edu.cn/ubuntu/)并回车

​![image.png](https://image.oyyp.top//pc/202311051536890.png)​

- 配置存储，选择要安装的磁盘，直接回车  
   use ans entire disk:使用全部分区  
   custin storage layout: 自行分区

​![image.png](https://image.oyyp.top//pc/202311051538180.png)​

- 文件系统 检查磁盘分区是否符合你的要求 直接回车即可

​![image.png](https://image.oyyp.top/pc/202311051540217.png)​

- 然后会提示在进行破坏性操作，之前选择的硬盘上的数据都会丢失，而且安装过程不可逆，选择 Continue 然后回车

​![image.png](https://image.oyyp.top//pc/202311051541431.png)​

- 创建用户  
   接下来要创建一些用户信息，首先是自己的名字（Your name），这个就像在 windows 上面注册的 windows 账户一样，是一个类似姓名的东西。第二个是计算机名（Your server’s name），这个就是 windows 打开“我的电脑”看到的计算机名，标志着安装了 ubuntu 系统的整台电脑，在网络上连接时可能会有用。第三个是用户名（username），这个是非常重要的，是你在这个 ubuntu 系统上创建的第一个用户。再往下是用户名对应的密码，以及再次确认密码。

​![image.png](https://image.oyyp.top/pc/202311051543309.png)​

- 升级到专业版  
   直接默认，选择不升级即可

​![image.png](https://image.oyyp.top//pc/202311231509542.png)​

- .安装 SSH 服务

​![image.png](https://image.oyyp.top//pc/202311051545614.png)​

- 选择需要安装的组件，后续可以自行安装，直接回车

​![image.png](https://image.oyyp.top//pc/202311051546430.png)​

- 等待安装。。。
- 耐心等待安装完更新后，下面变成“reboot”重启，选择重启回车

​![image.png](https://image.oyyp.top/pc/202311051552552.png)​

# 安装后一些基本设置

## 设置网络

Ubuntu 20.04 引入了 Netplan 作为默认网络管理工具

```sh
# 查看网络
ip a
# 编辑网络设置
sudo vim /etc/netplan/00-installer-config.yaml

```

开启 DHCP eth0 是你的网卡名称

```yaml
network:
  ethernets:
    eth0:
      dhcp4: true
  version: 2

```

不开启 DHCP

```yaml
network:
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.2.39/24
      gateway4: 192.168.2.2
      nameservers:
        addresses: [223.5.5.5,114.114.114.114]
  version: 2

```

```yaml

network:
  ethernets:
    eth0:
      dhcp4: true
        #addresses: [192.168.137.2/24]
        #gateway4: 192.168.137.1
        #nameservers:
        #addresses: [192.168.137.1]
    eth1:
      dhcp4: no
        addresses: [192.168.2.12/24]
        gateway4: 192.168.2.1
        nameservers:
          addresses: [114.114.114.114]


  version: 2

```

使用 hype-v 搭建虚拟机网络设置

- eth0 外部虚拟交换机 （可以访问外网）
- eht1 内部虚拟交换机 （用户内部机器通讯）

```yaml
network:
  ethernets:
    eth0:
      dhcp4: true
    eth1:
      dhcp4: no
      addresses: [192.168.2.12/24]
  version: 2
```

修改后重启网络

```sh
sudo netplan apply
```

## 设置 root

```sh
# 设置root密码
sudo passwd root
```

开启 root 远程登录，可以参考，把 vi 替换为 vim  
Debian12 安装#开启 root 远程
