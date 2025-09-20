// 全局变量
let memos = JSON.parse(localStorage.getItem('memos')) || [];
let currentAlarmTimeout = null;
let currentTheme = localStorage.getItem('theme') || 'light';
let currentDate = new Date();
let selectedDate = null;
let filteredMemos = [];

// DOM 元素
const mainScreen = document.getElementById('main-screen');
const addScreen = document.getElementById('add-screen');
const alarmScreen = document.getElementById('alarm-screen');
const calendarScreen = document.getElementById('calendar-screen');
const memoList = document.getElementById('memo-list');
const emptyState = document.getElementById('empty-state');

// 按钮元素
const addMemoBtn = document.getElementById('add-memo-btn');
const saveMemoBtn = document.getElementById('save-memo-btn');
const backToMainBtns = document.querySelectorAll('.back-to-main, .close-btn');
const snoozeBtn = document.getElementById('snooze-btn');
const completeBtn = document.getElementById('complete-btn');
const themeToggle = document.getElementById('theme-toggle');
const calendarBtn = document.getElementById('calendar-btn');
const filterBtn = document.getElementById('filter-btn');

// 输入元素
const memoTitle = document.getElementById('memo-title');
const memoContent = document.getElementById('memo-content');
const memoTime = document.getElementById('memo-time');
const memoDate = document.getElementById('memo-date');
const memoPriority = document.getElementById('memo-priority');
const memoRepeat = document.getElementById('memo-repeat');

// 搜索和筛选元素
const searchInput = document.getElementById('search-input');
const filterPanel = document.getElementById('filter-panel');
const priorityFilter = document.getElementById('priority-filter');
const statusFilter = document.getElementById('status-filter');

// 日历元素
const currentMonthEl = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const todayBtn = document.getElementById('today-btn');
const calendarGrid = document.getElementById('calendar-grid');
const selectedDateMemos = document.getElementById('selected-date-memos');

// 闹钟元素
const alarmTitle = document.getElementById('alarm-title');
const alarmText = document.getElementById('alarm-text');
const alarmCurrentTime = document.getElementById('alarm-current-time');

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAlarms();

    // 每分钟检查一次闹钟
    setInterval(checkAlarms, 60000);
});

// 初始化应用
function initializeApp() {
    applyTheme();
    renderMemos();
    setDefaultDateTime();
    initializeCalendar();
    filteredMemos = [...memos];
}

// 初始化日历
function initializeCalendar() {
    currentDate = new Date();
    selectedDate = null;
}

// 设置事件监听器
function setupEventListeners() {
    // 添加备忘录按钮
    addMemoBtn.addEventListener('click', showAddScreen);

    // 保存备忘录按钮
    saveMemoBtn.addEventListener('click', saveMemo);

    // 返回主界面按钮
    backToMainBtns.forEach(btn => {
        btn.addEventListener('click', showMainScreen);
    });

    // 闹钟操作按钮
    snoozeBtn.addEventListener('click', snoozeAlarm);
    completeBtn.addEventListener('click', completeAlarm);

    // 主题切换按钮
    themeToggle.addEventListener('click', toggleTheme);

    // 日历视图按钮
    calendarBtn.addEventListener('click', showCalendarScreen);

    // 搜索功能
    searchInput.addEventListener('input', handleSearch);

    // 筛选功能
    filterBtn.addEventListener('click', toggleFilterPanel);
    priorityFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);

    // 日历导航
    prevMonthBtn.addEventListener('click', () => navigateMonth(-1));
    nextMonthBtn.addEventListener('click', () => navigateMonth(1));
    todayBtn.addEventListener('click', goToToday);

    // 底部导航按钮
    document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有active类
            document.querySelectorAll('.bottom-nav .nav-btn').forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            this.classList.add('active');
        });
    });
}

// 显示主界面
function showMainScreen() {
    mainScreen.classList.add('active');
    addScreen.classList.remove('active');
    calendarScreen.classList.remove('active');
    clearForm();
}

// 显示添加界面
function showAddScreen() {
    addScreen.classList.add('active');
    mainScreen.classList.remove('active');
    calendarScreen.classList.remove('active');
    setDefaultDateTime();
}

