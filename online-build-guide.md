# 🌐 在线APK构建指南

如果您不想在本地安装完整的Android开发环境，可以使用在线构建服务快速生成APK。

## 🚀 推荐的在线构建服务

### 1. PhoneGap Build (Adobe)
- **网址**: https://build.phonegap.com/
- **特点**: 官方Cordova构建服务
- **费用**: 免费版支持1个私有项目
- **支持**: iOS和Android

### 2. Monaca (Asial Corporation)
- **网址**: https://monaca.io/
- **特点**: 完整的移动开发平台
- **费用**: 有免费版本
- **支持**: 多平台构建

### 3. Ionic Appflow
- **网址**: https://ionicframework.com/appflow
- **特点**: 专业的移动CI/CD平台
- **费用**: 有免费版本
- **支持**: 高级功能丰富

## 📦 使用PhoneGap Build的步骤

### 第1步: 准备项目文件
1. 将以下文件打包成ZIP文件:
   ```
   时光备忘录.zip
   ├── config.xml
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── cordova-app.js
   └── res/
       ├── icon/android/
       └── screen/android/
   ```

### 第2步: 上传到PhoneGap Build
1. 访问 https://build.phonegap.com/
2. 使用Adobe ID登录（免费注册）
3. 点击 "Upload a .zip file"
4. 上传您的项目ZIP文件
5. 等待构建完成

### 第3步: 下载APK
1. 构建完成后，点击Android图标
2. 下载生成的APK文件
3. 安装到您的Android设备

## 🛠 本地快速构建方案

如果您想尝试本地构建，我已经为您准备了自动化脚本：

### 运行环境配置脚本
```bash
# 以管理员身份运行
setup-environment.bat
```

这个脚本将自动安装：
- ✅ Chocolatey 包管理器
- ✅ Java JDK
- ✅ Gradle
- 📋 引导安装 Android Studio

### 手动安装步骤（如果自动脚本失败）

#### 1. 安装Java JDK
- 下载: https://adoptium.net/
- 安装后设置 JAVA_HOME 环境变量

#### 2. 安装Android Studio
- 下载: https://developer.android.com/studio
- 安装Android SDK (API Level 33+)
- 设置 ANDROID_HOME 环境变量

#### 3. 环境变量配置
```bash
# Windows环境变量设置
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.x-hotspot
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin
```

## 🔧 验证环境配置

安装完成后，运行以下命令验证：

```bash
# 检查Java
java -version

# 检查Android SDK
sdkmanager --list

# 检查Gradle
gradle --version

# 检查Cordova环境
cordova requirements
```

## 📱 构建APK

环境配置完成后，运行：

```bash
# 自动构建
build-apk.bat

# 或手动构建
cordova platform add android
cordova build android --release
```

## 🎯 推荐方案

**对于快速测试**: 使用在线构建服务（PhoneGap Build）
**对于长期开发**: 配置本地环境

## 📞 需要帮助？

如果在构建过程中遇到问题：

1. **检查错误日志**: 查看详细的错误信息
2. **参考文档**: BUILD-APK-GUIDE.md
3. **在线搜索**: 搜索具体的错误信息
4. **社区支持**: Cordova官方论坛和Stack Overflow

选择最适合您的方案开始构建您的APK吧！🚀
