---
title: Android Studio
createTime: 2024/11/14 10:21:26
permalink: /技术栈/kfn5bi0s/
---

## 远程调试

### 通过 Wi-Fi 连接到设备

1. 在设备上[启用开发人员选项](https://developer.android.com/studio/debug/dev-options#enable)。
2. 打开 Android Studio，然后从运行中选择**使用 Wi-Fi 配对设备**  配置菜单。

![image.png](https://image.oyyp.top/img/202406041007856.png)

![image.png](https://image.oyyp.top/img/202406041009547.png)

3. 在您的设备上，在开发者选项菜单中开启**无线调试**并配对您的设备

   1. 要将您的设备与二维码配对，请选择**将设备与二维码配对**并扫描 从图 2 **所示的通过 Wi-Fi 配对设备**弹出窗口获取的 QR 码。

   1. 若要将设备与配对代码配对，请选择“**将设备与配对代码**”从  **通过 Wi-Fi 配对设备**弹出窗口。在设备上，选择**配对方式 配对代码**并记下提供的六位数代码。一旦您的设备出现在**“通过 Wi-Fi 配对设备**”窗口中，您可以选择**“配对**”并输入六位数字 设备上显示的代码。

      ![image.png](https://image.oyyp.top/img/202406041011862.png)

4. 设备配对后，您可以尝试将应用部署到设备。

#### 使用命令行进行 Wi-Fi 连接

要在没有 Android Studio 的情况下使用命令行连接到您的设备，请按照以下操作 这些步骤：

1. 如前所述，在设备上启用开发人员选项。
2. 如前所述，在设备上启用**无线调试**。
3. 在工作站上，打开终端窗口并导航到 。`android_sdk/platform-tools`
4. 通过选择**“将设备与设备配对”来查找您的 IP 地址、端口号和配对代码 配对代码**。记下 IP 地址、端口号和配对代码 设备。
5. 在工作站的终端上，运行 。使用 IP 地址 和上面的端口号。`adb pair ipaddr:port`
6. 出现提示时，输入配对代码
7. 使用 adb connect ip:port 连接

   删除所有设备 `adb kill-server`

## adb 命令

```sh

//启动编译器安装的模拟器
// 查看安装的模拟器
emulator -list-avds
emulator -avd 模拟器名称
// 模拟器访问电脑服务
// ip不能是127.0.0.1和localhsot 需要是10.0.2.2

启动服务
adb start-server
关闭服务
adb kill-server
列出设备
adb devices -l

您可以使用在模拟器或连接的设备上安装 APK 使用命令
adb install path_to_apk

设置端口转发
使用命令设置任意端口转发，这将 将特定主机端口上的请求转发到设备上的其他端口。 以下示例设置将主机端口 6100 转发到设备端口 7100：`forward`
adb forward tcp:6100 tcp:7100

以下示例设置将主机端口 6100 转发到 local：logd：
adb forward tcp:6100 local:logd
```

### 将文件复制到设备或从设备复制文件

使用 and 命令将文件复制到 和来自设备。与命令不同， 它仅将 APK 文件复制到特定位置，而 and 命令允许您将任意目录和文件复制到设备中的任何位置。` pull``push``install``pull``push `

要*从*设备复制文件或目录及其子目录， 执行以下操作：

adb pull remote local

要将文件或目录及其子目录复制*到*设备， 执行以下操作：

adb push local remote

将 和 替换为 开发计算机（本地）和 设备（远程）。例如：` local``remote `

adb push myfile.txt /sdcard/myfile.txt


adb install -r apk目录