---
title: Android语言
createTime: 2024/11/14 10:21:26
permalink: /技术栈/16ix4t4g/
---

```ad-info
title: 使用 AndroidStudio 2023.3.1开发
```

## 工程目录结构说明

```text
├─app
|  ├─src
|  |  ├─test  # 测试代码
|  |  ├─main
|  |  |  ├─java  # 存放java代码
|  |  |  ├─res  # 存放资源文件
|  |  |  |  ├─xml
|  |  |  |  ├─values-night
|  |  |  |  ├─values # 存放定义常量文件
|  |  |  |  ├─mipmap-xxxhdpi
|  |  |  |  ├─mipmap-xxhdpi
|  |  |  |  ├─mipmap-xhdpi
|  |  |  |  ├─mipmap-mdpi
|  |  |  |  ├─mipmap-hdpi
|  |  |  |  ├─mipmap-anydpi
|  |  |  |  ├─layout  # 存放app布局文件
|  |  |  |  ├─drawable  # 存放图片文件与图形描述文件
|  |  |  ├─AndroidManifest.xml  # app运行配置文件
|  |  ├─androidTest  # 测试代码
|  ├─build.gradle  # app目录下的构建脚本。app下的依赖管理 类似maven模块下的pom
|  ├─proguard-rules.pro # 项目代码混淆规则
├─gradle # 构建器
|   ├─wrapper
|   |    ├─gradle-wrapper.jar
|   |    ├─gradle-wrapper.properties
|   ├─lib.versions.toml # 项目依赖
├─build.gradle # 全局构建脚本 类似maven父工程下的pom
├─gradle.properties # 构建器版本说明，告诉我们使用什么版本的构建器，要去那里下载
├─gradlew
├─gradlew.bat
├─local.properties # 项目的本地配置文件
├─settings.gradle  # 文件配置了需要编译哪些模块。
```

- AndroidManifest.xml
- values: 录存放一些常量定义文件，例如字符串常量 strings.xml、像素常量 dimens.xml、颜色常量 colors.xml、样式风格定义 styles.xm 等。
- mipmap：存放 App 的启动图标，不同的目录存放不同屏幕适配的图标
- settings.gradle：初始内容为 include:app’，表示只编译 app 模块。可配置依赖下载仓库
- local.properties：它在工程编译时自动生成，用于描述开发者电脑的环境配置，包括 SDK 的木地路径、NDK 的本地路径

### AndroidManifest.xml 文件说明

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.BaiduFace"
        tools:targetApi="31">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

- android:allowBackup，工是否允许应用备份。允许用户备份系统应用和第三方应用的 apk 安装包和应用数据，以便在刷机或者数据丢失后恢复应用，用户即可通过 adbbackup 和 adbrestore 来进行对应用数据的备份和恢复。为 true 表示允许，为 false 则表示不允许。
- android:icon，指定 App 在手机屏幕上显示的图标。
- android:label，指定 App 在手机屏幕上显示的名称。
- android:roundlcon，指定 App 的圆角图标。
- android:supportsRtl，是否支持阿拉伯语／波斯语这种从右往左的文字排列顺序。为 true 表示支持，为 false 则表示不支持。
- android:theme，指定 App 的显示风格。

注意到 application 下面还有个 activity 节点，它是活动页面的注册声明，只有在 AndroidManifest.xml 中正确配置了 activity 节点，才能在运行时访问对应的活动页面。初始配置的 MainActivity 正是 App 的默认主页，之所以说该页面是 App 主页，是因为它的 activity 节点内部还配置了以下的过滤信息：

```xml
 <intent-filter>
    <action android:name="android.intent.action.MAIN" />

    <category android:name="android.intent.category.LAUNCHER" />
</intent-filter>
```

