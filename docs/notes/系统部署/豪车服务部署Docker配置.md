---
title: 豪车服务部署Docker配置
createTime: 2024/11/14 10:21:26
permalink: /系统部署/gmrtak1h/
---
# 部署脚本

```bat
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

# 应用服务 docker-compose.yml

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
      - /mydata/luxurycar/file/uploadPath/system:/mydata/system/uploadPath
      - /etc/localtime:/etc/localtime
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
      - /mydata/luxurycar/file/uploadPath/order:/mydata/order/uploadPath
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
      - /mydata/luxurycar/nginx/conf.d/nginx.conf:/etc/nginx/nginx.conf
      - /mydata/luxurycar/nginx/log:/var/log/nginx
      - /mydata/luxurycar/nginx/html:/usr/share/nginx/html
    networks:
      - sjy_luxurycar
  sjy-luxurycar-job:
    image: sjy/sjy-luxurycar-job:1.0.1
    container_name: sjy-luxurycar-job
    restart: always
    build:
      context: ./job
      dockerfile: dockerfile
    ports:
      - "9406:9203"
    volumes:
      - /mydata/luxurycar/job/logs:/mydata/job/logs
      - /etc/localtime:/etc/localtime
    networks:
      - sjy_luxurycar

networks:
  sjy_luxurycar:
    external: true

```

# 基础服务 docker-compose-env.yml

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

# Jar 镜像构建 dockerfile

```txt
# 基础镜像
FROM openjdk:8-jre

# 作者信息
MAINTAINER "sjy"

# 添加一个存储空间
VOLUME /mydata/gateway

#设置jvm时区（设置镜像时区)
RUN echo "Asia/Shanghai" > /etc/timezone

# 指定工作目录 RUN，CMD，ENTRPOINT，COPY和ADD指令的工作目录
WORKDIR /mydata/gateway

# 暴露8080端口（容器暴露端口）
EXPOSE 8080

# 添加变量，如果使用dockerfile-maven-plugin，则会自动替换这里的变量内容
ARG JAR_FILE=./jar/luxurycar-gateway.jar

# 往镜像中添加jar包
#copy是复制，复制文件到镜像中
copy ${JAR_FILE} luxurycar-gateway.jar

# 启动镜像自动运行程序（创建容器执行命令）
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/urandom","-jar","luxurycar-gateway.jar"]
```

# redis 配置文件

<mark style="background: #FF5582A6;">redis.conf</mark>

```conf
requirepass sjy82687733
tcp-keepalive 60
```

dockerfile

```txt
# 基础镜像
FROM redis
# author
MAINTAINER sjy

# 挂载目录
VOLUME /home/luxurycar/redis
# 创建目录
RUN mkdir -p /home/luxurycar/redis
# 指定路径
WORKDIR /home/luxurycar/redis
# 复制conf文件到路径
COPY ./conf/redis.conf /home/luxurycar/redis/redis.conf
```

# nginx

`nginx.conf`

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
