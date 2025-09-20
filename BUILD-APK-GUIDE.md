# 时光备忘录 APK 构建指南

本指南将帮助您将时光备忘录Web应用打包成Android APK文件。

## 📋 前置要求

### 1. 安装Node.js
- 下载并安装 [Node.js](https://nodejs.org/) (推荐LTS版本)
- 验证安装: `node --version` 和 `npm --version`

### 2. 安装Java JDK
- 下载并安装 [Java JDK 8或更高版本](https://www.oracle.com/java/technologies/downloads/)
- 设置 `JAVA_HOME` 环境变量
- 验证安装: `java -version`

### 3. 安装Android Studio
- 下载并安装 [Android Studio](https://developer.android.com/studio)
- 安装Android SDK (API Level 22+)
- 设置 `ANDROID_HOME` 环境变量指向SDK目录
- 将 `%ANDROID_HOME%\tools` 和 `%ANDROID_HOME%\platform-tools` 添加到PATH

### 4. 环境变量设置示例 (Windows)
```bash
JAVA_HOME=C:\Program Files\Java\jdk-11.0.x
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

## 🚀 快速构建

### 方法一: 使用构建脚本 (推荐)

**Windows:**
```bash
# 双击运行或在命令行执行
build-apk.bat
```

**Linux/Mac:**
```bash
# 给脚本执行权限
chmod +x build-apk.sh
# 运行脚本
./build-apk.sh
```

### 方法二: 手动构建

1. **安装依赖**
```bash
npm install
```

2. **安装Cordova CLI**
```bash
npm install -g cordova
```

3. **添加Android平台**
```bash
cordova platform add android
```

4. **安装插件**
```bash
npm run install-plugins
```

5. **构建APK**
```bash
cordova build android --release
```

## 📱 构建结果

构建成功后，APK文件将位于:
```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## 🔐 APK签名 (可选)

为了在设备上安装APK，您需要对其进行签名:

### 1. 生成密钥库
```bash
keytool -genkey -v -keystore timekeeper.keystore -alias timekeeper -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 签名APK
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore timekeeper.keystore app-release-unsigned.apk timekeeper
```

### 3. 优化APK (可选)
```bash
zipalign -v 4 app-release-unsigned.apk timekeeper-memo-signed.apk
```

## 📦 项目结构

```
备忘录闹钟/
├── config.xml              # Cordova配置文件
├── package.json            # npm配置文件
├── index.html              # 主页面
├── styles.css              # 样式文件
├── script.js               # 主要逻辑
├── cordova-app.js          # 移动端增强功能
├── build-apk.bat           # Windows构建脚本
├── build-apk.sh            # Linux/Mac构建脚本
├── res/                    # 资源文件夹
│   ├── icon/android/       # 应用图标
│   └── screen/android/     # 启动画面
└── platforms/              # 平台特定文件 (构建后生成)
    └── android/
```

## 🔧 自定义配置

### 修改应用信息
编辑 `config.xml` 文件:
```xml
<widget id="com.yourcompany.timekeeper" version="1.0.0">
    <name>您的应用名称</name>
    <description>您的应用描述</description>
    <author email="your@email.com">您的名字</author>
</widget>
```

### 添加应用图标
将不同尺寸的图标放入 `res/icon/android/` 目录:
- ldpi.png (36x36)
- mdpi.png (48x48)
- hdpi.png (72x72)
- xhdpi.png (96x96)
- xxhdpi.png (144x144)
- xxxhdpi.png (192x192)

### 添加启动画面
将启动画面图片放入 `res/screen/android/` 目录

## 🐛 常见问题

### 1. "ANDROID_HOME未设置"
- 确保安装了Android Studio
- 正确设置ANDROID_HOME环境变量
- 重启命令行工具

### 2. "Java版本不兼容"
- 确保安装了Java JDK 8+
- 设置JAVA_HOME环境变量
- 检查PATH中的Java路径

### 3. "构建失败"
- 检查网络连接
- 清理项目: `cordova clean`
- 重新添加平台: `cordova platform remove android && cordova platform add android`

### 4. "插件安装失败"
- 检查npm配置
- 尝试使用管理员权限运行
- 清理npm缓存: `npm cache clean --force`

## 📱 测试APK

### 在模拟器中测试
```bash
cordova emulate android
```

### 在真实设备中测试
1. 启用开发者选项和USB调试
2. 连接设备到电脑
3. 运行: `cordova run android --device`

## 🚀 发布准备

1. **签名APK** (必须)
2. **测试所有功能**
3. **优化性能**
4. **准备应用商店资料**
   - 应用描述
   - 截图
   - 隐私政策
   - 应用图标

## 📞 技术支持

如果在构建过程中遇到问题，请检查:
1. 所有前置要求是否满足
2. 环境变量是否正确设置
3. 网络连接是否正常
4. 是否有足够的磁盘空间

构建成功后，您就可以在Android设备上安装和使用时光备忘录应用了！