// 显示日历界面
function showCalendarScreen() {
    calendarScreen.classList.add('active');
    mainScreen.classList.remove('active');
    addScreen.classList.remove('active');
    renderCalendar();
}

// 主题切换
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

// 应用主题
function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// 显示闹钟界面
function showAlarmScreen(memo) {
    alarmTitle.textContent = memo.title;
    alarmText.textContent = memo.content;
    updateAlarmTime();
    alarmScreen.classList.add('active');
    
    // 每秒更新时间显示
    const timeInterval = setInterval(() => {
        if (alarmScreen.classList.contains('active')) {
            updateAlarmTime();
        } else {
            clearInterval(timeInterval);
        }
    }, 1000);
}

// 隐藏闹钟界面
function hideAlarmScreen() {
    alarmScreen.classList.remove('active');
}

// 更新闹钟时间显示
function updateAlarmTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    alarmCurrentTime.textContent = timeString;
}

// 设置默认日期时间
function setDefaultDateTime() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // 设置默认时间为当前时间后1小时
    const defaultTime = new Date(now.getTime() + 60 * 60 * 1000);
    memoTime.value = defaultTime.toTimeString().slice(0, 5);
    
    // 设置默认日期为明天
    memoDate.value = tomorrow.toISOString().slice(0, 10);
}

// 清空表单
function clearForm() {
    memoTitle.value = '';
    memoContent.value = '';
    memoPriority.value = 'medium';
    memoRepeat.value = 'none';
    setDefaultDateTime();
}

// 搜索功能
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    applyFilters(searchTerm);
}

// 切换筛选面板
function toggleFilterPanel() {
    filterPanel.classList.toggle('hidden');
}

// 应用筛选
function applyFilters(searchTerm = '') {
    const priorityValue = priorityFilter.value;
    const statusValue = statusFilter.value;
    const currentSearchTerm = searchTerm || searchInput.value.toLowerCase().trim();

    filteredMemos = memos.filter(memo => {
        // 搜索筛选
        const matchesSearch = !currentSearchTerm ||
            memo.title.toLowerCase().includes(currentSearchTerm) ||
            memo.content.toLowerCase().includes(currentSearchTerm);

        // 优先级筛选
        const matchesPriority = !priorityValue || memo.priority === priorityValue;

        // 状态筛选
        const matchesStatus = !statusValue ||
            (statusValue === 'completed' && memo.completed) ||
            (statusValue === 'pending' && !memo.completed);

        return matchesSearch && matchesPriority && matchesStatus;
    });

    renderMemos();
}

// 保存备忘录
function saveMemo() {
    const title = memoTitle.value.trim();
    const content = memoContent.value.trim();
    const time = memoTime.value;
    const date = memoDate.value;
    const priority = memoPriority.value;
    const repeat = memoRepeat.value;

    if (!title) {
        alert('请输入备忘录标题');
        return;
    }

    if (!time || !date) {
        alert('请选择提醒时间和日期');
        return;
    }

    const memo = {
        id: Date.now(),
        title,
        content,
        time,
        date,
        priority,
        repeat,
        completed: false,
        createdAt: new Date().toISOString()
    };

    memos.push(memo);
    saveMemos();
    filteredMemos = [...memos];
    renderMemos();
    showMainScreen();

    // 设置闹钟
    setAlarm(memo);

    // 如果是重复提醒，创建重复的备忘录
    if (repeat !== 'none') {
        createRepeatingMemos(memo);
    }
}

// 创建重复备忘录
function createRepeatingMemos(originalMemo) {
    const baseDate = new Date(`${originalMemo.date} ${originalMemo.time}`);
    const repeatCount = 10; // 创建未来10个重复提醒

    for (let i = 1; i <= repeatCount; i++) {
        const newDate = new Date(baseDate);

        switch (originalMemo.repeat) {
            case 'daily':
                newDate.setDate(baseDate.getDate() + i);
                break;
            case 'weekly':
                newDate.setDate(baseDate.getDate() + (i * 7));
                break;
            case 'monthly':
                newDate.setMonth(baseDate.getMonth() + i);
                break;
            case 'weekdays':
                let daysAdded = 0;
                let currentDate = new Date(baseDate);
                while (daysAdded < i) {
                    currentDate.setDate(currentDate.getDate() + 1);
                    if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
                        daysAdded++;
                    }
                }
                newDate.setTime(currentDate.getTime());
                break;
            case 'weekends':
                let weekendsAdded = 0;
                let currentWeekendDate = new Date(baseDate);
                while (weekendsAdded < i) {
                    currentWeekendDate.setDate(currentWeekendDate.getDate() + 1);
                    if (currentWeekendDate.getDay() === 0 || currentWeekendDate.getDay() === 6) {
                        weekendsAdded++;
                    }
                }
                newDate.setTime(currentWeekendDate.getTime());
                break;
        }

        const repeatMemo = {
            ...originalMemo,
            id: Date.now() + i,
            date: newDate.toISOString().slice(0, 10),
            time: originalMemo.time
        };

        memos.push(repeatMemo);
        setAlarm(repeatMemo);
    }

    saveMemos();
}

