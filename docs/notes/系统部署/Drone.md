---
title: Drone
createTime: 2024/11/14 10:21:26
permalink: /系统部署/9153cqoi/
---
[官网地址](https://www.drone.io/)
轻量级自动化部署工具

# docker 安装

使用 docker-compose 尝试没有安装成功，所以使用以下命令，测试成功

## 使用 Drone+gitea 部署

主机 ip:106.55.247.63
gitea:部署在 106.55.247.63:5000,通过 nginx 做了反向代理，路径为 106.55.247.63:80/git

```bash
docker run \
  -v /data/drone/data:/data \
  -e DRONE_AGENTS_ENABLED=true \
  -e DRONE_GITEA_SERVER=http://106.55.247.63/git \
  -e DRONE_GITEA_CLIENT_ID=8d7a4e42-abdf-46de-94c5-479d91957fc7 \
  -e DRONE_GITEA_CLIENT_SECRET=gto_bkacb7w2iscllvslwdqyslaz4pigdzz2iuyoosdj6kyen4feidaa \
  -e DRONE_RPC_SECRET=507ebb470e3423352086bb54263c7a5e \
  -e DRONE_SERVER_HOST=106.55.247.63:3080 \
  -e DRONE_SERVER_PROTO=http \
  -e DRONE_USER_CREATE=username:oyyp,admin:true \
  -e TZ="Asia/Shanghai" \
  -p 3080:80 \
  --restart=always \
  --detach=true \
  --name=drone \
  drone/drone:2
```

参数说明

```yml
# DRONE_GOGS_SERVER：用于配置Gogs服务地址，可以直接是IP http://192.168.31.114:10080
# DRONE_RPC_SECRET：Drone的共享秘钥，用于验证连接到server的rpc连接，server和runner需要提供同样的秘钥。
# DRONE_SERVER_HOST：用于配置Drone server外部可访问的地址。
# DRONE_SERVER_PROTO：用于配置Drone server外部可访问的协议，必须是http或https。
# DRONE_USER_CREATE：创建一个管理员账号，这个账号要是git仓库的管理员
```

## 安装 drone-runner

- 当有需要执行的任务时，会启动临时的容器来执行流水线任务,通过这个执行对应部署脚本任务

```bash
docker run --detach \
  --volume=/var/run/docker.sock:/var/run/docker.sock \
  --env=DRONE_RPC_PROTO=http \
  --env=DRONE_RPC_HOST=106.55.247.63:3080 \
  --env=DRONE_RPC_SECRET=507ebb470e3423352086bb54263c7a5e \
  --env=DRONE_RUNNER_CAPACITY=2 \
  --env=DRONE_RUNNER_NAME=docker-drone-runner \
  --env=TZ="Asia/Shanghai" \
  --publish=3000:3000 \
  --restart=always \
  --name=docker-drone-runner \
  drone/drone-runner-docker:1
```

参数说明

```yml
# DRONE_RPC_PROTO：用于配置连接到Drone server的协议，必须是http或https。
# DRONE_RPC_HOST：用于配置Drone server的访问地址，runner会连接到server获取流水线任务并执行。
# DRONE_RPC_SECRET：用于配置连接到Drone server的共享秘钥。
# DRONE_RUNNER_CAPACITY：限制runner并发执行的流水线任务数量。
# DRONE_RUNNER_NAME：自定义runner的名称。

```

# 部署一个 node 项目

.drone.yml 文件

```yml
kind: pipeline
type: docker
name: sjy-docs

steps:
	# 一个name代表一个流水线步骤
  - name: install & build
    # 编译环境
    image: node:14.15.0
    # 执行脚本
    commands:
      - pwd
      - npm config set registry https://registry.npm.taobao.org
      - npm install
      - npm run build
      - ls -l
      - cd /drone/src/docs/.vuepress/dist
      - ls -l
      - cp -r /drone/src/docs/.vuepress/dist  /drone/src/dist

	# 文件推送远程服务器插件
  - name: upload
    image: appleboy/drone-scp
    settings:
      host:
	    # ssh_host为环境变量，在drone管理页面设置
        from_secret: ssh_host
      username:
        from_secret: ssh_username
      password:
        from_secret: ssh_password
      port: 22
      command_timeout: 2m
      create_path: false
      # 会在这个目录下创建source下的目录，需要注意
      # 隐藏目录不会推送
      target: /data/nginx/html
      source:
        - ./dist
    # 执行远程服务器指令
  - name: deploy
    image: appleboy/drone-ssh
    settings:
      host:
        from_secret: ssh_host
      username:
        from_secret: ssh_username
      password:
        from_secret: ssh_password
      port: 22
      command_timeout: 2m
      script:
        - rm -rf /data/nginx/html/docs
        - cp -r /data/nginx/html/dist/  /data/nginx/html/docs
        - rm -rf /data/nginx/html/dist

# 触发器，可限制哪些分支可以推送自动CICD
trigger:
  branch:
    - main
  temp: {}
```

一个正常部署的 node 项目文件

```yaml
kind: pipeline
type: docker
name: sjy-docs

steps:
  # 一个name代表一个流水线步骤
  - name: install & build
    image: node:14.15.0
    commands:
      - pwd
      - npm config set registry https://registry.npm.taobao.org
      - npm install
      - npm run build
      - ls -l
      - cd /drone/src/docs/.vuepress/dist
      - ls -l
      - cp -r /drone/src/docs/.vuepress/dist  /drone/src/dist

  - name: upload
    image: appleboy/drone-scp
    settings:
      host:
        from_secret: ssh_host
      username:
        from_secret: ssh_username
      password:
        from_secret: ssh_password
      port: 22
      command_timeout: 2m
      create_path: false
      target: /data/nginx/html
      source:
        - ./dist
  - name: deploy
    image: appleboy/drone-ssh
    settings:
      host:
        from_secret: ssh_host
      username:
        from_secret: ssh_username
      password:
        from_secret: ssh_password
      port: 22
      command_timeout: 2m
      script:
        - rm -rf /data/nginx/html/docs
        - cp -r /data/nginx/html/dist/  /data/nginx/html/docs
        - rm -rf /data/nginx/html/dist

# 可限制哪些分支可以推送自动CICD
trigger:
  branch:
    - main
  temp: {}
```
