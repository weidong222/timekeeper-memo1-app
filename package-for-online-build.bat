@echo off
echo ========================================
echo 时光备忘录 - 在线构建打包脚本
echo ========================================
echo.

echo 正在准备项目文件用于在线构建...
echo.

:: 创建临时目录
if exist "build-package" rmdir /s /q "build-package"
mkdir "build-package"

:: 复制必要文件
echo [1/6] 复制核心文件...
copy "config.xml" "build-package\"
copy "index.html" "build-package\"
copy "styles.css" "build-package\"
copy "script.js" "build-package\"
copy "cordova-app.js" "build-package\"

:: 复制资源文件夹
echo [2/6] 复制资源文件...
if exist "res" (
    xcopy "res" "build-package\res\" /E /I /Q
) else (
    echo 警告: res文件夹不存在，将创建默认图标
    mkdir "build-package\res\icon\android"
    mkdir "build-package\res\screen\android"
    
    :: 创建默认图标说明文件
    echo 请将应用图标文件放入此目录 > "build-package\res\icon\android\README.txt"
    echo 需要的图标尺寸: > "build-package\res\icon\android\README.txt"
    echo - ldpi.png (36x36) >> "build-package\res\icon\android\README.txt"
    echo - mdpi.png (48x48) >> "build-package\res\icon\android\README.txt"
    echo - hdpi.png (72x72) >> "build-package\res\icon\android\README.txt"
    echo - xhdpi.png (96x96) >> "build-package\res\icon\android\README.txt"
    echo - xxhdpi.png (144x144) >> "build-package\res\icon\android\README.txt"
    echo - xxxhdpi.png (192x192) >> "build-package\res\icon\android\README.txt"
)

:: 创建简化的config.xml（移除本地路径依赖）
echo [3/6] 优化配置文件...
powershell -Command "(Get-Content 'build-package\config.xml') -replace 'src=\"res/', 'src=\"res/' | Set-Content 'build-package\config.xml'"

:: 创建package.json（简化版）
echo [4/6] 创建package.json...
echo { > "build-package\package.json"
echo   "name": "timekeeper-memo", >> "build-package\package.json"
echo   "displayName": "时光备忘录", >> "build-package\package.json"
echo   "version": "1.0.0", >> "build-package\package.json"
echo   "description": "一个功能强大的移动备忘录闹钟应用", >> "build-package\package.json"
echo   "cordova": { >> "build-package\package.json"
echo     "platforms": ["android"], >> "build-package\package.json"
echo     "plugins": { >> "build-package\package.json"
echo       "cordova-plugin-whitelist": {}, >> "build-package\package.json"
echo       "cordova-plugin-statusbar": {}, >> "build-package\package.json"
echo       "cordova-plugin-device": {}, >> "build-package\package.json"
echo       "cordova-plugin-splashscreen": {}, >> "build-package\package.json"
echo       "cordova-plugin-vibration": {} >> "build-package\package.json"
echo     } >> "build-package\package.json"
echo   } >> "build-package\package.json"
echo } >> "build-package\package.json"

:: 创建构建说明文件
echo [5/6] 创建构建说明...
echo 时光备忘录 - 在线构建包 > "build-package\BUILD-INSTRUCTIONS.txt"
echo ================================ >> "build-package\BUILD-INSTRUCTIONS.txt"
echo. >> "build-package\BUILD-INSTRUCTIONS.txt"
echo 此包已准备好用于在线构建服务，如: >> "build-package\BUILD-INSTRUCTIONS.txt"
echo - PhoneGap Build: https://build.phonegap.com/ >> "build-package\BUILD-INSTRUCTIONS.txt"
echo - Monaca: https://monaca.io/ >> "build-package\BUILD-INSTRUCTIONS.txt"
echo - Ionic Appflow: https://ionicframework.com/appflow >> "build-package\BUILD-INSTRUCTIONS.txt"
echo. >> "build-package\BUILD-INSTRUCTIONS.txt"
echo 使用步骤: >> "build-package\BUILD-INSTRUCTIONS.txt"
echo 1. 将此文件夹压缩为ZIP文件 >> "build-package\BUILD-INSTRUCTIONS.txt"
echo 2. 上传到在线构建服务 >> "build-package\BUILD-INSTRUCTIONS.txt"
echo 3. 等待构建完成 >> "build-package\BUILD-INSTRUCTIONS.txt"
echo 4. 下载生成的APK文件 >> "build-package\BUILD-INSTRUCTIONS.txt"
echo. >> "build-package\BUILD-INSTRUCTIONS.txt"
echo 构建时间: %date% %time% >> "build-package\BUILD-INSTRUCTIONS.txt"

:: 创建ZIP文件（如果有PowerShell 5.0+）
echo [6/6] 创建ZIP文件...
powershell -Command "if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) { Compress-Archive -Path 'build-package\*' -DestinationPath '时光备忘录-在线构建包.zip' -Force; Write-Host 'ZIP文件创建成功: 时光备忘录-在线构建包.zip' } else { Write-Host '请手动将 build-package 文件夹压缩为ZIP文件' }"

echo.
echo ========================================
echo 打包完成！
echo ========================================
echo.
echo 生成的文件:
echo - build-package\ (项目文件夹)
echo - 时光备忘录-在线构建包.zip (如果支持自动压缩)
echo.
echo 下一步操作:
echo 1. 如果没有自动生成ZIP文件，请手动压缩 build-package 文件夹
echo 2. 访问在线构建服务 (推荐: https://build.phonegap.com/)
echo 3. 上传ZIP文件
echo 4. 等待构建完成并下载APK
echo.
echo 详细说明请查看: online-build-guide.md
echo.
pause
