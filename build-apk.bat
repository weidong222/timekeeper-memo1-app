@echo off
echo ========================================
echo 时光备忘录 APK 构建脚本
echo ========================================

:: 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查Java是否安装
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Java，请先安装Java JDK
    echo 下载地址: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

:: 检查Android SDK
if not defined ANDROID_HOME (
    echo 错误: 未设置ANDROID_HOME环境变量
    echo 请安装Android Studio并设置ANDROID_HOME环境变量
    pause
    exit /b 1
)

echo 开始构建APK...
echo.

:: 安装依赖
echo [1/6] 安装npm依赖...
call npm install
if %errorlevel% neq 0 (
    echo 错误: npm install 失败
    pause
    exit /b 1
)

:: 安装Cordova CLI
echo [2/6] 安装Cordova CLI...
call npm install -g cordova
if %errorlevel% neq 0 (
    echo 错误: Cordova安装失败
    pause
    exit /b 1
)

:: 添加Android平台
echo [3/6] 添加Android平台...
call cordova platform add android
if %errorlevel% neq 0 (
    echo 警告: Android平台可能已存在
)

:: 安装插件
echo [4/6] 安装Cordova插件...
call npm run install-plugins
if %errorlevel% neq 0 (
    echo 错误: 插件安装失败
    pause
    exit /b 1
)

:: 准备构建
echo [5/6] 准备构建...
call cordova prepare
if %errorlevel% neq 0 (
    echo 错误: 构建准备失败
    pause
    exit /b 1
)

:: 构建APK
echo [6/6] 构建APK...
call cordova build android --release
if %errorlevel% neq 0 (
    echo 错误: APK构建失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo 构建完成！
echo ========================================
echo APK文件位置:
echo platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk
echo.
echo 注意: 这是未签名的APK，如需发布请进行签名
echo.
pause
