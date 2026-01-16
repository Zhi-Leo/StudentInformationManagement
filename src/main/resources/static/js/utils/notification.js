// ==================== 通知系统 ====================

/**
 * 通知类型枚举
 */
export const NOTIFICATION_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

/**
 * 显示通知
 * @param {string} message - 通知内容
 * @param {string} type - 通知类型：success, error, warning, info
 * @param {object} options - 可选配置
 * @param {number} options.duration - 自动关闭时间（毫秒），默认3000
 * @param {string} options.position - 位置：top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
 * @param {boolean} options.closable - 是否可手动关闭，默认true
 */
export function showNotification(message, type = NOTIFICATION_TYPE.INFO, options = {}) {
    // 默认配置
    const defaultOptions = {
        duration: 3000,
        position: 'top-right',
        closable: true
    };
    
    // 合并配置
    const config = { ...defaultOptions, ...options };
    
    // 创建通知元素
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification notification-${type} position-${config.position}`;
    
    // 设置通知内容
    let content = `<div class="notification-content">${message}</div>`;
    
    // 如果可关闭，添加关闭按钮
    if (config.closable) {
        content += '<button class="notification-close"><i class="fa fa-times"></i></button>';
    }
    
    notificationElement.innerHTML = content;
    
    // 添加到页面
    document.body.appendChild(notificationElement);
    
    // 触发动画
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 10);
    
    // 绑定关闭事件
    const closeButton = notificationElement.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            hideNotification(notificationElement);
        });
    }
    
    // 自动关闭
    if (config.duration > 0) {
        setTimeout(() => {
            hideNotification(notificationElement);
        }, config.duration);
    }
    
    return notificationElement;
}

/**
 * 隐藏通知
 * @param {HTMLElement} notificationElement - 通知元素
 */
export function hideNotification(notificationElement) {
    if (!notificationElement) return;
    
    notificationElement.classList.remove('show');
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (notificationElement.parentNode) {
            notificationElement.parentNode.removeChild(notificationElement);
        }
    }, 300);
}

/**
 * 显示成功通知
 * @param {string} message - 通知内容
 * @param {object} options - 可选配置
 */
export function showSuccess(message, options = {}) {
    return showNotification(message, NOTIFICATION_TYPE.SUCCESS, options);
}

/**
 * 显示错误通知
 * @param {string} message - 通知内容
 * @param {object} options - 可选配置
 */
export function showError(message, options = {}) {
    return showNotification(message, NOTIFICATION_TYPE.ERROR, { ...options, duration: 5000 });
}

/**
 * 显示警告通知
 * @param {string} message - 通知内容
 * @param {object} options - 可选配置
 */
export function showWarning(message, options = {}) {
    return showNotification(message, NOTIFICATION_TYPE.WARNING, { ...options, duration: 4000 });
}

/**
 * 显示信息通知
 * @param {string} message - 通知内容
 * @param {object} options - 可选配置
 */
export function showInfo(message, options = {}) {
    return showNotification(message, NOTIFICATION_TYPE.INFO, options);
}

/**
 * 替换原生alert函数（可选）
 */
export function replaceAlertWithNotification() {
    window.alert = function(message) {
        showNotification(message, NOTIFICATION_TYPE.INFO);
    };
    
    // 可以根据需要替换confirm和prompt
}

/**
 * 初始化通知系统
 */
export function initNotificationSystem() {
    // 添加通知系统的CSS样式到页面
    const notificationStyles = `
        /* 通知系统样式 */
        .notification {
            position: fixed;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 350px;
            word-wrap: break-word;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* 通知类型 */
        .notification-success {
            background-color: #10B981;
            border-left: 4px solid #059669;
        }
        
        .notification-error {
            background-color: #EF4444;
            border-left: 4px solid #DC2626;
        }
        
        .notification-warning {
            background-color: #F59E0B;
            border-left: 4px solid #D97706;
        }
        
        .notification-info {
            background-color: #6366F1;
            border-left: 4px solid #4F46E5;
        }
        
        /* 通知位置 */
        .notification.position-top-right {
            top: 20px;
            right: 20px;
        }
        
        .notification.position-top-left {
            top: 20px;
            left: 20px;
        }
        
        .notification.position-bottom-right {
            bottom: 20px;
            right: 20px;
        }
        
        .notification.position-bottom-left {
            bottom: 20px;
            left: 20px;
        }
        
        .notification.position-top-center {
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
        }
        
        .notification.position-top-center.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .notification.position-bottom-center {
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
        }
        
        .notification.position-bottom-center.show {
            transform: translateX(-50%) translateY(0);
        }
        
        /* 通知内容和关闭按钮 */
        .notification-content {
            display: inline-block;
            vertical-align: middle;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin-left: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            vertical-align: middle;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        /* 多个通知堆叠 */
        .notification + .notification {
            margin-top: 12px;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = notificationStyles;
    document.head.appendChild(styleSheet);
    
    console.log('通知系统已初始化');
}