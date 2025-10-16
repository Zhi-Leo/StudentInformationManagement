tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',    // 蓝色（学生管理）
                secondary: '#10B981',  // 绿色（教师管理）
                danger: '#EF4444',     // 红色（删除/危险）
                warning: '#F59E0B',    // 黄色（编辑）
                info: '#6366F1'        // 靛蓝色（班级管理）
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        }

    }

}

// 自动登出相关全局变量
let inactivityTimer = null; // 无操作计时器
const INACTIVITY_TIMEOUT = 50 * 60 * 1000; // 5分钟（单位：毫秒）
const WARN_BEFORE_LOGOUT = 30 * 1000; // 登出前30秒提示（可选，提升用户体验）


function login0(login){
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        alert('请先登录后再访问'+login+'管理页面！');
        window.location.href = 'login.html';

    }
}
/**
 * 初始化无操作自动登出
 */
function initAutoLogout() {
    // 1. 启动计时器
    resetInactivityTimer();

    // 2. 监听用户交互事件（有操作则重置计时器）
    const interactionEvents = [
        'mousemove', 'keydown', 'click', 'scroll', 'touchstart',
        'visibilitychange' // 监听页面是否在前台（避免后台运行误触发）
    ];
    interactionEvents.forEach(event => {
        window.addEventListener(event, resetInactivityTimer);
    });

    // 3. 页面关闭/刷新前清除计时器（避免内存泄漏）
    window.addEventListener('beforeunload', () => {
        clearTimeout(inactivityTimer);
    });
}

/**
 * 重置无操作计时器
 */
function resetInactivityTimer() {
    // 清除现有计时器
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }

    // 页面在后台时，暂停计时（可选）
    if (document.hidden) {
        return;
    }

    // 启动新计时器：先提示，再登出
    inactivityTimer = setTimeout(() => {
        // 登出前30秒提示用户
        const confirmExtend = confirm(
            '您已5分钟未操作，即将自动登出。\n点击"确定"继续会话，"取消"立即登出。'
        );
        if (confirmExtend) {
            // 用户选择续期：重置计时器
            resetInactivityTimer();
            // （可选）调用后端接口刷新Token有效期（需后端配合）
            refreshToken();
        } else {
            // 立即登出
            forceLogout('无操作超时，已自动登出');
        }
    }, INACTIVITY_TIMEOUT - WARN_BEFORE_LOGOUT); // 提前30秒提示
}

/**
 * 强制登出（清除状态+跳转，全局复用）
 * @param {string} msg - 登出提示信息
 */
function forceLogout(msg = '已退出登录') {
    // 1. 清除登录状态
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userToken'); // 若后续用Token，需添加这行
    // 2. 清除计时器
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    // 3. 提示并跳转
    // alert(msg);
    window.location.href = 'login.html';
}

/**
 * （可选）刷新Token有效期（需后端配合）
 * 作用：用户续期时，同步延长后端Token的有效期
 */
function refreshToken() {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    fetch('/api/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).catch(error => {
        console.error('Token刷新失败:', error);
        // 刷新失败，直接登出
        forceLogout('会话已过期，请重新登录');
    });
}

