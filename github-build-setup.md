# 🚀 GitHub Actions 自动APK构建方案

由于本地环境缺少必要组件，我为您创建了一个使用GitHub Actions的自动构建方案。

## 📋 准备步骤

### 1. 创建GitHub仓库
1. 访问 https://github.com/
2. 点击 "New repository"
3. 仓库名称: `timekeeper-memo-app`
4. 设置为 Public（免费用户需要公开仓库才能使用Actions）
5. 点击 "Create repository"

### 2. 上传项目文件
将以下文件上传到GitHub仓库：
```
timekeeper-memo-app/
├── .github/
│   └── workflows/
│       └── build-apk.yml
├── www/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── cordova-app.js
│   ├── manifest.json
│   ├── sw.js
│   └── res/
├── config.xml
├── package.json
└── README.md
```

## 🔧 GitHub Actions 配置

我将为您创建自动构建配置文件：

### .github/workflows/build-apk.yml
```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup Java JDK
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'temurin'
        
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
      
    - name: Install Cordova
      run: |
        npm install -g cordova
        
    - name: Install dependencies
      run: npm install
      
    - name: Add Android platform
      run: cordova platform add android
      
    - name: Build APK
      run: cordova build android --release
      
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: timekeeper-memo-apk
        path: platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## 🎯 使用步骤

### 1. 自动构建
1. 将代码推送到GitHub仓库
2. GitHub Actions 会自动开始构建
3. 构建完成后，在 Actions 页面下载APK

### 2. 手动触发构建
1. 访问仓库的 Actions 页面
2. 选择 "Build Android APK" workflow
3. 点击 "Run workflow"
4. 等待构建完成

### 3. 下载APK
1. 构建完成后，点击构建任务
2. 在 Artifacts 部分下载 `timekeeper-memo-apk`
3. 解压获得APK文件

## 📱 APK签名（可选）

生成的APK是未签名的，如需发布到应用商店：

### 1. 生成密钥库
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 签名APK
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name
```

### 3. 对齐APK
```bash
zipalign -v 4 app-release-unsigned.apk timekeeper-memo-signed.apk
```

## 🔄 替代方案

如果GitHub Actions不可用，还可以使用：

### 1. Netlify + PWABuilder
1. 将项目部署到Netlify
2. 使用PWABuilder生成APK

### 2. CodeSandbox + 在线构建
1. 在CodeSandbox中创建项目
2. 使用在线Cordova构建服务

### 3. 本地Docker构建
```bash
docker run --rm -v $(pwd):/workspace cordova/android cordova build android
```

## 📞 需要帮助？

如果您需要我：
- 帮助设置GitHub仓库
- 创建构建配置文件
- 解决构建问题
- 配置APK签名

请告诉我！我会为您提供详细的指导。

## 🎊 优势

使用GitHub Actions构建的优势：
- ✅ 无需本地环境配置
- ✅ 自动化构建流程
- ✅ 免费使用（公开仓库）
- ✅ 构建历史记录
- ✅ 多平台支持
- ✅ 专业的CI/CD流程