// 删除备忘录
function deleteMemo(id) {
    if (confirm('确定要删除这个备忘录吗？')) {
        memos = memos.filter(memo => memo.id !== id);
        filteredMemos = filteredMemos.filter(memo => memo.id !== id);
        saveMemos();
        renderMemos();
    }
}

// 渲染备忘录列表
function renderMemos() {
    const memosToRender = filteredMemos.length > 0 ? filteredMemos : memos;

    if (memosToRender.length === 0) {
        memoList.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    memoList.classList.remove('hidden');
    emptyState.classList.add('hidden');

    // 按日期时间排序
    const sortedMemos = memosToRender.sort((a, b) => {
        const dateTimeA = new Date(`${a.date} ${a.time}`);
        const dateTimeB = new Date(`${b.date} ${b.time}`);
        return dateTimeA - dateTimeB;
    });

    memoList.innerHTML = sortedMemos.map(memo => {
        const dateTime = new Date(`${memo.date} ${memo.time}`);
        const formattedDate = dateTime.toLocaleDateString('zh-CN');
        const formattedTime = dateTime.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const priorityText = {
            'high': '高',
            'medium': '中',
            'low': '低'
        };

        const repeatText = {
            'none': '',
            'daily': '每天',
            'weekly': '每周',
            'monthly': '每月',
            'weekdays': '工作日',
            'weekends': '周末'
        };

        return `
            <div class="memo-card priority-${memo.priority || 'medium'} ${memo.completed ? 'completed' : ''}">
                <button class="delete-btn" onclick="deleteMemo(${memo.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <div class="memo-card-header">
                    <div class="memo-card-title">${memo.title}</div>
                    <span class="priority-badge ${memo.priority || 'medium'}">${priorityText[memo.priority || 'medium']}</span>
                </div>
                <div class="memo-card-content">${memo.content}</div>
                <div class="memo-card-footer">
                    <div class="memo-card-time">
                        <i class="fas fa-clock"></i>
                        ${formattedDate} ${formattedTime}
                        ${memo.repeat && memo.repeat !== 'none' ? `<span class="memo-card-repeat">${repeatText[memo.repeat]}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 保存到本地存储
function saveMemos() {
    localStorage.setItem('memos', JSON.stringify(memos));
}

// 设置闹钟
function setAlarm(memo) {
    const alarmDateTime = new Date(`${memo.date} ${memo.time}`);
    const now = new Date();
    const timeDiff = alarmDateTime.getTime() - now.getTime();
    
    if (timeDiff > 0) {
        setTimeout(() => {
            if (!memo.completed) {
                showAlarmScreen(memo);
                playAlarmSound();
            }
        }, timeDiff);
    }
}

// 检查所有闹钟
function checkAlarms() {
    const now = new Date();
    const currentTime = now.getTime();
    
    memos.forEach(memo => {
        if (!memo.completed) {
            const alarmDateTime = new Date(`${memo.date} ${memo.time}`);
            const alarmTime = alarmDateTime.getTime();
            
            // 如果闹钟时间在当前时间的1分钟内，触发闹钟
            if (alarmTime <= currentTime && alarmTime > currentTime - 60000) {
                showAlarmScreen(memo);
                playAlarmSound();
            }
        }
    });
}

// 播放闹钟声音（使用Web Audio API）
function playAlarmSound() {
    try {
        // 检查浏览器支持
        const AudioContextClass = window.AudioContext || window['webkitAudioContext'];
        if (!AudioContextClass) {
            console.log('浏览器不支持Web Audio API');
            return;
        }

        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);

        // 重复播放3次
        setTimeout(() => playAlarmSound(), 600);
        setTimeout(() => playAlarmSound(), 1200);
    } catch (error) {
        console.log('无法播放闹钟声音:', error);
    }
}

// 稍后提醒（5分钟后）
function snoozeAlarm() {
    hideAlarmScreen();

    // 找到当前显示的备忘录并设置5分钟后提醒
    const currentMemo = memos.find(memo => memo.title === alarmTitle.textContent);
    if (currentMemo) {
        // 5分钟后再次提醒
        setTimeout(() => {
            if (!currentMemo.completed) {
                showAlarmScreen(currentMemo);
                playAlarmSound();
            }
        }, 5 * 60 * 1000);
    }
}

// 完成备忘录
function completeAlarm() {
    const currentMemo = memos.find(memo => memo.title === alarmTitle.textContent);
    if (currentMemo) {
        currentMemo.completed = true;
        saveMemos();
        renderMemos();
    }
    hideAlarmScreen();
}

// 初始化所有现有备忘录的闹钟
function initializeAlarms() {
    memos.forEach(memo => {
        if (!memo.completed) {
            setAlarm(memo);
        }
    });
}

// 页面加载完成后初始化闹钟
window.addEventListener('load', initializeAlarms);

// 日历相关函数
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 更新月份标题
    currentMonthEl.textContent = `${year}年${month + 1}月`;

    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // 清空日历网格
    calendarGrid.innerHTML = '';

    // 添加上个月的日期
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevMonth.getDate() - i;
        const dayEl = createCalendarDay(day, true, new Date(year, month - 1, day));
        calendarGrid.appendChild(dayEl);
    }

    // 添加当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = createCalendarDay(day, false, new Date(year, month, day));
        calendarGrid.appendChild(dayEl);
    }

    // 添加下个月的日期
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6行 × 7列
    for (let day = 1; day <= remainingCells; day++) {
        const dayEl = createCalendarDay(day, true, new Date(year, month + 1, day));
        calendarGrid.appendChild(dayEl);
    }
}

