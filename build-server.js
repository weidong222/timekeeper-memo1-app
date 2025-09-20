const fs = require('fs');
const path = require('path');
const http = require('http');
const archiver = require('archiver');

console.log('🚀 时光备忘录 APK 构建服务器');
console.log('================================');

// 检查构建包是否存在
const buildPackagePath = path.join(__dirname, 'build-package');
if (!fs.existsSync(buildPackagePath)) {
    console.error('❌ 构建包不存在，请先运行 package-for-online-build.bat');
    process.exit(1);
}

// 创建基本的图标文件（如果不存在）
function createDefaultIcons() {
    const iconDir = path.join(buildPackagePath, 'res', 'icon', 'android');
    
    if (!fs.existsSync(iconDir)) {
        fs.mkdirSync(iconDir, { recursive: true });
    }

    const iconSizes = [
        { name: 'ldpi', size: 36 },
        { name: 'mdpi', size: 48 },
        { name: 'hdpi', size: 72 },
        { name: 'xhdpi', size: 96 },
        { name: 'xxhdpi', size: 144 },
        { name: 'xxxhdpi', size: 192 }
    ];

    // 创建简单的SVG图标并转换为PNG（模拟）
    iconSizes.forEach(({ name, size }) => {
        const iconPath = path.join(iconDir, `${name}.png`);
        if (!fs.existsSync(iconPath)) {
            // 创建一个占位符文件
            const svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
                <rect width="${size}" height="${size}" fill="#87CEEB" rx="${size * 0.2}"/>
                <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="white" font-family="Arial" font-size="${size * 0.35}" font-weight="bold">时光</text>
            </svg>`;
            
            // 由于无法直接转换SVG到PNG，创建一个说明文件
            fs.writeFileSync(iconPath.replace('.png', '.svg'), svgContent);
            console.log(`📝 创建图标模板: ${name}.svg`);
        }
    });
}

// 创建APK模拟文件
function createMockAPK() {
    const apkPath = path.join(__dirname, '时光备忘录-v1.0.0.apk');
    
    // 创建一个ZIP文件作为APK的模拟
    const output = fs.createWriteStream(apkPath);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    output.on('close', function() {
        console.log('📱 APK文件已生成: ' + apkPath);
        console.log('📊 文件大小: ' + (archive.pointer() / 1024 / 1024).toFixed(2) + ' MB');
        console.log('');
        console.log('⚠️  注意: 这是一个模拟APK文件，用于演示目的');
        console.log('🔧 要生成真正的APK，请使用以下方法之一:');
        console.log('   1. 在线构建: https://build.phonegap.com/');
        console.log('   2. 本地环境: 运行 setup-environment.bat');
        console.log('');
    });

    archive.on('error', function(err) {
        console.error('❌ 创建APK时出错:', err);
    });

    archive.pipe(output);

    // 添加构建包中的所有文件
    archive.directory(buildPackagePath, false);

    // 添加Android特定文件（模拟）
    archive.append('Mock Android Manifest', { name: 'AndroidManifest.xml' });
    archive.append('Mock Classes.dex', { name: 'classes.dex' });
    archive.append('Mock Resources', { name: 'resources.arsc' });

    archive.finalize();
}

// 创建构建报告
function createBuildReport() {
    const report = {
        appName: '时光备忘录',
        version: '1.0.0',
        buildTime: new Date().toISOString(),
        platform: 'Android',
        buildType: 'Mock Build',
        features: [
            '备忘录管理',
            '智能闹钟',
            '优先级标记',
            '重复提醒',
            '日历视图',
            '搜索筛选',
            '深色模式',
            '移动端优化'
        ],
        plugins: [
            'cordova-plugin-whitelist',
            'cordova-plugin-statusbar',
            'cordova-plugin-device',
            'cordova-plugin-splashscreen',
            'cordova-plugin-vibration'
        ],
        warnings: [
            '这是一个模拟构建，不是真正的APK文件',
            '要获得可安装的APK，请使用真实的构建环境'
        ]
    };

    const reportPath = path.join(__dirname, 'build-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('📋 构建报告已生成: build-report.json');
}

// 主构建流程
function startBuild() {
    console.log('🔧 开始构建流程...');
    console.log('');

    console.log('[1/4] 检查项目文件...');
    const requiredFiles = ['config.xml', 'index.html', 'styles.css', 'script.js'];
    let allFilesExist = true;

    requiredFiles.forEach(file => {
        const filePath = path.join(buildPackagePath, file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} - 文件缺失`);
            allFilesExist = false;
        }
    });

    if (!allFilesExist) {
        console.error('❌ 构建失败: 缺少必要文件');
        return;
    }

    console.log('');
    console.log('[2/4] 创建应用图标...');
    createDefaultIcons();

    console.log('');
    console.log('[3/4] 生成APK文件...');
    createMockAPK();

    console.log('[4/4] 生成构建报告...');
    createBuildReport();

    console.log('');
    console.log('🎉 构建完成!');
}

// 检查是否安装了archiver
try {
    require('archiver');
    startBuild();
} catch (error) {
    console.log('📦 正在安装必要依赖...');
    const { exec } = require('child_process');
    
    exec('npm install archiver', (error, stdout, stderr) => {
        if (error) {
            console.error('❌ 安装依赖失败:', error);
            console.log('');
            console.log('🔧 请手动运行: npm install archiver');
            console.log('然后重新运行此脚本');
            return;
        }
        
        console.log('✅ 依赖安装完成');
        console.log('');
        
        // 重新开始构建
        delete require.cache[require.resolve('archiver')];
        startBuild();
    });
}
