#!/bin/bash

echo "========================================"
echo "时光备忘录 APK 构建脚本"
echo "========================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查Java是否安装
if ! command -v java &> /dev/null; then
    echo "错误: 未检测到Java，请先安装Java JDK"
    echo "下载地址: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

# 检查Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "错误: 未设置ANDROID_HOME环境变量"
    echo "请安装Android Studio并设置ANDROID_HOME环境变量"
    exit 1
fi

echo "开始构建APK..."
echo

# 安装依赖
echo "[1/6] 安装npm依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "错误: npm install 失败"
    exit 1
fi

# 安装Cordova CLI
echo "[2/6] 安装Cordova CLI..."
npm install -g cordova
if [ $? -ne 0 ]; then
    echo "错误: Cordova安装失败"
    exit 1
fi

# 添加Android平台
echo "[3/6] 添加Android平台..."
cordova platform add android
if [ $? -ne 0 ]; then
    echo "警告: Android平台可能已存在"
fi

# 安装插件
echo "[4/6] 安装Cordova插件..."
npm run install-plugins
if [ $? -ne 0 ]; then
    echo "错误: 插件安装失败"
    exit 1
fi

# 准备构建
echo "[5/6] 准备构建..."
cordova prepare
if [ $? -ne 0 ]; then
    echo "错误: 构建准备失败"
    exit 1
fi

# 构建APK
echo "[6/6] 构建APK..."
cordova build android --release
if [ $? -ne 0 ]; then
    echo "错误: APK构建失败"
    exit 1
fi

echo
echo "========================================"
echo "构建完成！"
echo "========================================"
echo "APK文件位置:"
echo "platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
echo
echo "注意: 这是未签名的APK，如需发布请进行签名"
echo