function createCalendarDay(day, isOtherMonth, date) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';

    if (isOtherMonth) {
        dayEl.classList.add('other-month');
    }

    // 检查是否是今天
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        dayEl.classList.add('today');
    }

    // 检查是否是选中的日期
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        dayEl.classList.add('selected');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = day;
    dayEl.appendChild(dayNumber);

    // 添加备忘录点
    const dateStr = date.toISOString().slice(0, 10);
    const dayMemos = memos.filter(memo => memo.date === dateStr && !memo.completed);

    if (dayMemos.length > 0) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'calendar-day-dots';

        dayMemos.slice(0, 3).forEach(memo => {
            const dot = document.createElement('div');
            dot.className = `calendar-dot ${memo.priority || 'medium'}`;
            dotsContainer.appendChild(dot);
        });

        dayEl.appendChild(dotsContainer);
    }

    // 点击事件
    dayEl.addEventListener('click', () => {
        // 移除之前选中的日期
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // 选中当前日期
        dayEl.classList.add('selected');
        selectedDate = date;

        // 显示选中日期的备忘录
        showSelectedDateMemos(dateStr);
    });

    return dayEl;
}

function showSelectedDateMemos(dateStr) {
    const dayMemos = memos.filter(memo => memo.date === dateStr);

    if (dayMemos.length === 0) {
        selectedDateMemos.innerHTML = '<p class="no-memos">该日期没有备忘录</p>';
        return;
    }

    selectedDateMemos.innerHTML = dayMemos.map(memo => {
        const time = memo.time;
        const priorityText = {
            'high': '高',
            'medium': '中',
            'low': '低'
        };

        return `
            <div class="calendar-memo-item priority-${memo.priority || 'medium'}">
                <div class="calendar-memo-title">${memo.title}</div>
                <div class="calendar-memo-time">${time} | ${priorityText[memo.priority || 'medium']}优先级</div>
            </div>
        `;
    }).join('');
}

function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    selectedDate = new Date();
    renderCalendar();
    showSelectedDateMemos(selectedDate.toISOString().slice(0, 10));
}