其中 action 节点设置的 android.intent.action.MAIN 表示该页面是 App 的入口页面，启动 App 时会最先打开该页面。而 category 节点设置的 android.intent.category.LAUNCHER 决定了是否在手机屏幕上显示 App 图标，如果同时有两个 activity 节点内部都设置了 android.intent.category.LAUNCHER，那么桌面就会显示两个 App 图标。以上的两种节点规则可能一开始不太好理解，读者只需记住默认主页必须同时配置这两种过滤规则即可。

### build.gradle 文件说明

**不同 gradle 版本配置文件不同**

```ad-warning
title: gradle版本为8
```

```gradle
// 插件
plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace 'com.example.baiduface'
    // 编译的sdk版本 使用安卓几编译
    compileSdk 34

    defaultConfig {
        // app的appid唯一标识  应用的唯一标识
        applicationId "com.example.baiduface"
        // app最小支持安卓版本 低于这个版本不一定可以运行
        minSdk 29
        // 期望目标版本
        targetSdk 34
        // 应用版本号
        versionCode 1
        // 应用版本名称
        versionName "1.0"
        // 测试单元
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    // 构建类型
    buildTypes {

        // 测试环境
        debug{

        }
        // 生产环境
        release {
            minifyEnabled false
            // 混淆文件
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }    // 编译选项
    compileOptions {
        // 源代码兼容java版本
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

// 项目依赖
dependencies {

    // implementation 强制依赖不写版本默认最新
    implementation libs.appcompat
    implementation libs.material
    implementation libs.activity
    implementation libs.constraintlayout
    // 测试依赖
    testImplementation libs.junit
    androidTestImplementation libs.ext.junit
    androidTestImplementation libs.espresso.core
}
```

```ad-warning
title: gradle版本为6
```

```gradle
// com.android.library这里为模块 主项目引入的模块
apply plugin: 'com.android.library'
// 以下是主项目
// apply plugin: 'com.android.application'


android {
    compileSdk 34
    defaultConfig {
        minSdk 29
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

}

dependencies {

    compileOnly 'androidx.localbroadcastmanager:localbroadcastmanager:1.0.0'
    compileOnly 'androidx.core:core:1.1.0'
    compileOnly 'androidx.fragment:fragment:1.1.0'
    compileOnly 'androidx.appcompat:appcompat:1.1.0'
    compileOnly 'androidx.recyclerview:recyclerview:1.1.0'
    compileOnly 'com.alibaba:fastjson:1.2.83'

    compileOnly fileTree(include: ['uniapp-v8-release.aar'], dir: '../app/libs')

}
```

### settings.gradle 文件说明

```ad-warning
title: gradle版本为8
```

```gradle
// 插件下载仓库地址
pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }        mavenCentral()
        gradlePluginPortal()
    }
}
// 依赖下载仓库地址
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        // maven仓库地址
        maven {
            // 阿里云镜像仓库
            setUrl("https://maven.aliyun.com/repository/public")
        }
        // 谷歌
        google()
        // maven中央仓库
        mavenCentral()
    }
}
// 工程名称
rootProject.name = "BaiduFace"
// 编译模块
include ':app'
```

```ad-warning
title: gradle版本为6
```

```gradle
include ':app'
//include ':uniplugin_module'
//include ':uniplugin_component'
//include ':uniplugin_richalert'
//include ':zazdemo'
include ':uniplugin_finger'
```

### Activity 生命周期

==onCreate==:创建活动。把页面布局加载进内存，进入了初始状态。
==onStart==：开始活动。把活动页面显示在屏幕上，进入了就绪状态。
==onResume==:恢复活动。活动页面进入活跃状态，能够与用户正常交互，例如允许响应用户的点击动作、允许用户输入文字等等。
==onPause==：暂停活动。页面进入暂停状态，无法与用户正常交互。
==onStop==：停止活动。页面将不在屏幕上显示。回到桌面应用在后台挂起
==onDestroy==：销毁活动。回收活动占用的系统资源，把页面从内存中清除。
==onRestart==：重启活动。重新加载内存中的页面数据。
==onNewlntent==：重用已有的活动实例。

