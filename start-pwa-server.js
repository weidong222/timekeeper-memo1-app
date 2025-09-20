const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const BUILD_DIR = path.join(__dirname, 'build-package');

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
    // 解析URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 默认文件
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // 构建文件路径
    const filePath = path.join(BUILD_DIR, pathname);
    
    // 检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // 文件不存在，返回404
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <head><title>404 - 文件未找到</title></head>
                    <body>
                        <h1>404 - 文件未找到</h1>
                        <p>请求的文件 ${pathname} 不存在</p>
                        <a href="/">返回首页</a>
                    </body>
                </html>
            `);
            return;
        }
        
        // 读取文件
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>500 - 服务器错误</title></head>
                        <body>
                            <h1>500 - 服务器错误</h1>
                            <p>读取文件时发生错误</p>
                        </body>
                    </html>
                `);
                return;
            }
            
            // 设置响应头
            const mimeType = getMimeType(filePath);
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache'
            });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log('🚀 时光备忘录 PWA 服务器已启动');
    console.log('================================');
    console.log(`📱 本地访问: http://localhost:${PORT}`);
    console.log(`🌐 网络访问: http://[您的IP]:${PORT}`);
    console.log('');
    console.log('📋 功能测试清单:');
    console.log('✅ 基本功能 - 添加/编辑/删除备忘录');
    console.log('✅ 闹钟提醒 - 设置时间提醒');
    console.log('✅ 优先级 - 高/中/低优先级标记');
    console.log('✅ 重复提醒 - 每日/每周/每月等');
    console.log('✅ 日历视图 - 月历显示');
    console.log('✅ 搜索筛选 - 实时搜索');
    console.log('✅ 深色模式 - 主题切换');
    console.log('✅ PWA功能 - 可安装到桌面');
    console.log('');
    console.log('🔧 PWA测试步骤:');
    console.log('1. 在Chrome中打开上述地址');
    console.log('2. 按F12打开开发者工具');
    console.log('3. 切换到Application标签');
    console.log('4. 检查Manifest和Service Worker');
    console.log('5. 点击地址栏的"安装"按钮测试PWA安装');
    console.log('');
    console.log('📱 生成APK步骤:');
    console.log('1. 将PWA部署到公网（如Netlify）');
    console.log('2. 访问 https://www.pwabuilder.com/');
    console.log('3. 输入您的PWA网址');
    console.log('4. 选择Android平台生成APK');
    console.log('');
    console.log('按 Ctrl+C 停止服务器');
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('');
    console.log('🛑 服务器已停止');
    process.exit(0);
});

// 错误处理
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ 端口 ${PORT} 已被占用，请尝试其他端口`);
        console.log('💡 您可以修改 start-pwa-server.js 中的 PORT 变量');
    } else {
        console.error('❌ 服务器错误:', err);
    }
});

// 检查构建目录
if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ 构建目录不存在:', BUILD_DIR);
    console.log('💡 请确保 build-package 目录存在');
    process.exit(1);
}
