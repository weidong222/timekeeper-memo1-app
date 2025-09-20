# 🚀 时光备忘录 APK 打包完整方案

## 📦 项目概述

本项目已完全配置为可打包成Android APK的Cordova应用，包含以下完整功能：

### ✨ 核心功能
- ✅ **备忘录管理**: 添加、编辑、删除备忘录
- ✅ **智能闹钟**: 精确时间提醒
- ✅ **优先级标记**: 高/中/低三级优先级
- ✅ **重复提醒**: 每日/每周/每月/工作日/周末
- ✅ **日历视图**: 月历显示和日期选择
- ✅ **搜索筛选**: 实时搜索和高级筛选
- ✅ **深色模式**: 完整的主题切换
- ✅ **移动端优化**: 触摸友好的响应式设计

### 📱 移动端增强
- ✅ **本地通知**: 系统级提醒通知
- ✅ **振动反馈**: 闹钟触发时振动
- ✅ **后台运行**: 应用后台时继续工作
- ✅ **状态栏适配**: 原生状态栏样式
- ✅ **返回键处理**: 符合Android规范的导航

## 🛠 快速开始

### 1. 环境准备
确保已安装以下软件：
- **Node.js** (LTS版本)
- **Java JDK** (8+)
- **Android Studio** (包含Android SDK)

### 2. 一键构建
```bash
# Windows用户
build-apk.bat

# Linux/Mac用户
chmod +x build-apk.sh
./build-apk.sh
```

### 3. 获取APK
构建完成后，APK文件位于：
```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## 📁 项目文件结构

```
备忘录闹钟/
├── 📄 config.xml                 # Cordova配置文件
├── 📄 package.json              # npm依赖配置
├── 📄 index.html                # 主页面
├── 📄 styles.css                # 样式文件
├── 📄 script.js                 # 核心逻辑
├── 📄 cordova-app.js            # 移动端增强
├── 📄 build-apk.bat             # Windows构建脚本
├── 📄 build-apk.sh              # Linux/Mac构建脚本
├── 📄 generate-icons.html       # 图标生成器
├── 📄 BUILD-APK-GUIDE.md        # 详细构建指南
├── 📄 APK-PACKAGE-README.md     # 本文件
└── 📁 res/                      # 资源文件夹
    ├── 📁 icon/android/         # 应用图标
    └── 📁 screen/android/       # 启动画面
```

## 🎨 自定义应用

### 修改应用信息
编辑 `config.xml` 中的应用信息：
```xml
<widget id="com.yourcompany.memo" version="1.0.0">
    <name>您的应用名称</name>
    <description>您的应用描述</description>
    <author email="your@email.com">您的名字</author>
</widget>
```

### 生成应用图标
1. 打开 `generate-icons.html` 在浏览器中
2. 自定义图标样式和颜色
3. 下载生成的图标文件
4. 将图标放入 `res/icon/android/` 目录

### 修改应用主题
在 `styles.css` 中修改CSS变量：
```css
:root {
    --primary-color: #87CEEB;    /* 主色调 */
    --success-color: #4CAF50;    /* 成功色 */
    --danger-color: #ff4444;     /* 危险色 */
}
```

## 🔧 高级配置

### 添加新插件
```bash
cordova plugin add plugin-name
```

### 修改Android权限
在 `config.xml` 中添加：
```xml
<uses-permission android:name="android.permission.PERMISSION_NAME" />
```

### 自定义启动画面
将启动画面图片放入 `res/screen/android/` 目录

## 📱 测试和调试

### 在模拟器中测试
```bash
cordova emulate android
```

### 在真实设备中测试
```bash
cordova run android --device
```

### 查看日志
```bash
cordova run android --device -- --verbose
```

## 🚀 发布准备

### 1. 签名APK
```bash
# 生成密钥库
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

# 签名APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name

# 优化APK
zipalign -v 4 app-release-unsigned.apk my-app-release.apk
```

### 2. 应用商店准备
- 📝 应用描述和关键词
- 📸 应用截图 (至少2张)
- 🎨 高分辨率应用图标 (512x512)
- 📋 隐私政策
- 🏷️ 应用分类和标签

## 🐛 常见问题解决

### 构建失败
1. 检查环境变量设置
2. 清理项目：`cordova clean`
3. 重新添加平台：`cordova platform remove android && cordova platform add android`

### 插件问题
1. 检查插件兼容性
2. 更新Cordova版本
3. 查看插件文档

### 权限问题
1. 检查Android权限配置
2. 确认目标SDK版本
3. 测试在不同Android版本上的表现

## 📞 技术支持

### 有用的命令
```bash
# 查看已安装的平台
cordova platform list

# 查看已安装的插件
cordova plugin list

# 检查环境
cordova requirements

# 清理项目
cordova clean

# 更新平台
cordova platform update android
```

### 调试技巧
- 使用Chrome DevTools调试WebView
- 查看设备日志：`adb logcat`
- 使用Cordova CLI的verbose模式

## 🎉 完成！

现在您已经拥有了一个完整的APK打包方案！按照上述步骤，您可以：

1. ✅ 快速构建APK
2. ✅ 自定义应用外观
3. ✅ 添加新功能
4. ✅ 发布到应用商店

祝您的时光备忘录应用发布成功！ 🚀📱
