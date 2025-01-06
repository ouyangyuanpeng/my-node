---
title: Nginx安装部署
createTime: 2024/11/14 10:21:26
permalink: /技术栈/fioww2t9/
---
[Nginx 反向代理和缓存服务功能说明和简单实现 - 运维笔记 - 散尽浮华 - 博客园](https://www.cnblogs.com/kevingrace/p/5839698.html)

# nginx 命令

```js
nginx -s stop       快速关闭Nginx，可能不保存相关信息，并迅速终止web服务。
nginx -s quit       平稳关闭Nginx，保存相关信息，有安排的结束web服务。
nginx -s reload     因改变了Nginx相关配置，需要重新加载配置而重载。
nginx -s reopen     重新打开日志文件。
nginx -c filename   为 Nginx 指定一个配置文件，来代替缺省的。
nginx -t            不运行，而仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件。
nginx -v            显示 nginx 的版本。
nginx -V            显示 nginx 的版本，编译器版本和配置参数。
```

# nginx 安装

下载地址：https://nginx.org/en/download.html  
需要 zlib : [Releases · madler/zlib (github.com)](https://github.com/madler/zlib/releases)  
需要 pcre [Releases · PCRE2Project/pcre2 (github.com)](https://github.com/PCRE2Project/pcre2/releases)  
需要 openssl [下载 |图书馆 (openssl-library.org)](https://openssl-library.org/source/index.html)  
需要 gcc 环境  
依赖的可以通过 yum 安装 内网环境就需要自行上传压缩包

```sh
# 查看是否安装
rpm -qa gcc
# 或者
yum list installed | grep gcc

yum install -y gcc pcre pcre-devel zlib zlib-devel openssl openssl-devel
```

​![image.png](https://image.oyyp.top/img/202408081407889.png)​

把下载的 nginx pcre zlib openssl 压缩包上传到服务器目录 全部解压缩

```sh

tar -zxvf nginx-1.26.1.tar.gz

cd nginx-1.26.1

# 指定配置
./configure --prefix=/usr/local/nginx \
--sbin-path=/usr/local/nginx/sbin/nginx \
--modules-path=/usr/local/nginx/modules \
--conf-path=/usr/local/nginx/conf/nginx.conf \
--error-log-path=/usr/local/nginx/logs/error.log \
--http-log-path=/usr/local/nginx/logs/access.log \
--pid-path=/usr/local/nginx/logs/nginx.pid \
--lock-path=/usr/local/nginx/logs/nginx.lock \
--with-http_ssl_module \
--with-pcre=../pcre2-10.44 \
--with-zlib=../zlib-1.3.1 \
--with-openssl=../openssl-3.3.1
# 编译安装
make && make install


```


## 配置文件说明

```conf
location / {
    # 1. 定义根目录，用于指定请求的文件路径
    root /var/www/html;

    # 2. 定义默认索引文件，当请求路径为目录时，Nginx 会尝试加载这些文件
    index index.html index.htm index.php;

    # 3. 启用或禁用目录列表（当请求路径为目录且没有索引文件时）
    autoindex off; # off 表示禁用目录列表，on 表示启用

    # 4. 设置反向代理，将请求转发到后端服务器
    proxy_pass http://backend_server;

    # 5. 设置反向代理的请求头
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # 6. 启用或禁用缓冲（适用于反向代理）
    proxy_buffering on; # on 表示启用缓冲，off 表示禁用

    # 7. 设置客户端请求体的最大大小（默认 1m）
    client_max_body_size 10m;

    # 8. 设置客户端请求体的超时时间（默认 60s）
    client_body_timeout 60s;

    # 9. 设置客户端请求头的超时时间（默认 60s）
    client_header_timeout 60s;

    # 10. 设置发送响应的超时时间（默认 60s）
    send_timeout 60s;

    # 11. 启用或禁用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 12. 设置缓存控制头（适用于静态资源）
    expires 1d; # 缓存 1 天

    # 13. 允许或拒绝特定 IP 访问
    allow 192.168.1.0/24; # 允许 192.168.1.0/24 网段访问
    deny all; # 拒绝其他所有 IP 访问

    # 14. 重定向请求到另一个 URL
    return 301 https://example.com/new-path;

    # 15. 自定义错误页面
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;

    # 16. 启用或禁用日志记录
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # 17. 设置请求速率限制（限流）
    limit_req zone=one burst=5 nodelay;

    # 18. 设置连接速率限制（限流）
    limit_conn addr 10;

    # 19. 启用跨域资源共享（CORS）
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';

    # 20. 配置 WebSocket 支持（适用于反向代理）
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";

    # 传递 Range 和 If-Range 请求头 如果你需要支持大文件的分块下载或流媒体播放（如视频），`Range` 和 `If-Range` 头的传递是必要的。
    proxy_set_header Range $http_range;
    proxy_set_header If-Range $http_if_range;

    # 禁用重定向修改
    proxy_redirect off;
}
```

# Docker 下的配置文件

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

	# 负载均衡
    upstream server {

        ip_hash;

        server 127.0.0.1:8080;

        server 127.0.0.1:8081;

    }

    upstream monitor-admin {

        server 127.0.0.1:9090;

    }

    upstream xxljob-admin {

        server 127.0.0.1:9100;

    }

    server {

        listen       80;

        server_name  localhost;

        # https配置参考 start

        #listen       443 ssl;

        # 证书直接存放 /docker/nginx/cert/ 目录下即可 更改证书名称即可 无需更改证书路径

        #ssl on;

        #ssl_certificate      /etc/nginx/cert/xxx.local.crt; # /etc/nginx/cert/ 为docker映射路径 不允许更改

        #ssl_certificate_key  /etc/nginx/cert/xxx.local.key; # /etc/nginx/cert/ 为docker映射路径 不允许更改

        #ssl_session_timeout 5m;

        #ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;

        #ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

        #ssl_prefer_server_ciphers on;

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

        location ~ ^(/[^/]*)?/actuator(/.*)?$ {

            return 403;

        }

        location / {

            root   /usr/share/nginx/html;

            try_files $uri $uri/ /index.html;

            index  index.html index.htm;

        }
        # 有其他路径
        location /web {
			#使用root会默认把location匹配的路径加到后面
            root   /usr/share/nginx/html;
            # 使用alias就不会把location匹配的路径加到后面
			# 或者使用 alias /usr/share/nginx/html/web
            try_files $uri $uri/ /web/index.html;
            index  index.html index.htm;
        }

        location /prod-api/ {

            proxy_set_header Host $http_host;

            proxy_set_header X-Real-IP $remote_addr;

            proxy_set_header REMOTE-HOST $remote_addr;

            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # sse 与 websocket参数 如果需要
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_buffering off;
            proxy_cache off;
            proxy_pass http://server/;

			# 使用负载均衡配置 upstream server,如果最后面加了/ 那么不会把匹配到的路径拼接到后面 访问 /prod-api/abc 加了/就会直接 -》http://server/abc 没有加的话http://server/prod-api/abc，相当于要不要加上location匹配的路径
            proxy_pass http://server/;

        }

        # https 会拦截内链所有的 http 请求 造成功能无法使用

        # 解决方案1 将 admin 服务 也配置成 https

        # 解决方案2 将菜单配置为外链访问 走独立页面 http 访问

        location /admin/ {

            proxy_set_header Host $http_host;

            proxy_set_header X-Real-IP $remote_addr;

            proxy_set_header REMOTE-HOST $remote_addr;

            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_pass http://monitor-admin/admin/;

        }

        # https 会拦截内链所有的 http 请求 造成功能无法使用

        # 解决方案1 将 xxljob 服务 也配置成 https

        # 解决方案2 将菜单配置为外链访问 走独立页面 http 访问

        location /xxl-job-admin/ {

            proxy_set_header Host $http_host;

            proxy_set_header X-Real-IP $remote_addr;

            proxy_set_header REMOTE-HOST $remote_addr;

            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_pass http://xxljob-admin/xxl-job-admin/;

        }

        error_page   500 502 503 504  /50x.html;

        location = /50x.html {

            root   html;

        }

    }

}
```

```
// alias 和 root 都是告诉nginx 去哪里找文件
// 如果是 root的话，location配置的是 docs ,root配置的路径是/usr/share/nginx/html. // 假如访问路径是 http://106.55.247.63/docs/abc.txt
// 就会去/usr/share/nginx/html/docs目录下找abc.txt。会把匹配到的docs也加到路径下
// 假如alias配置也是/usr/share/nginx/html
// 就会去/usr/share/nginx/html目录下找abc.txt，不会把docs放入到路径中

// try_files 查找文件 try_files $uri   $uri/  /docs/index.html;,root配置按照上面的来
比如 请求 127.0.0.1/docs/test.gif 会依次查找
1.文件/usr/share/nginx/html/docs/test.gif
2.文件夹 /usr/share/nginx/html/docs/test.gif/下的index文件
3.重定向到127.0.0.1/docs/index.html
```

```
localhost /api/和/api的区别

/api/是只会匹配/api/开头的，必须包含末尾的斜杠
/api是只会匹配/api开头的，不需要包含末尾的斜杠

/apidev 会匹配到 /api 因为他是已/api开头，不会匹配到/api/

```

# window 下配置文件

```conf
#user nobody;

worker_processes  1;
error_log  logs/error.log  warn;
#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;
    sendfile        on;

    keepalive_timeout  65;
	#允许客户端请求的最大请求体大小
    client_max_body_size 10M;
    #请求体缓存区大小
    #client_body_buffer_size 128k;

    server {
        listen       8080;
        server_name  localhost;
        charset utf-8;

        location / {
            #使用root会默认把location匹配的路径加到后面，这里就会去访问/html/web
            #使用alias就不会把location匹配的路径加到后面
            root   html/xylg;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        location /web {
            #使用root会默认把location匹配的路径加到后面，这里就会去访问/html/web
            #使用alias就不会把location匹配的路径加到后面
            root   html;
            index  index.html index.htm;
            #添加这个可以防止刷新页面导致404 /web/index.html /web为你匹配路径，如果是根路径可以不用写/web
            try_files $uri $uri/ /web/index.html;
        }

        location /app {
            #使用root会默认把location匹配的路径加到后面，这里就会去访问/html/web
            #使用alias就不会把location匹配的路径加到后面
            root   html;
            index  index.html index.htm;
            try_files $uri $uri/ /app/index.html;
        }

        location /docs {
            #使用root会默认把location匹配的路径加到后面，这里就会去访问/html/web
            #使用alias就不会把location匹配的路径加到后面
            root   html;
            index  index.html index.htm;
            try_files $uri $uri/ /docs/index.html;
        }


        location /prod-api/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:9090/;
        }

        location /nyyh/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:9090/;
        }



        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

    # 开启gzip压缩
    gzip on;
    # 不压缩临界值，大于1K的才压缩，一般不用改
    gzip_min_length 1k;
    # 压缩缓冲区
    gzip_buffers 16 64K;
    # 压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
    gzip_http_version 1.1;
    # 压缩级别，1-10，数字越大压缩的越好，时间也越长
    gzip_comp_level 5;
    # 进行压缩的文件类型
    gzip_types text/plain application/x-javascript text/css application/xml application/javascript;
    # 跟Squid等缓存服务有关，on的话会在Header里增加"Vary: Accept-Encoding"
    gzip_vary on;
    # IE6对Gzip不怎么友好，不给它Gzip了
    gzip_disable "MSIE [1-6]\.";


}

```

# VPN

```conf
server
    {
        listen 2083 ssl http2;
        server_name oyyp.sunonz.top;
        index index.html index.htm index.php;
        #root  /www/server/phpmyadmin;
        ssl_certificate /www/server/nginx/conf/cert/8767108_oyyp.sunonz.top.pem;
        ssl_certificate_key /www/server/nginx/conf/cert/8767108_oyyp.sunonz.top.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1.2;
        ssl_prefer_server_ciphers on;
        #error_page   404   /404.html;
        include enable-php.conf;

		root /usr/share/nginx/oyyp/moban6930/moban6930;
		location / {
			index  index.html;
		}

        location /user/oyyp{
			limit_rate 50k;
			proxy_redirect off;
			proxy_pass http://127.0.0.1:27991;
			proxy_http_version 1.1;
			proxy_set_header Upgrade $http_upgrade;
			proxy_set_header Connection "upgrade";
			proxy_set_header Host $host;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		}

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /\.
        {
            deny all;
        }

        access_log  /www/wwwlogs/access.log;
    }
```

# 通过 nginx 访问指定文件

```
location /MP_verify_K0qjKbVBUltwLQQi.txt {
    alias   /opt/MP_verify_K0qjKbVBUltwLQQi.txt; ## 文件所在目录
    index  index.html;
  }
```