#### Activity 启动模式

==Intent.FLAG_ACTIVITY_NEW_TASK==：开辟一个新的任务栈
==Intent.FLAG_ACTIVITY_SINGLE_TOP==：当栈顶为待跳转的活动实例之时，则重用栈顶的实例==Intent.FLAG_ACTIVITY_CLEAR_TOP==：当栈中存在待跳转的活动实例时，则重新创建一个新实例并清除原实例上方的所有实例
==Intent.FLAG_ACTIVITY_NO_HISTORY==：栈中不保存新启动的活动实例==Intent.FLAG_ACTIVITY_CLEAR_TASK==：跳转到新页面时，栈中的原有实例都被清空

可以通过 | 使用两个

```java
// 删除原有栈 创建新的栈把要跳转的页面放入栈中
intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK)
```

```
同一个Module中

compile（过时）、api、implementation的使用效果相同

不同的Module中

compile（过时）、api关键字引入的包对于其他Module来说是可见的，而implementation关键字引入的包对于其他Module来说是不可见的

```

## USB 通信

```java
package com.example.usbdemo;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbEndpoint;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbManager;
import android.util.Log;

import java.util.HashMap;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class USBUtils {


    private static final String TAG = USBUtils.class.getSimpleName();

    private static final String ACTION_USB_PERMISSION = "com.android.example.USB_PERMISSION";

    private static volatile USBUtils sInstance;

    /**
     * 监听线程停止
     */
    private volatile boolean keepListening;

    /**
     * 线程池
     */
    public static final ExecutorService FIXED_POOL_SERVICE = Executors.newFixedThreadPool(3);

    /**
     * usb管理
     */
    private UsbManager mUsbManager;

    /**
     * usb设备
     */
    private UsbDevice mUsbDevice;

    private Context mContext;


    /**
     * usb通信
     */
    private UsbInterface mUsbInterface;


    /**
     * usb连接对象
     */
    private UsbDeviceConnection mUsbConnection;


    private final BroadcastReceiver mUsbReceiver;


    /**
     * 是否连接
     */
    private boolean isConnecting;


    /**
     * 是否关闭
     */
    private boolean isClosing;


    /**
     * 是否注册广播
     */
    private boolean isReceiverRegistered;



    public static USBUtils getInstance(Context context) {
        if (sInstance == null) {
            synchronized(USBUtils.class) {
                if (sInstance == null) {
                    sInstance = new USBUtils(context);
                }
            }
        }
        return sInstance;
    }

    private USBUtils(Context context){
        this.mContext = context;
        this.mUsbManager = (UsbManager) this.mContext.getSystemService(Context.USB_SERVICE);

        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
        filter.addAction("android.hardware.usb.action.USB_DEVICE_ATTACHED");
        filter.addAction("android.hardware.usb.action.USB_DEVICE_DETACHED");


        this.mUsbReceiver = new BroadcastReceiver() {
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                Log.i(TAG, "action:"+action);
                // USB权限授予的广播
                if (ACTION_USB_PERMISSION.equals(action)) {
                    synchronized (this) {
                        UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                        if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                            if (device != null) {
                                Log.i(TAG, "USB权限授予，打开设备");
//                                openDevice();
                            }
                        }
                        else {
                            Log.d("USB", "用户拒绝访问 " + device);
                        }
                    }
                }else if ("android.hardware.usb.action.USB_DEVICE_DETACHED".equals(action)) {
                    UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                    if (device != null && device.equals(mUsbDevice)) {
                        Log.i(TAG, "USB设备已断开: " + device);
                        disconnectDevice();
                    }
                }
            }
        };

        this.mContext.registerReceiver(mUsbReceiver, filter);
        this.isConnecting = false;
        this.isClosing = false;
        this.isReceiverRegistered = true;

    }


    private void openDevice(){
        Log.i(TAG, "打开设备:"+mUsbDevice);
        if(this.mUsbDevice != null){
            UsbDeviceConnection connection = this.mUsbManager.openDevice(this.mUsbDevice);
            if (connection != null) {
                Log.i(TAG, "连接成功");
                this.mUsbInterface = this.mUsbDevice.getInterface(0);
                this.mUsbConnection = connection;
            }
        }
    }


    /**
     * 打开连接
     * @param command
     */
    public synchronized void connectDevice(Consumer<String> command) {
        this.keepListening = true;
        Log.i(TAG, "connectDevice...");
        if (this.checkDeviceState()) {
            Log.i(TAG, "已连接");
        } else {
            this.enumerateDevice();
            this.openDevice();
            this.isConnecting = true;

            // 添加一个线程去监听设备回复
            FIXED_POOL_SERVICE.execute(()->{
                byte[] buffer = new byte[32];
                UsbEndpoint endpointIn = this.mUsbInterface.getEndpoint(0);
                while (keepListening) {
                    int received = mUsbConnection.bulkTransfer(endpointIn, buffer, buffer.length, 0);
                    if (received > 0) {
                        String s = byteArrayToHexString(buffer);
                        command.accept(s);
                    }
                }
            });
        }
    }


    /**
     * 断开连接
     */
    public synchronized void disconnectDevice() {

        if (isReceiverRegistered) {
            mContext.unregisterReceiver(mUsbReceiver);
            isReceiverRegistered = false;
        }
        if (mUsbConnection != null) {
            mUsbConnection.releaseInterface(mUsbInterface);
            mUsbConnection.close();
            mUsbConnection = null;
        }
        keepListening = false;
        mUsbDevice = null;
        mUsbInterface = null;
        isConnecting = false;
        isClosing = false;
    }


    /**
     * 发送消息
     * @param bytes
     */
    public void sendMsg(byte[] bytes) {


        if(mUsbInterface != null) {
            Log.i(TAG, "连接成功开始发送消息...");
            Log.i(TAG, "发送数据:"+byteArrayToHexString(bytes));
            // Assuming endpoint 1 is OUT
            UsbEndpoint endpointOut = mUsbInterface.getEndpoint(1);
            // 发送数据
            mUsbConnection.claimInterface(mUsbInterface, true);
            mUsbConnection.bulkTransfer(endpointOut, bytes, bytes.length, 2);
        }

    }


    private boolean checkDeviceState() {
        synchronized (this) {
            return isConnecting || isClosing;
        }
    }


    private void enumerateDevice() {
        if (this.mUsbManager != null) {
            // 获取全部的usb设备
            HashMap<String, UsbDevice> deviceList = this.mUsbManager.getDeviceList();
            // 权限标识
            PendingIntent permissionIntent = PendingIntent.getBroadcast(this.mContext, 0, new Intent(ACTION_USB_PERMISSION), 0);
            if (!deviceList.isEmpty()) {
                for (UsbDevice device : deviceList.values()) {
                    Log.i(TAG, "usb设备：" + device);
                    if (device.getVendorId() == 6790 && device.getProductId() == 29987) {
                        // 获取指定设备并且去授权会调用触发广播
                        this.mUsbManager.requestPermission(device, permissionIntent);
                        this.mUsbDevice = device;
                        break;                    }
                }

            }
        }
    }

    private String byteArrayToHexString(byte[] data) {
        StringBuilder sb = new StringBuilder(data.length * 2);
        for (byte b : data) {
            int v = b & 0xff;
            if (v < 16) {
                sb.append('0');
            }
            sb.append(Integer.toHexString(v));
        }
        return sb.toString().toUpperCase(Locale.getDefault());
    }

}
```

### USB 串口

[Android USB 通信（host 转串口）\_android usb 转串口-CSDN 博客](https://blog.csdn.net/lxt1292352578/article/details/131976810)
