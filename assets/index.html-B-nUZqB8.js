import{_ as n,c as a,a as i,o as e}from"./app-DVUdVNdS.js";const l={};function p(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<h2 id="linux-安装" tabindex="-1"><a class="header-anchor" href="#linux-安装"><span>Linux 安装</span></a></h2><p>下载地址：<a href="https://downloads.mysql.com/archives/community/" target="_blank" rel="noopener noreferrer">MySQL ：： 下载 MySQL 社区服务器（存档版本）</a></p><h3 id="创建-mysql-用户组和用户并修改权限" tabindex="-1"><a class="header-anchor" href="#创建-mysql-用户组和用户并修改权限"><span>创建 mysql 用户组和用户并修改权限</span></a></h3><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">groupadd</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">useradd</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -r</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -g</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>上传服务器，cd 到对应目录</p><p>解压缩</p><div class="language-sh line-numbers-mode" data-ext="sh" data-title="sh"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">tar</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -xvf</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql-8.0.37-linux-glibc2.28-x86_64.tar.xz</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>修改压缩出来的文件夹名称(非必须)，只是为了方便后续操作</p><div class="language-sh line-numbers-mode" data-ext="sh" data-title="sh"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">mv</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql-8.0.37-linux-glibc2.28-x86_64</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>创建数据目录和配置文件</p><div class="language-sh line-numbers-mode" data-ext="sh" data-title="sh"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">cd</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">#在mysql安装目录下</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">mkdir</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> data</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">vim</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> my.cnf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输入以下配置，可自行调整</p><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span># 数据库服务器设置</span></span>
<span class="line"><span>[mysqld]</span></span>
<span class="line"><span># MySQL 服务监听的端口，默认是 3306</span></span>
<span class="line"><span>port=3306</span></span>
<span class="line"><span></span></span>
<span class="line"><span># MySQL 运行的用户</span></span>
<span class="line"><span>user=mysql</span></span>
<span class="line"><span></span></span>
<span class="line"><span># MySQL 的安装目录，即 \`basedir\`，指定 MySQL 二进制文件的位置</span></span>
<span class="line"><span>basedir=/usr/local/mysql</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 数据存放目录，指定数据库文件存储的路径</span></span>
<span class="line"><span>datadir=/usr/local/mysql/data</span></span>
<span class="line"><span></span></span>
<span class="line"><span># MySQL 错误日志文件的位置，记录错误、警告和其他信息</span></span>
<span class="line"><span>log-error=/usr/local/mysql/logs/mysql.err</span></span>
<span class="line"><span></span></span>
<span class="line"><span># MySQL 进程 ID 文件，保存当前 MySQL 服务的进程号</span></span>
<span class="line"><span>pid-file=/usr/local/mysql/logs/mysql.pid</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Unix socket 文件的路径，客户端可以通过此文件与 MySQL 服务进行本地连接</span></span>
<span class="line"><span>socket=/tmp/mysql.sock</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 最大允许的客户端连接数，超过此数目后新的连接会被拒绝</span></span>
<span class="line"><span>max_connections=200</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 客户端允许的最大连接错误次数，超过此数目后，客户端 IP 会被阻止连接</span></span>
<span class="line"><span>#max_connect_errors=1000</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 服务器等待一个连接的超时时间（秒），如果超过该时间没有活动，则关闭连接</span></span>
<span class="line"><span>#wait_timeout=600</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 交互式会话的超时时间（秒），与 \`wait_timeout\` 类似，专门针对交互式会话</span></span>
<span class="line"><span>#interactive_timeout=600</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 服务器默认使用的字符集，utf8mb4 支持完整的 Unicode，包括 emoji 字符</span></span>
<span class="line"><span>character-set-server=utf8mb4</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 服务器默认使用的字符排序规则，\`utf8mb4_general_ci\` 不区分大小写</span></span>
<span class="line"><span>collation-server=utf8mb4_general_ci</span></span>
<span class="line"><span></span></span>
<span class="line"><span># MySQL 创建新表时默认使用的存储引擎，InnoDB 是现代数据库中常用的事务存储引擎</span></span>
<span class="line"><span>default-storage-engine=INNODB</span></span>
<span class="line"><span></span></span>
<span class="line"><span># InnoDB 存储引擎的缓冲池大小，建议设置为服务器内存的 50% 左右（此处为 1GB）</span></span>
<span class="line"><span>innodb_buffer_pool_size=1G</span></span>
<span class="line"><span></span></span>
<span class="line"><span># InnoDB 日志文件的大小，适当增大以减少日志切换次数（此处为 256MB）</span></span>
<span class="line"><span>innodb_log_file_size=256M</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 事务提交的日志刷新策略，设置为 2 提高性能，但可能在崩溃时丢失少量数据</span></span>
<span class="line"><span>innodb_flush_log_at_trx_commit=2</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 每个 InnoDB 表独立存储为一个表空间文件，便于管理和备份</span></span>
<span class="line"><span>innodb_file_per_table=1</span></span>
<span class="line"><span></span></span>
<span class="line"><span># InnoDB 的刷新方法，O_DIRECT 避免双重缓存，提高 SSD 硬盘上的性能</span></span>
<span class="line"><span>innodb_flush_method=O_DIRECT</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 默认认证插件，\`caching_sha2_password\` 是 MySQL 8.0 之后推荐的更安全的认证方式</span></span>
<span class="line"><span>default_authentication_plugin=caching_sha2_password</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将表名设为不区分大小写，适合跨平台应用（如 Windows 系统和 Linux 系统）</span></span>
<span class="line"><span>lower_case_table_names=1</span></span>
<span class="line"><span></span></span>
<span class="line"><span># mysql命令设置 使用client可以不用单独设置除非特殊需求</span></span>
<span class="line"><span>[mysql]</span></span>
<span class="line"><span># 设置 MySQL 客户端的默认字符集为 utf8mb4</span></span>
<span class="line"><span>default-character-set=utf8mb4</span></span>
<span class="line"><span></span></span>
<span class="line"><span># mysql客户端设置包含mysql mysqladmin</span></span>
<span class="line"><span>[client]</span></span>
<span class="line"><span># 客户端连接 MySQL 时默认使用的端口</span></span>
<span class="line"><span>port=3306</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 客户端连接时使用的默认字符集</span></span>
<span class="line"><span>default-character-set=utf8mb4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>文件授权</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">chown</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql:mysql</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -R</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> /usr/local/mysql</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">chmod</span><span style="--shiki-light:#2F798A;--shiki-dark:#4C9A91;"> 750</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> /usr/local/mysql</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置环境变量" tabindex="-1"><a class="header-anchor" href="#设置环境变量"><span>设置环境变量</span></a></h3><p>添加到对应环境变量文件中<br> ​export PATH=$PATH:/usr/local/mysql/bin​<br> 加载环境变量<br> 如：source /home/用户目录/.bashrc​</p><h3 id="初始化-mysql" tabindex="-1"><a class="header-anchor" href="#初始化-mysql"><span>初始化 mysql</span></a></h3><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">mysqld</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --defaults-file=/opt/mysql/mysql/etc/my.cnf</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --user=mysql</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --initialize</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>参数说明：<br> ​--defaults-file​ 指向配置文件<br> ​--user​ 启动 mysql 的用户</p><p>执行后会在控制台中生成 root 密码</p><p>​<img src="https://image.oyyp.top/img/202408211750848.png" alt="image.png">​</p><p>查看密码</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">cat</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> /usr/local/mysql/data/mysql.err</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="启动-mysql" tabindex="-1"><a class="header-anchor" href="#启动-mysql"><span>启动 mysql</span></a></h3><div class="language-mysql line-numbers-mode" data-ext="mysql" data-title="mysql"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># 官方推荐使用mysqld_safe，使用mysqld_safe会出现一个守护进程，mysql服务停止后会自行恢复</span></span>
<span class="line"><span>mysqld_safe --user=mysql &amp;</span></span>
<span class="line"><span>#指定配置文件启动</span></span>
<span class="line"><span>#  mysqld_safe  --defaults-file=/mnt/mysql8/my.cnf --user=mysql &amp;</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># 也可使用</span></span>
<span class="line"><span>mysql.server start</span></span>
<span class="line"><span># 停止</span></span>
<span class="line"><span>mysql.server stop</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">cp</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> /usr/local/mysql/support-files/mysql.server</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> /etc/init.d/mysql</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">service</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> start</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>参数说明：<br> ​--user​ 启动 mysql 的用户</p><p>使用 mysql -uroot -p 连接 mysql 然后修改 root 密码</p><div class="language-mysql line-numbers-mode" data-ext="mysql" data-title="mysql"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>ALTER USER &#39;root&#39;@&#39;localhost&#39; IDENTIFIED BY &#39;root&#39;;</span></span>
<span class="line"><span># 刷新权限</span></span>
<span class="line"><span>FLUSH PRIVILEGES;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="允许远程访问" tabindex="-1"><a class="header-anchor" href="#允许远程访问"><span>允许远程访问</span></a></h3><p>使用 root 账号登录后创建一个可以远程访问的用户</p><div class="language-mysql line-numbers-mode" data-ext="mysql" data-title="mysql"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>CREATE USER &#39;ycroot&#39;@&#39;%&#39; IDENTIFIED BY &#39;YourNewPassword&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GRANT ALL PRIVILEGES ON *.* TO &#39;ycroot&#39;@&#39;%&#39; WITH GRANT OPTION;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FLUSH PRIVILEGES;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="停止-mysql" tabindex="-1"><a class="header-anchor" href="#停止-mysql"><span>停止 mysql</span></a></h3><p>如果使用 mysqld_safe</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">mysqladmin</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -u</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> root</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -p</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> shutdown</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="如果非-root-用户" tabindex="-1"><a class="header-anchor" href="#如果非-root-用户"><span>如果非 root 用户</span></a></h3><p>如果是使用非 root 用户，需要调用 mysql 的指令需要放入 bash -c 中或者直接 su 到 mysql 用户下执行<br> 建议直接通过 mysql 用户执行，以免出现问题</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -u</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> bash</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -c</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">/home/oyyp/db/mysql/bin/mysqld --defaults-file=/home/oyyp/db/mysql/my.cnf --user=mysql --initialize</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li>​sudo -u mysql​: 以 mysql​ 用户的身份执行后续命令。</li><li>​bash -c​: 启动一个新的 bash​ 子 Shell，以确保整个命令在同一环境下执行。</li><li>​&#39;/home/oyyp/db/mysql/bin/mysqld --defaults-file=/home/oyyp/db/mysql/my.cnf --user=mysql --initialize&#39;​: 这是你实际要执行的命令，它指定了 mysqld​ 的配置文件路径，并使用 mysql​ 用户来初始化数据库。</li></ul><h3 id="开机自启动" tabindex="-1"><a class="header-anchor" href="#开机自启动"><span>开机自启动</span></a></h3><p>参考：<a href="https://dev.mysql.com/doc/mysql-secure-deployment-guide/8.0/en/secure-deployment-post-install.html#secure-deployment-systemd-startup" target="_blank" rel="noopener noreferrer">MySQL ：： MySQL 安全部署指南 ：： 5 安装后设置</a></p><p>创建：mysqld.service，文件内容如下：</p><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>[Unit]</span></span>
<span class="line"><span>Description=MySQL Community Server</span></span>
<span class="line"><span>After=network.target</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Service]</span></span>
<span class="line"><span>Type=forking</span></span>
<span class="line"><span>User=mysql</span></span>
<span class="line"><span>Group=mysql</span></span>
<span class="line"><span>ExecStart=/home/oyyp/db/mysql/bin/mysqld_safe --user=mysql</span></span>
<span class="line"><span>ExecStop=/home/oyyp/db/mysql/bin/mysqladmin shutdown</span></span>
<span class="line"><span>Restart=on-failure</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Install]</span></span>
<span class="line"><span>WantedBy=multi-user.target</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span># [Unit] 部分定义了服务的基本信息以及它与其他单元的关系。</span></span>
<span class="line"><span>[Unit]</span></span>
<span class="line"><span>Description=MySQL Server  # 对服务的一个简短描述。</span></span>
<span class="line"><span>Documentation=man:mysqld(8)  # 指向手册页中的 mysqld 命令文档。</span></span>
<span class="line"><span>Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html  # 指向 MySQL 官方在线文档关于使用 systemd 的部分。</span></span>
<span class="line"><span>After=network.target  # 确保 MySQL 在网络服务启动之后开始。</span></span>
<span class="line"><span>After=syslog.target  # 确保 MySQL 在系统日志服务启动之后开始。</span></span>
<span class="line"><span></span></span>
<span class="line"><span># [Install] 部分定义了当该服务被启用时应该如何处理。</span></span>
<span class="line"><span>[Install]</span></span>
<span class="line"><span>WantedBy=multi-user.target  # 当系统进入多用户模式（非图形界面）时，此服务应被激活。</span></span>
<span class="line"><span></span></span>
<span class="line"><span># [Service] 部分定义了如何控制和管理服务。</span></span>
<span class="line"><span>[Service]</span></span>
<span class="line"><span>User=mysql  # 使用 &#39;mysql&#39; 用户运行 MySQL 服务，提高安全性。</span></span>
<span class="line"><span>Group=mysql  # 使用 &#39;mysql&#39; 组运行 MySQL 服务，提高安全性。</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Have mysqld write its state to the systemd notify socket</span></span>
<span class="line"><span>Type=notify  # 设置为 notify 类型，以便 mysqld 可以通过 systemd 的通知套接字告知其状态变化。</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Disable service start and stop timeout logic of systemd for mysqld service.</span></span>
<span class="line"><span>TimeoutSec=0  # 禁用启动和停止超时逻辑，不限制 MySQL 启动或停止的时间。</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Start main service</span></span>
<span class="line"><span>ExecStart=/usr/local/mysql/bin/mysqld --defaults-file=/etc/my.cnf $MYSQLD_OPTS  # 启动 MySQL 服务的命令，使用 /etc/my.cnf 作为默认配置文件，并允许传递额外选项。</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Use this to switch malloc implementation</span></span>
<span class="line"><span>EnvironmentFile=-/etc/sysconfig/mysql  # 引入环境变量文件，如果文件不存在则不报错。</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Sets open_files_limit</span></span>
<span class="line"><span>LimitNOFILE = 10000  # 设置 MySQL 进程的最大打开文件数限制。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Restart=on-failure  # 如果服务非正常退出，则自动重启服务。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RestartPreventExitStatus=1  # 如果服务退出状态码为 1，则不触发自动重启。</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Set environment variable MYSQLD_PARENT_PID. This is required for restart.</span></span>
<span class="line"><span>Environment=MYSQLD_PARENT_PID=1  # 设置环境变量 MYSQLD_PARENT_PID，可能对于正确重启服务是必要的。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PrivateTmp=false  # 不为 MySQL 创建独立的临时文件系统，使用系统的全局临时目录。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>​ExecStart​: 启动 MySQL 服务的命令。</li><li>​ExecStop​: 停止 MySQL 服务的命令。</li></ul><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 重新加载 \`systemd\` 配置</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> daemon-reload</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 启用 MySQL 服务开机自启动</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> enable</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 启动 MySQL 服务</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> start</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 检查 MySQL 服务状态</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> status</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">#禁用开机自启动</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> disable</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> mysql</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注：如果 mysql.sock 不是默认名称，那么 mysql -u 需要添加 -S /tmp/mysql8.sock 指定文件 mysqladmin 也需要添加才能正常退出</p>`,48)]))}const c=n(l,[["render",p],["__file","index.html.vue"]]),r=JSON.parse('{"path":"/%E6%95%B0%E6%8D%AE%E5%BA%93/er4d727g/","title":"Mysql安装","lang":"zh-CN","frontmatter":{"title":"Mysql安装","createTime":"2024/11/14 10:21:26","permalink":"/数据库/er4d727g/"},"headers":[],"readingTime":{"minutes":6.19,"words":1858},"git":{"updatedTime":1737621672000,"contributors":[{"name":"oyyp","email":"513150165@qq.com","commits":3,"avatar":"https://avatars.githubusercontent.com/oyyp?v=4","url":"https://github.com/oyyp"}]},"filePathRelative":"notes/数据库/Mysql/Mysql安装.md","categoryList":[{"id":"4358b5","sort":10000,"name":"notes"},{"id":"324a5c","sort":10003,"name":"数据库"},{"id":"3aab05","sort":10004,"name":"Mysql"}],"bulletin":false}');export{c as comp,r as data};
