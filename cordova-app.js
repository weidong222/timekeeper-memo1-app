// Cordova移动端增强功能
class CordovaEnhancer {
    constructor() {
        this.isDeviceReady = false;
        this.notifications = [];
        this.init();
    }

    init() {
        document.addEventListener('deviceready', () => {
            this.isDeviceReady = true;
            this.setupMobileFeatures();
            console.log('Cordova设备就绪');
        }, false);

        // 如果不是Cordova环境，直接初始化
        if (!window.cordova) {
            setTimeout(() => {
                this.setupWebFeatures();
            }, 100);
        }
    }

    setupMobileFeatures() {
        this.setupStatusBar();
        this.setupBackButton();
        this.setupNotifications();
        this.setupVibration();
        this.setupBackgroundMode();
    }

    setupWebFeatures() {
        console.log('Web环境，跳过Cordova特定功能');
        // 在Web环境中使用Web API替代
        this.setupWebNotifications();
    }

    // 状态栏设置
    setupStatusBar() {
        if (window.StatusBar) {
            StatusBar.styleDefault();
            StatusBar.backgroundColorByHexString('#87CEEB');
        }
    }

    // 返回按钮处理
    setupBackButton() {
        document.addEventListener('backbutton', (e) => {
            e.preventDefault();
            this.handleBackButton();
        }, false);
    }

    handleBackButton() {
        // 检查当前显示的界面
        if (document.getElementById('alarm-screen').classList.contains('active')) {
            // 闹钟界面不允许返回
            return false;
        } else if (document.getElementById('add-screen').classList.contains('active')) {
            showMainScreen();
        } else if (document.getElementById('calendar-screen').classList.contains('active')) {
            showMainScreen();
        } else {
            // 主界面，询问是否退出
            navigator.notification.confirm(
                '确定要退出应用吗？',
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        navigator.app.exitApp();
                    }
                },
                '退出应用',
                ['确定', '取消']
            );
        }
    }

    // 本地通知设置
    setupNotifications() {
        if (!window.cordova || !cordova.plugins.notification) {
            console.log('本地通知插件不可用');
            return;
        }

        // 请求通知权限
        cordova.plugins.notification.local.requestPermission((granted) => {
            console.log('通知权限:', granted ? '已授权' : '被拒绝');
        });
    }

    // Web通知设置
    setupWebNotifications() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }

    // 振动功能
    setupVibration() {
        // 振动功能将在闹钟触发时使用
    }

    // 后台模式
    setupBackgroundMode() {
        if (window.cordova && cordova.plugins.backgroundMode) {
            cordova.plugins.backgroundMode.enable();
            cordova.plugins.backgroundMode.setDefaults({
                title: '时光备忘录',
                text: '正在后台运行，确保及时提醒',
                icon: 'icon',
                color: '87CEEB',
                resume: true,
                hidden: false,
                bigText: false
            });
        }
    }

    // 调度本地通知
    scheduleNotification(memo) {
        const notificationTime = new Date(`${memo.date} ${memo.time}`);
        
        if (window.cordova && cordova.plugins.notification) {
            const notification = {
                id: memo.id,
                title: '时光备忘录提醒',
                text: memo.title,
                trigger: { at: notificationTime },
                led: 'FF0000',
                sound: 'file://assets/sounds/alarm.mp3',
                vibrate: true,
                wakeup: true,
                foreground: true,
                priority: 2,
                data: { memoId: memo.id }
            };

            cordova.plugins.notification.local.schedule(notification);
            console.log('已调度通知:', memo.title, '时间:', notificationTime);
        } else if ('Notification' in window && Notification.permission === 'granted') {
            // Web通知作为备选
            const timeUntilNotification = notificationTime.getTime() - Date.now();
            if (timeUntilNotification > 0) {
                setTimeout(() => {
                    new Notification('时光备忘录提醒', {
                        body: memo.title,
                        icon: 'res/icon/android/mdpi.png',
                        tag: memo.id.toString()
                    });
                }, timeUntilNotification);
            }
        }
    }

    // 取消通知
    cancelNotification(memoId) {
        if (window.cordova && cordova.plugins.notification) {
            cordova.plugins.notification.local.cancel(memoId);
        }
    }

    // 振动提醒
    vibrate(pattern = [1000, 500, 1000]) {
        if (window.navigator && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    // 检查是否为移动设备
    isMobile() {
        return window.cordova || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 获取设备信息
    getDeviceInfo() {
        if (window.device) {
            return {
                platform: device.platform,
                version: device.version,
                model: device.model,
                manufacturer: device.manufacturer
            };
        }
        return null;
    }

    // 应用生命周期事件
    setupLifecycleEvents() {
        document.addEventListener('pause', () => {
            console.log('应用进入后台');
        }, false);

        document.addEventListener('resume', () => {
            console.log('应用恢复前台');
            // 检查是否有过期的闹钟
            checkAlarms();
        }, false);
    }
}

// 创建全局实例
const cordovaEnhancer = new CordovaEnhancer();

// 扩展原有的闹钟功能
const originalSetAlarm = window.setAlarm;
window.setAlarm = function(memo) {
    // 调用原始函数
    if (originalSetAlarm) {
        originalSetAlarm(memo);
    }
    
    // 添加移动端通知
    cordovaEnhancer.scheduleNotification(memo);
};

// 扩展原有的删除功能
const originalDeleteMemo = window.deleteMemo;
window.deleteMemo = function(id) {
    // 取消通知
    cordovaEnhancer.cancelNotification(id);
    
    // 调用原始函数
    if (originalDeleteMemo) {
        originalDeleteMemo(id);
    }
};

// 扩展闹钟提醒功能
const originalShowAlarmScreen = window.showAlarmScreen;
window.showAlarmScreen = function(memo) {
    // 振动提醒
    cordovaEnhancer.vibrate([500, 200, 500, 200, 500]);
    
    // 调用原始函数
    if (originalShowAlarmScreen) {
        originalShowAlarmScreen(memo);
    }
};

// 导出给全局使用
window.cordovaEnhancer = cordovaEnhancer;
