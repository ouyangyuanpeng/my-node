import{_ as i,c as a,a as e,o as n}from"./app-YoRv6a6D.js";const l={};function t(d,s){return n(),a("div",null,s[0]||(s[0]=[e(`<h2 id="java-启动参数说明" tabindex="-1"><a class="header-anchor" href="#java-启动参数说明"><span>java 启动参数说明</span></a></h2><div class="language-ad-info line-numbers-mode" data-ext="ad-info" data-title="ad-info"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>以下为jdk1.8</span></span>
<span class="line"><span>~~~sh</span></span>
<span class="line"><span>java -Dname=sjy-cabinet-admin -Duser.timezone=Asia/Shanghai -Xms1024m -Xmx2048m -XX:MetaspaceSize=512m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:NewRatio=1 -XX:SurvivorRatio=30 -XX:+UseParallelGC -XX:+UseParallelOldGC -jar sjy-cabinet-admin.jar</span></span>
<span class="line"><span>~~~</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>参数说明</strong></p><ul><li><code>-Dname=sjy-cabinet-admin</code>: 设置系统属性 <code>name</code> 的值为 <code>sjy-cabinet-admin</code>。</li><li><code>-Duser.timezone=Asia/Shanghai</code>: 设置系统的时区为亚洲/上海时区。</li><li><code>-Dfile.encoding=UTF-8</code> 指定编码为 UTF-8</li><li><code>-XX:MaxGCPauseMillis=50</code> 目标最大 STW（Stop-the-world） 时间，这个越小，GC 占用 CPU 资源，占用内存资源就越多，微服务吞吐量就越小，但是延迟低。这个需要做成可配置的</li><li><code>-Xms1024m</code>: 设置初始堆大小为 1024MB。</li><li><code>-Xmx2048m</code>: 设置最大堆大小为 2048MB。</li><li><strong><code>-Xss512k</code></strong>: 设置每个线程的栈大小为 512KB。默认值通常是 1MB，但对于多数应用，512KB 可能已经足够。</li><li><code>-XX:MetaspaceSize=512m</code>: 设置元空间初始大小为 512MB。</li><li><code>-XX:MaxMetaspaceSize=1024m</code>: 设置元空间最大大小为 1024MB。</li><li><code>-XX:+HeapDumpOnOutOfMemoryError</code>: 当发生 OutOfMemoryError 时生成堆转储文件。</li><li><code>-XX:+PrintGCDateStamps</code>: 打印垃圾回收的日期时间戳。</li><li><code>-XX:+PrintGCDetails</code>: 打印详细的垃圾回收信息。</li><li><code>-XX:NewRatio=1</code>: 配置新生代（Young Generation）与老年代（Old Generation）的大小比例为 1:1。</li><li><code>-XX:SurvivorRatio=30</code>: 配置 Eden 区与 Survivor 区的大小比例为 30:1。</li><li><code>-XX:+UseParallelGC</code>: 启用并行垃圾回收器（Parallel Garbage Collector）。</li><li><code>-XX:+UseParallelOldGC</code>: 启用并行老年代垃圾回收器。</li><li><strong><code>-XX:+UseContainerSupport</code></strong>: 启用容器支持，让 JVM 更好地适应容器环境下的资源限制。</li><li><strong><code>-XX:+UseStringDeduplication</code></strong>: 启用字符串去重，这对大量相同字符串的应用可以减少内存占用。</li><li><strong><code>-XX:MetaspaceSize=128m</code></strong>: 设置初始元空间大小为 128MB。</li><li><strong><code>-XX:MaxMetaspaceSize=256m</code></strong>: 设置最大元空间大小为 256MB。</li><li><strong><code>-XX:MaxGCPauseMillis=200</code></strong>: 目标 GC 暂停时间设置为 200 毫秒。这可以帮助 G1 优化暂停时间，使应用在处理垃圾回收时更具响应性。</li></ul><p>jdk17 中引入了新的垃圾回收器</p><p>目前正常微服务综合内存占用+延迟+吞吐量，还是 G1 更优秀。但是如果你的微服务本身压力没到机器极限，要求延迟低，那么 ZGC 最好。如果你是实现数据库那样的需求（大量缓存对象，即长时间生存对象，老年代很大，并且还会可能分配大于区域的对象），那么必须使用 ZGC。</p><p>在一个只有 2GB 内存和 2 核 CPU 的服务器上，G1GC 是更好的选择，因为它更适合这种资源受限的环境。如果将来你的应用需要迁移到更大的服务器，并且对延迟有更高的要求，那么你可以考虑使用 ZGC。如果你有更高的内存和 CPU 资源，并且应用对延迟特别敏感，那么 ZGC 是一个很好的选择。在更大的服务器上，例如 8GB 内存、4 核或以上的环境，ZGC 的低延迟特性将会非常有用。</p><p><code>-XX:+UseG1GC</code> 或者 <code>-XX:+UseZGC</code> 在 JDK 17 中，<code>-XX:+UseParallelOldGC</code> 是用于启用并行老年代垃圾回收的选项。然而，ZGC 是一种全新的垃圾回收器，不再依赖于并行垃圾回收器或并行老年代垃圾回收器。 因此，如果你决定使用 ZGC，不再需要 <code>-XX:+UseParallelOldGC</code> 这个选项。ZGC 会自动处理老年代的垃圾回收，并且它的设计目标之一就是降低垃圾收集的停顿时间。</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h2><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>rpm -ivh jdk-8u361-linux-x64.rpm</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>vim /etc/profile</p><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>export JAVA_HOME=/usr/java/jdk1.8.0_361-amd64</span></span>
<span class="line"><span>export PATH=$PATH:$JAVA_HOME/bin</span></span>
<span class="line"><span>export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>source /etc/profile</p><h3 id="非-root-用户安装" tabindex="-1"><a class="header-anchor" href="#非-root-用户安装"><span>非 root 用户安装</span></a></h3><p>如果无法使用 root 用户，但是服务器已经配置了 jdk1.8 的环境变量，我们不使用全局配置的 jdk 但是需要使用 jdk17，无法编辑 vim /etc/profile 可以使用当前用户自己的环境变量 vim /home/用户目录/.bashrc <code>export PATH=$PATH:$JAVA_HOME/bin</code> 替换为<code>export PATH=$JAVA_HOME/bin:$PATH</code></p><div class="language- line-numbers-mode" data-ext="" data-title=""><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>export JAVA_HOME=/usr/java/jdk1.8.0_361-amd64</span></span>
<span class="line"><span>export PATH=$JAVA_HOME/bin:$PATH</span></span>
<span class="line"><span>export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>source /home/用户目录/.bashrc</p><h2 id="开机自启动-java-应用" tabindex="-1"><a class="header-anchor" href="#开机自启动-java-应用"><span>开机自启动 java 应用</span></a></h2><p>创建文件</p><p>sudo vim /etc/systemd/system/cabinet.service</p><p>输入以下内容</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">[</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">Unit</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">]</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">Description</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">My</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> Java</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> Application</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">After</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">network.target</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">[</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">Service</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">]</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">Type</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">simple</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">User</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">你要启动这个应用的用户</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">WorkingDirectory</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">jar包所在目录</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">ExecStart</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">jdk目录/bin/java</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> -XX:+HeapDumpOnOutOfMemoryError</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -XX:+UseG1GC</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -jar</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> jar包目录</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">Restart</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">always</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">SuccessExitStatus</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">143</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">[</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">Install</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">]</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">WantedBy</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">multi-user.target</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 加载。每次修改*.service都需要重新加载</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> daemon-reload</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 启动</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> start</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> cabinet.service</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 开机自启动</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> enable</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> cabinet.service</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>停止和重启服务</p><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> stop</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> cabinet.service</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> restart</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> cabinet.service</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 查看服务状态</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> status</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> cabinet.service</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25)]))}const r=i(l,[["render",t],["__file","index.html.vue"]]),h=JSON.parse('{"path":"/%E6%8A%80%E6%9C%AF%E6%A0%88/p3ojeuke/","title":"Java安装部署","lang":"zh-CN","frontmatter":{"title":"Java安装部署","createTime":"2024/11/14 10:21:26","permalink":"/技术栈/p3ojeuke/"},"headers":[],"readingTime":{"minutes":3.82,"words":1146},"git":{"updatedTime":1731552696000,"contributors":[{"name":"oyyp","email":"513150165@qq.com","commits":1,"avatar":"https://avatars.githubusercontent.com/oyyp?v=4","url":"https://github.com/oyyp"}]},"filePathRelative":"notes/技术栈/Java/Java安装部署.md","categoryList":[{"id":"4358b5","sort":10000,"name":"notes"},{"id":"659f61","sort":10001,"name":"技术栈"},{"id":"8755b1","sort":10002,"name":"Java"}],"bulletin":false}');export{r as comp,h as data};