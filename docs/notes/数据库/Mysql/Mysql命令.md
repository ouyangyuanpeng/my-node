---
title: Mysql常用命令
createTime: 2024/11/14 10:21:26
permalink: /数据库/q4ixe7t0/
---
## 连接 mysql

```sh
# 注意，如果是连接到另外的机器上，则需要加入一个参数-h机器IP --socket 指定mysql.sock目录
mysql -h <hostname> -P <port> -u<username> -p密码

mysql -h 192.168.1.100 -P 9306 -uroot -proot
```

- use：使用某个数据库。
- show databases：显示所有数据库。
- set names：设置字符集编码。

## 显示数据库中的表名和结构

```sh
use 库名;
show tables;
# 显示表结果
desc sys_user;
```

## 导出数据

```mysql
# 导出整个数据库
mysqldump -uusername -ppassword -h hostname database_name > /path/output_file.sql
# 导出某个表
mysqldump -uusername -ppassword -h hostname database_name table_name > output_file.sql
# 导出数据结构不导出数据
mysqldump -uusername -ppassword -h hostname --no-data database_name > output_file.sql
# 导出数据不导出结构
mysqldump -uusername -ppassword -h hostname --no-create-info database_name > output_file.sql
#导出的数据进行压缩，以减小文件大小。例如，使用 gzip：
mysqldump -uusername -ppassword -h hostname database_name | gzip > output_file.sql.gz
# 导出 SQL 格式的数据到指定文件，如下所示
mysqldump -uroot -ppassword database_name > dump.sql
```

参数说明：

- ​-u​: 指定 MySQL 用户名。
- ​-p​: 提示输入密码。后面可以不写密码
- ​-h​: 指定 MySQL 主机名。
- ​-P​: 指定 MySQL 端口
- ​database_name​: 要导出的数据库名称。
- ​output_file.sql​: 导出数据保存到的文件。
- ​--default-character-set=utf8mb4​

如果是 window 下导出乱码就需要以下方式

```
 mysqldump -uroot -proot --hex-blob sjy-cabinet --result-file=D:\mysql\dump.sql
```

参数说明：  
``--hex-blob, 这个参数主要是为了把 ​BINARY, ​VARBINARY, ​BLOB, ​BIT 等类型导出为十六进制 ​

## 导入数据

```
# 建库
CREATE DATABASE `sjy-cabinet-nb` CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci'
use 数据库名;
# 导入数据库脚本文件
source d:/mysql.sql;

```

```mysql
mysql -u 用户名 -p 要导入的数据库名 < 数据库名.sql

mysql -u root -p db_doc < 20210616.sql
```

## 用户相关

删除用户

```mysql
DROP USER 'root'@'%';
```

创建用户

```mysql
# 创建一个用户并且这个用户可以远程访问
CREATE USER 'root'@'%' IDENTIFIED BY 'YourNewPassword';

# 创建一个用户并且这个用户只能本地访问
CREATE USER 'root'@'localhost' IDENTIFIED BY 'YourNewPassword';

# 创建一个用户并且这个用户只能192.168.1.10 如果多个就多条或者使用通配符192.168.1.*
CREATE USER 'example_user'@'192.168.1.10' IDENTIFIED BY 'password';

```

修改用户

```mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
```

设置权限

```mysql

# 设置权限
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
# 设置查询权限
GRANT SELECT ON database_name.* TO 'example_user'@'host';

# 设置查询权限
GRANT SELECT ON my_database.* TO 'example_user'@'%';

# 刷新权限
FLUSH PRIVILEGES;
```

- GRANT ALL PRIVILEGES:
  - ​GRANT​ 是 MySQL 中用于授予权限的命令。
  - ​ALL PRIVILEGES​ 表示授予用户所有可能的权限，包括 SELECT​、INSERT​、UPDATE​、DELETE​、CREATE​、DROP​ 等。这意味着 root​ 用户将拥有对 MySQL 服务器中所有数据库和表的完全控制权。
- ON .:
  - ​ON​ 指定权限应用于哪些数据库和表。
  - ​*.*​ 表示所有数据库中的所有表。第一个 *​ 表示所有数据库，第二个 *​ 表示所有表。例如，ON database_name.table_name​ 可以将权限限制在特定数据库的特定表上。
- TO 'root'@'%':
  - ​TO​ 指定授予权限的用户。
  - ​'root'@'%'​ 表示用户名为 root​，且可以从任何主机（%​ 是通配符，表示任意 IP 地址）连接到 MySQL 服务器。如果你想限制到特定 IP 地址或主机名，可以将 %​ 替换为具体的 IP 地址或主机名（如 'root'@'192.168.1.100'​）。
- WITH GRANT OPTION:
  - ​WITH GRANT OPTION​ 允许 root​ 用户将他拥有的权限授予其他用户。这意味着 root​ 用户不仅可以执行所有操作，还可以为其他用户分配权限。
- ​'example_user'@'host'​: 这是你要授予权限的用户。host​ 表示用户可以从哪个主机访问数据库。可以将 host​ 替换为特定 IP 地址或主机名，也可以使用 %​ 代表任意主机。

## 创建数据库

```mysql
CREATE DATABASE `cs` CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci'
```
