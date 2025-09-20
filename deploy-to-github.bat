@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 时光备忘录 - GitHub 部署脚本
echo ========================================
echo.

echo 📋 此脚本将帮助您将项目部署到GitHub并自动构建APK
echo.

:: 检查Git是否安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git 未安装，请先安装 Git
    echo 💡 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git 已安装
echo.

:: 检查是否已经是Git仓库
if exist ".git" (
    echo 📁 检测到现有Git仓库
    echo.
    echo 选择操作:
    echo 1. 推送到现有远程仓库
    echo 2. 重新初始化仓库
    echo 3. 退出
    echo.
    set /p choice="请选择 (1-3): "
    
    if "%choice%"=="3" exit /b 0
    if "%choice%"=="2" (
        rmdir /s /q .git
        goto :init_repo
    )
    if "%choice%"=="1" goto :push_existing
) else (
    goto :init_repo
)

:init_repo
echo 🔧 初始化Git仓库...
git init
git branch -M main

:: 创建.gitignore
echo 📝 创建 .gitignore 文件...
(
echo node_modules/
echo platforms/
echo plugins/
echo *.log
echo .DS_Store
echo Thumbs.db
echo temp-check/
echo timekeeper-app/
echo 时光备忘录-v1.0.0.apk
) > .gitignore

echo.
echo 📋 请在GitHub上创建新仓库:
echo 1. 访问 https://github.com/new
echo 2. 仓库名称: timekeeper-memo-app
echo 3. 设置为 Public (免费用户需要公开仓库才能使用Actions)
echo 4. 不要初始化README、.gitignore或license
echo 5. 点击 "Create repository"
echo.
echo 创建完成后，复制仓库URL (例如: https://github.com/username/timekeeper-memo-app.git)
echo.
set /p repo_url="请输入GitHub仓库URL: "

if "%repo_url%"=="" (
    echo ❌ 仓库URL不能为空
    pause
    exit /b 1
)

echo.
echo 🔗 添加远程仓库...
git remote add origin %repo_url%

:push_existing
echo.
echo 📦 添加文件到Git...
git add .

echo.
echo 💬 提交更改...
git commit -m "🎉 初始提交: 时光备忘录应用

✨ 功能特性:
- 📝 备忘录管理 (添加/编辑/删除)
- ⏰ 智能闹钟提醒
- 🏷️ 优先级标记 (高/中/低)
- 🔄 重复提醒 (每日/每周/每月/工作日/周末)
- 📅 日历视图和日期选择
- 🔍 实时搜索和高级筛选
- 🌙 深色模式主题切换
- 📱 完整的移动端优化
- 🔧 PWA支持 (可安装到桌面)

🛠️ 技术栈:
- HTML5 + CSS3 + JavaScript
- Apache Cordova
- Progressive Web App (PWA)
- GitHub Actions 自动构建

📱 构建说明:
推送到GitHub后，GitHub Actions将自动构建APK文件
在Actions页面可以下载生成的APK"

echo.
echo 🚀 推送到GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 🎉 部署成功!
    echo ========================================
    echo.
    echo 📱 下一步操作:
    echo 1. 访问您的GitHub仓库
    echo 2. 点击 "Actions" 标签页
    echo 3. 等待自动构建完成 (约5-10分钟)
    echo 4. 构建完成后，点击构建任务
    echo 5. 在 "Artifacts" 部分下载APK文件
    echo.
    echo 🔗 GitHub仓库: %repo_url%
    echo 🔗 Actions页面: %repo_url://.git=/actions%
    echo.
    echo 💡 提示:
    echo - 首次构建可能需要较长时间
    echo - 可以在Actions页面查看构建进度
    echo - 生成的APK文件有效期30天
    echo.
    
    :: 询问是否打开GitHub页面
    set /p open_github="是否现在打开GitHub仓库页面? (y/n): "
    if /i "%open_github%"=="y" (
        start "" "%repo_url://.git=%"
    )
    
) else (
    echo.
    echo ❌ 推送失败!
    echo.
    echo 💡 可能的原因:
    echo 1. 网络连接问题
    echo 2. 仓库URL错误
    echo 3. 没有推送权限
    echo 4. 需要GitHub身份验证
    echo.
    echo 🔧 解决方案:
    echo 1. 检查网络连接
    echo 2. 确认仓库URL正确
    echo 3. 配置Git身份验证:
    echo    git config --global user.name "Your Name"
    echo    git config --global user.email "your.email@example.com"
    echo 4. 使用GitHub Desktop或配置SSH密钥
    echo.
)

echo.
echo 📚 相关文档:
echo - GitHub Actions构建指南: github-build-setup.md
echo - 在线构建指南: online-build-guide.md
echo - PWA转APK指南: pwa-to-apk-guide.md
echo.
pause
