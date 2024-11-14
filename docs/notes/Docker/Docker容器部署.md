---
title: Docker容器部署
createTime: 2024/11/14 10:21:26
permalink: /Docker/3wlmr4l1/
---
[官网](https://www.docker.com/)  
镜像查看地址：[https://registry.hub.docker.com/](https://registry.hub.docker.com/) [https://hub.docker.com/](https://hub.docker.com/)

可参考：豪车服务部署 Docker 配置

# 命令

```bash
查看下载的镜像：docker images
查看运行的容器：docker ps -a    -a:查询全部 -q：查询id
下载镜像：docker pull
启动镜像：
docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root  \
-d mysql:5.7
-p:指定端口号，--name:容器名称  -d：后台运行 -e 环境变量 -v 挂载

进入容器内部：docker exec -it mysql /bin/bash    进入mysql容器内
查看网络 docker network ls
进入网络查看详情 docker network inspect ‘网络名称’
启动docker      systemctl start docker
设置开机启动     systemctl enable docker
[守护进程]重启   sudo systemctl daemon-reload
重启docker服务   systemctl restart  docker
重启docker服务  sudo service docker restart
关闭docker   service docker stop
关闭docker  systemctl stop docker
# 删除
docker stop id
docker rm id
docker rmi id

# 批量删除容器镜像
docker stop $(docker ps -a | grep "Exited" | awk '{print $1 }')  #停止容器
docker rm $(docker ps -a | grep "Exited" | awk '{print $1 }')     #删除容器
docker rmi $(docker images -a| grep "none" | awk '{print $3}')    #删除镜像


# 导出 save 命令 -o 指定导出的文件名称
docker save -o quay_io_coreos_etcd.tar 镜像:tag

# 导入load 命令
docker load < quay_io_coreos_etcd.tar



```

# dockerfile

构建镜像命令

```sh
// myfirstapp 为你的镜像名称 如: nginx:v3  最后的 . 代表本次执行的上下文路径
docker build -t myfirstapp .
```

```
# 基础镜像
FROM openjdk:8-jre

# 作者信息
MAINTAINER "sjy"

# 添加一个存储空间
VOLUME /mydata/promote

#设置jvm时区（设置镜像时区)
RUN echo "Asia/Shanghai" > /etc/timezone

# 指定工作目录 RUN，CMD，ENTRPOINT，COPY和ADD指令的工作目录
WORKDIR /mydata/promote

# 暴露9090端口（容器暴露端口）
EXPOSE 9090

# 添加变量，如果使用dockerfile-maven-plugin，则会自动替换这里的变量内容
ARG JAR_FILE=./jar/luxurycar-modules-promote.jar

# 往镜像中添加jar包
#copy是复制，复制文件到镜像中
copy ${JAR_FILE} luxurycar-modules-promote.jar

# 启动镜像自动运行程序（创建容器执行命令）
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/urandom","-jar","luxurycar-modules-promote.jar"]
```

# docker-compos

## 命令

```bash
# 启动Compose文件中定义的一个或多个已存在的服务容器。
docker-compose start [SERVICE...]

# 启动Compose文件中定义的一个或多个已存在的服务容器。
docker-compose stop [SERVICE...]

# 重启Compose文件中定义的一个或多个服务容器。
docker-compose restart [SERVICE...]

# -   删除原来的容器
docker-compose rm [SERVICE...]

# 启动并构建Compose文件中定义的服务
docker-compose up -d  --build

# 构建指定服务
docker-compose up -d [SERVICE...]

# 指定配置文件默认是docker-compose.yml
docker-compose -f docker-compose-env.yml up -d

# 停止并移除Compose文件中定义的所有服务、网络和卷。这是彻底清理所有资源的命令
# 指定配置文件停止，不加默认docker-compose.yml
docker-compose -f docker-compose-infrastructure.yml down


```

## 网络

使用 docker-compose up 会默认根据你的当前目录名称创建一个网络 目录名称：app，那么就是 app_default 这个是默认网络，在当前目录下启动的容器就会加入这个网络，那么容器之间可以直接通信 可以直接使用 容器名称访问。同一网络上的其他容器可以使用服务名称或此别名连接到服务的容器之一

```yml
version : '3'
services:
  sjy-license-admin:
    image: sjy/sjy-license-admin:1.0.1
    container_name: sjy-license-admin
    build:
      context: .
      dockerfile: sjy-license-dockerfile
    ports:
      - "10086:10086"
    volumes:
      - ./jar/logs:/mnt/sjyLicense/logs
      - /etc/localtime:/etc/localtime
    environment:
      - TZ=Asia/Shanghai
    # 加入网络
    networks:
      - sjy_license
# 声明一个网桥
networks:
  sjy_license:
    # 说明网络是外部的，必须先创建好，网络名称为sjy_license，执行docker-compose up -d 不会创建网络
    external: true
```

```yml
version : '3.5'
services:
  sjy-mysql:
    image: mysql:5.7
    container_name: sjy-mysql
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: sjyit
    ports:
      - 3309:3306
    volumes:
      - /home/mysql/data:/var/lib/mysql #数据文件挂载
      - /home/mysql/conf:/etc/mysql/conf.d #配置文件挂载
      - /home/mysql/log:/var/log/mysql #日志文件挂载
    # 加入网络
    networks:
      sjy_license:
        # 加入网络 其他服务可以通过 db这个域名访问 jdbc:mysql://db:3306/sjy_license
        aliases:
          - db
  nginx:
    image: nginx:1.20
    container_name: sjy-nginx
    volumes:
      - /mnt/sjyLicense/nginx/nginx.conf:/etc/nginx/nginx.conf #配置文件挂载
      - /mnt/sjyLicense/nginx/html:/usr/share/nginx/html #静态资源根目录挂载
      - /mnt/sjyLicense/nginx/log:/var/log/nginx #日志文件挂载
      - /mnt/sjyLicense/nginx/conf.d:/etc/nginx/conf.d
    ports:
      - 9080:80
    # 加入网络
    networks:
      sjy_license:
        # 访问别名
        aliases:
          - nginx
# 新建一个网络
networks:
  sjy_license:
    driver: bridge
    #指定网络名称
    name: sjy_license
```

## 应用配置文件

```yml
version : '3.8'
services:
  sjy-luxurycar-promote:
    image: sjy/sjy-luxurycar-promote:1.0.1
    container_name: sjy-luxurycar-promote
    restart: always
    build:
      context: ./promote
      dockerfile: dockerfile
    ports:
      - "10086:10086"
    volumes:
      - /mydata/luxurycar/promote/logs:/mydata/promote/logs
      - /mydata/luxurycar/file/uploadPath/promote:/mydata/promote/uploadPath
      - /etc/localtime:/etc/localtime
    networks:
      - sjy_luxurycar
  sjy-luxurycar-gateway:
    image: sjy/sjy-luxurycar-gateway:1.0.1
    container_name: sjy-luxurycar-gateway
    restart: always
    build:
      context: ./gateway
      dockerfile: dockerfile
    ports:
      - "9400:8080"
    volumes:
      - /mydata/luxurycar/gateway/logs:/mydata/gateway/logs
      - /etc/localtime:/etc/localtime
    networks:
      sjy_luxurycar:
        aliases:
         - gateway
  sjy-luxurycar-auth:
    image: sjy/sjy-luxurycar-auth:1.0.1
    container_name: sjy-luxurycar-auth
    restart: always
    build:
      context: ./auth
      dockerfile: dockerfile
    ports:
      - "9401:9200"
    volumes:
      - /mydata/luxurycar/auth/logs:/mydata/auth/logs
      - /etc/localtime:/etc/localtime
    networks:
      - sjy_luxurycar
  sjy-luxurycar-system:
    image: sjy/sjy-luxurycar-system:1.0.1
    container_name: sjy-luxurycar-system
    restart: always
    build:
      context: ./system
      dockerfile: dockerfile
    ports:
      - "9402:9201"
    volumes:
      - /mydata/luxurycar/system/logs:/mydata/system/logs
      - /etc/localtime:/etc/localtime
    # 表示这个服务依赖于`mysql`和`redis`两个服务，确保这两个服务先于`yudao-server`启动。
    depends_on:
      - mysql
      - redis
    networks:
      - sjy_luxurycar
  sjy-luxurycar-file:
    image: sjy/sjy-luxurycar-file:1.0.1
    container_name: sjy-luxurycar-file
    restart: always
    build:
      context: ./file
      dockerfile: dockerfile
    ports:
      - "9403:9300"
    volumes:
      - /mydata/luxurycar/file/logs:/mydata/file/logs
      - /mydata/luxurycar/file/uploadPath:/mydata/file/uploadPath
      - /etc/localtime:/etc/localtime
    networks:
      - sjy_luxurycar
  sjy-luxurycar-order:
    image: sjy/sjy-luxurycar-order:1.0.1
    container_name: sjy-luxurycar-order
    restart: always
    build:
      context: ./order
      dockerfile: dockerfile
    ports:
      - "9404:9205"
    volumes:
      - /mydata/luxurycar/order/logs:/mydata/order/logs
      - /mydata/luxurycar/order/payment/configuration/wechat:/mydata/order/payment/configuration/wechat
      - /etc/localtime:/etc/localtime
    networks:
      - sjy_luxurycar
  sjy-luxurycar-vehicle:
    image: sjy/sjy-luxurycar-vehicle:1.0.1
    container_name: sjy-luxurycar-vehicle
    restart: always
    build:
      context: ./vehicle
      dockerfile: dockerfile
    ports:
      - "9405:9204"
    volumes:
      - /mydata/luxurycar/vehicle/logs:/mydata/vehicle/logs
      - /etc/localtime:/etc/localtime
    networks:
      - sjy_luxurycar
  sjy-luxurycar-nginx:
    image: nginx:latest
    container_name: sjy-luxurycar-nginx
    restart: always
    ports:
      - "9410:80"
      - "443:443"
    volumes:
      - /mydata/luxurycar/nginx/cert:/etc/nginx/cert
      - /mydata/luxurycar/nginx/conf/nginx.conf:/etc/nginx/nginx.conf
      - /mydata/luxurycar/nginx/log:/var/log/nginx
      - /mydata/luxurycar/nginx/html:/usr/share/nginx/html
    networks:
      - sjy_luxurycar

networks:
  sjy_luxurycar:
    external: true

```

## 应用依赖

```yml
version : '3.8'
services:
  sjy-luxurycar-mysql:
    image: mysql:5.7
    container_name: sjy-luxurycar-mysql
    command: [
          'mysqld',
          '--innodb-buffer-pool-size=80M',
          '--character-set-server=utf8mb4',
          '--collation-server=utf8mb4_unicode_ci',
          '--default-time-zone=+8:00',
          '--lower-case-table-names=1'
        ]
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: sjyit
    ports:
      - 9500:3306
    volumes:
      - /mydata/luxurycar/mysql/data:/var/lib/mysql #数据文件挂载
      - /mydata/luxurycar/mysql/conf:/etc/mysql/conf.d #配置文件挂载
      - /mydata/luxurycar/mysql/log:/var/log/mysql #日志文件挂载
    networks:
      sjy_luxurycar:
        aliases:
          - db
  sjy-luxurycar-redis:
    container_name: sjy-luxurycar-redis
    image: redis
    restart: always
    ports:
      - 9501:6379
    build:
      context: ./redis
    volumes:
      - /mydata/luxurycar/redis/conf/redis.conf:/home/luxurycar/redis/redis.conf
      - /mydata/luxurycar/redis/data:/data
    command: redis-server /home/luxurycar/redis/redis.conf
    networks:
      sjy_luxurycar:
        aliases:
          - rs
  sjy-luxurycar-nacos:
    container_name: sjy-luxurycar-nacos
    image: nacos/nacos-server
    build:
      context: ./nacos
    environment:
      MODE: standalone
      SPRING_DATASOURCE_PLATFORM: mysql
      MYSQL_SERVICE_HOST: db
      MYSQL_SERVICE_PORT: 3306
      MYSQL_SERVICE_USER: luxurycar
      MYSQL_SERVICE_PASSWORD: sjy82687733
      MYSQL_SERVICE_DB_NAME: ry-config
      MYSQL_SERVICE_DB_PARAM: characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
    volumes:
      - /mydata/luxurycar/nacos/logs:/home/nacos/logs
#      - /mydata/nacos/conf/application.properties:/home/nacos/conf/application.properties
    ports:
      - "8848:8848"
      - "9848:9848"
      - "9849:9849"
    networks:
      sjy_luxurycar:
        aliases:
          - nacos
networks:
  sjy_luxurycar:
    driver: bridge
    name: sjy_luxurycar

```

## Nginx 配置文件

```conf
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    # 限制body大小
    client_max_body_size 100m;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    upstream server {
        ip_hash;
        # gateway 地址
        server 127.0.0.1:8080;
        # server 127.0.0.1:8081;
    }

    server {
        listen       80;
        server_name  localhost;

        # https配置参考 start
        listen       443 ssl;

        # 证书直接存放 /docker/nginx/cert/ 目录下即可 更改证书名称即可 无需更改证书路径
        ssl off;
        ssl_certificate      /etc/nginx/cert/scs1661392395295_query.isizhi.cn_server.crt; # /etc/nginx/cert/ 为docker映射路径 不允许更改
        ssl_certificate_key  /etc/nginx/cert/scs1661392395295_query.isizhi.cn_server.key; # /etc/nginx/cert/ 为docker映射路径 不允许更改
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        # https配置参考 end

        # 演示环境配置 拦截除 GET POST 之外的所有请求
        # if ($request_method !~* GET|POST) {
        #     rewrite  ^/(.*)$  /403;
        # }

        # location = /403 {
        #     default_type application/json;
        #     return 200 '{"msg":"演示模式，不允许操作","code":500}';
        # }

        # 限制外网访问内网 actuator 相关路径
        #location ~ ^(/[^/]*)?/actuator(/.*)?$ {
        #    return 403;
        #}

        #location / {
         #   root   /usr/share/nginx/html;
          #  try_files $uri $uri/ /index.html;
           # index  index.html index.htm;
        #}

        location / {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://gateway:8080;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}

```

## 一键部署脚本

```bash
echo "开始构建!!!"
cd /mydata/luxurycar
#echo "停止容器!!!"
#docker-compose stop ${app_name}
echo "删除容器!!!"
#docker-compose rm -f ${app_name}
#此命令可以已经停止删除通过默认docker-compose文件构建的容器和网络
docker-compose down

echo "启动容器!!!"
docker-compose up -d --build
echo "构建完成!!!"

```

启动脚本：

```bash
# 容器名称
app_name="sjy-license-admin"
# 镜像名称
app_image_name="sjy/sjy-license-admin"

echo "开始构建!!!"
cd /mydata/sjyLicense
#echo "停止容器!!!"
#docker-compose stop ${app_name}
echo "删除容器!!!"
#docker-compose rm -f ${app_name}
#此命令可以已经停止删除通过默认docker-compose文件构建的容器和网络
docker-compose down
echo "删除镜像!!!"
docker rmi $(docker images -q ${app_image_name})

echo "启动容器!!!"
docker-compose up -d --build
echo "构建完成!!!"
```
