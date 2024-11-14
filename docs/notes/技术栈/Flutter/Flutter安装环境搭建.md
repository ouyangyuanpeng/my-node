---
title: Flutter安装环境搭建
createTime: 2024/11/14 10:21:26
permalink: /技术栈/92vpkjlu/
---
下载地址：[安装和环境配置 | Flutter 中文文档 - Flutter 中文开发者网站 - Flutter](https://docs.flutter.cn/get-started/install)

1. 配置环境变量
   国内需要配置两个环境变量防止网络不通
   - FLUTTER_STORAGE_BASE_URL = https://storage.flutter-io.cn
   - PUB_HOSTED_URL = https://pub.flutter-io.cn
2. 配置安卓 sdk 目录
   `flutter config --android-sdk D:\develop\sdk\AndroidSdk`
3. 签名许可证
   `flutter doctor --android-licenses`
4. 检测是否配置成功
   `flutter doctor`
