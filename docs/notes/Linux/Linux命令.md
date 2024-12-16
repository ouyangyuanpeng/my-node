---
title: Linux命令
createTime: 2024/11/14 10:21:26
permalink: /Linux/sndhougl/
---
命令参考地址：[Linux 命令搜索引擎 命令，Linux Linux 命令搜索引擎 命令详解：最专业的 Linux 命令大全，内容包含 Linux 命令手册、详解、学习，值得收藏的 Linux 命令速查手册。 - Linux 命令搜索引擎](https://man.zch.ooo/)

## 用户

### 限制 root 用户远程登录的方法

```bash
#查看sshd_config文件
#修改去掉PermitRootLogin前的注释，修改值为no 清除root用户远程登录
vim /etc/ssh/sshd_config
#重启ssh
service sshd restart
```

### 添加普通用户 sudo 权限

修改 sudoers 文件 vim /etc/sudoers  
找到 root ALL=(ALL) ALL  
在下面加上 用户名 ALL=(ALL) ALL  
​![image.png](https://cdn.nlark.com/yuque/0/2022/png/22644735/1657093495700-adebc079-b473-459a-9f77-7281eeaca17d.png#clientId=u321ac685-536e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=183&id=u1be6242e&margin=%5Bobject Object%5D&name=image.png&originHeight=183&originWidth=569&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15518&status=done&style=none&taskId=ufd29153e-3197-4363-b700-25b92afd0bc&title=&width=569)​

### 创建用户

加入我需要添加一个用户叫做 git

```bash
#添加用户
useradd git
#设置用户密码
passwd git
# 验证用户
id git

```

### 设置目录权限

查看目录权限 ls -l

drwxr-xr-x

d 表示目录
rwx 表示文件所有者有读写执行，如果是目录的话执行就是可以进入目录
r-x 表示所属组有读取执行没有写入
r-x 表示其他用户可以读取执行

每个数字可以取 0 到 7 之间的值，每个值对应不同的权限组合：

- 0：无权限
- 1：执行权限（x）
- 2：写入权限（w）
- 3：写入和执行权限（wx）
- 4：读取权限（r）
- 5：读取和执行权限（rx）
- 6：读取和写入权限（rw）
- 7：读取、写入和执行权限（rwx）

权限模式由三个数字组成，分别表示：

- 第一位数字：所有者的权限
- 第二位数字：所属组的权限
- 第三位数字：其他用户的权限

```bash
# 设置目录所有权 将目录的所有权设置为 git 用户和 git 组
chown -R git:git /home/git/repositories

# 设置所有者读写执行权限，同组用户和其他人只读权限
chmod -R 750 /home/git

# 设置所有者读写执行权限，同组用户和其他人只读权限
chmod -R 755 /home/git

# 设置所有者读写权限，同组用户读写权限，其他人无权限
chmod -R 770 /home/git

# 设置所有者读写执行权限，同组用户读写权限，其他人只读权限
chmod -R 775 /home/git

# 所有者、所属组和其他用户都有读、写、执行权限
chmod -R 777 /home/git
```

## 防火墙

```bash
# centOS7系统防火墙操作：

#出现 Active: active (running)高亮显示则表示是启动状态。
#出现 Active: inactive (dead)灰色表示停止，看单词也行。
systemctl status firewalld
# 开启
systemctl start firewalld
# 重启
systemctl restart firewalld
# 关闭
systemctl stop firewalld

# 重新加载配置
firewall-cmd --reload

# 查看开放端口
firewall-cmd --list-ports

# 开启防火墙
firewall-cmd --zone=public --add-port=9200/tcp --permanent

# 关闭防火墙
firewall-cmd --zone=public --remove-port=9200/tcp --permanent


# 查询端口是否被占用
ss -tuln | grep 9080
netstat -tuln | grep 8080

```

## systemctl管理服务

```bash

service-name：服务名称

systemctl start service-name

systemctl stop service-name

systemctl restart service-name

systemctl status service-name

#启用服务开机自启
systemctl enable service-name

#禁用服务开机自启
systemctl disable service-name

# 修改service-name.service后刷新 重新加载systemd配置以使更改生效

systemctl daemon-reload

```

## 文件

```bash
#创建文件夹
mkdir /mydata
#创建新的空文件file2.txt
touch file2.txt
#创建文件file3.txt并将this is a new file写入 >是覆盖，>>是追加
echo "this is a new file" > file3.txt
#设置文件夹的用户 -r代表目录和目录下全部 用户名称：用户组
chown -R oyyp /mydata
# 目录授权 755 其他用户 可读 可执行  777为全部用户读写执行
chmod 755 /apache-tomcat-8.5
#查看文件并且显示行号
cat -Ab /var/log/boot.log
#创建文件
touch text.txt
#强制删除某个目录及其子目录
rm -rf 文件目录/文件
#用于拷贝文件，例如将test1目录复制到test2目录
cp -r /mydata/tes1 /mydata/test2
#移动覆盖文件
mv text.txt text2.txt
# 用gzip压缩文件夹/etc中的文件到文件etc.tar.gz：
tar -zcvf /mydata/etc.tar.gz /etc
#解压文件到当前目录
tar -zxvf /mydata/etc.tar.gz
#find在指定目录下查找
find path -name testfile
find / -name nginx
#模糊匹配
find / -name nginx*
#最近20分钟内修改的文件
find / -mmin -20
#最近1天内修改的文件
find / -mtime -1


telnet ip 端口
```

## 分区

```bash
# 查看历史命令
history
# 查看硬盘目录结构
lsblk
# 查看硬盘是否有格式化文件系统
lsblk -f
# 查看分区挂载使用情况
df -h或者(l)
# //添加一个新的磁盘 （然后会出现一些选项用于分区）
fdisk /dev/vdb
# 使用partprobe让kernel读取分区信息 不用重启系统
partprobe
# 在特定分区建立文件系统 格式化分区
mkfs -t ext4 /dev/vdb1
# 它可以将分区挂接到Linux的一个文件夹下，从而将分区和该目录联系起来，因此我们只要访问这个文件夹，就相当于访问该分区了
mount /dev/vdb1 /data
# 上面的主机重启后需要重新挂载
# 在主机重启后挂载不会失效
# 获取uuid
blkid | grep -i /dev/vdb
或者 lsblk -f
# 修改文件系统表fstab
cat /etc/fstab
vi /etc/fstab
# 添加内容
# UUID /磁盘路径挂载点 磁盘类型（ext4或者xfs根据你创建的文件系统类型） defaults 0 0
UUID=15a6a778-11b8-4e74-b1df-e76a7335cc01 /mnt/hz_data01  xfs  defaults  0 0
UUID=e7635f7f-277d-4921-b3e6-c4f33ee872bc /mnt/hz_data02  xfs  defaults  0 0

输入命令mount -a并按回车。检查挂载信息是否正确，正确不会输出信息。

```
