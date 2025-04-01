参考网上安装

安装成功后

### 打开 Anaconda Prompt，执行以下命令，将清华镜像配置添加到 Anaconda 中：

`conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/`  
`conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/`  
`conda config --set show_channel_urls yes`

```
#恢复原始镜像
conda config --remove-key channels
```

anaconda-navigator打不开问题：
Anaconda Promp启动anaconda-navigator检查问题
[Anaconda闪退的问题AttributeError: 'str' object has no attribute 'get'-CSDN博客](https://blog.csdn.net/tanmx219/article/details/88069375)

使用conda安装一些库时出现以下报错：

```python
 CondaValueError: Malformed version string '~': invalid character(s)
```


设置Anaconda安装目录权限，右键整个文件夹，选择安全 选择User ,选择编辑，勾选完全控制



查看 Anaconda 中当前存在的环境

```
conda info -e 或者 conda-env list
```

1. 创建环境

```bash
conda create -n ENV_NAME python=3.9
```

2. 激活环境

```bash
conda activate ENV_NAME
```

3. 退出环境

```bash
conda deactivate
```

4. 删除环境

```bash
conda env remove -n ENV_NAME
```

### 包管理

```
 查询看当前环境中安装了哪些包
conda list

用conda list后跟package名来查找某个指定的包是否已安装，而且支持*通配模糊查找。
conda list pkgname        
conda list pkgname*

安装
conda install package_name
conda install numpy=0.20.3

更新
conda update numpy

 这样会将依赖于这个包的所有其它包也同时卸载。
conda uninstall package_name

 如果不想删除依赖其当前要删除的包的其他包：
conda uninstall package_name --force

conda clean -p # 删除没有用的包 --packages 
conda clean -t # 删除tar打包 --tarballs 
conda clean -y -all # 删除所有的安装包及cache(索引缓存、锁定文件、未使用过的包和tar包)
```