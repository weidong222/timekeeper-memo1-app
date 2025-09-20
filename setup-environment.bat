@echo off
echo ========================================
echo 时光备忘录 - 自动环境配置脚本
echo ========================================
echo.

echo 此脚本将帮助您安装构建APK所需的所有工具
echo 请确保您有管理员权限
echo.
pause

echo [1/4] 检查并安装 Chocolatey 包管理器...
where choco >nul 2>&1
if %errorlevel% neq 0 (
    echo 正在安装 Chocolatey...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    if %errorlevel% neq 0 (
        echo 错误: Chocolatey 安装失败
        echo 请手动安装或使用管理员权限运行此脚本
        pause
        exit /b 1
    )
    echo Chocolatey 安装成功！
) else (
    echo Chocolatey 已安装
)

echo.
echo [2/4] 安装 Java JDK...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 正在安装 OpenJDK 11...
    choco install openjdk11 -y
    if %errorlevel% neq 0 (
        echo 警告: Java 自动安装失败
        echo 请手动下载安装: https://adoptium.net/
        echo 安装后请重新运行此脚本
        pause
        exit /b 1
    )
    echo Java JDK 安装成功！
    echo 请重启命令行窗口以使环境变量生效
) else (
    echo Java 已安装
)

echo.
echo [3/4] 安装 Android Studio...
echo 正在下载 Android Studio...
echo 注意: 这将打开浏览器，请手动下载并安装 Android Studio
start https://developer.android.com/studio
echo.
echo 安装 Android Studio 后，请执行以下步骤:
echo 1. 打开 Android Studio
echo 2. 完成初始设置向导
echo 3. 安装 Android SDK (API Level 33 或更高)
echo 4. 设置环境变量 ANDROID_HOME
echo.
echo 环境变量设置示例:
echo ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
echo PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
echo.
pause

echo.
echo [4/4] 安装 Gradle...
where gradle >nul 2>&1
if %errorlevel% neq 0 (
    echo 正在安装 Gradle...
    choco install gradle -y
    if %errorlevel% neq 0 (
        echo 警告: Gradle 自动安装失败
        echo Android Studio 通常包含 Gradle，如果您已安装 Android Studio，可能不需要单独安装
    ) else (
        echo Gradle 安装成功！
    )
) else (
    echo Gradle 已安装
)

echo.
echo ========================================
echo 环境配置完成！
echo ========================================
echo.
echo 下一步操作:
echo 1. 重启命令行窗口
echo 2. 确保 Android Studio 已完全安装并配置
echo 3. 设置 ANDROID_HOME 环境变量
echo 4. 运行 build-apk.bat 构建APK
echo.
echo 如果遇到问题，请参考 BUILD-APK-GUIDE.md 文档
echo.
pause
