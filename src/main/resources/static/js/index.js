// 全局变量：记录当前删除的实体信息
let currentEntityType = null;
let currentId = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {

    // 动态加载导航栏、页脚和模态框
    loadSharedComponents();
    // 初始化共用事件
    initSharedEvents();
});
// 在index.js中添加以下代码
document.addEventListener('DOMContentLoaded', () => {
    // 其他初始化代码...

    // 启动环形滚动
    startTicker();
});

function startTicker() {
    const ticker = document.getElementById('ticker-content');
    if (ticker) {
        // 确保有足够的内容用于无缝滚动
        const originalContent = ticker.innerHTML;
        ticker.innerHTML = originalContent + originalContent; // 复制一份用于无缝衔接

        // 添加动画类
        ticker.classList.add('animate-ticker');
    }
}

// 加载共用组件（导航栏、页脚、删除模态框）
function loadSharedComponents() {
    // 1. 加载导航栏
    const navbarHtml = `
        <nav class="bg-white/50 shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <button id="homeBtn" class="flex-shrink-0 flex items-center focus:outline-none hover:text-primary transition-colors">
                            <i class="fa fa-graduation-cap text-primary text-2xl mr-2"></i>
                            <span class="font-bold text-xl">学生教师管理系统</span>
                        </button>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button id="classesTab" class="px-4 py-2 text-gray-500 font-medium hover:text-info">
                            <i class="fa fa-building mr-1"></i> 班级管理
                        </button>
                        <button id="studentsTab" class="px-4 py-2 text-primary font-medium border-b-2 border-primary">
                            <i class="fa fa-users mr-1"></i> 学生管理
                        </button>
                        <button id="teachersTab" class="px-4 py-2 text-gray-500 font-medium hover:text-secondary">
                            <i class="fa fa-briefcase mr-1"></i> 教师管理
                        </button>
                        <button id="logoutBtn" class="px-4 py-2 text-danger font-medium hover:text-danger/90">
                            <i class="fa fa-sign-out mr-1"></i> 退出登录
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navbarHtml);

    // 2. 加载页脚
    const footerHtml = `
        <footer class="bg-gray-800 text-white py-6">
            <div class="container mx-auto px-4">
                <div class="text-center">
                    <p>© 2025 学生教师管理系统 | 版权所有</p>
                </div>
            </div>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHtml);

    // 3. 加载确认删除模态框（核心：解决null错误的关键）
    const deleteModalHtml = `
        <div id="confirmDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white/70 rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div class="bg-danger p-4 rounded-t-lg">
                    <h3 class="text-white text-lg font-bold flex items-center">
                        <i class="fa fa-trash mr-2"></i> 确认删除
                    </h3>
                </div>
                <div class="p-6">
                    <p id="deleteMessage" class="text-gray-700 mb-6">确认删除？</p>
                    <div class="flex justify-end space-x-4">
                        <button type="button" id="cancelDelete" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">取消</button>
                        <button type="button" id="confirmDelete" class="px-4 py-2 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors">确认删除</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', deleteModalHtml);

    // 4. 加载通知组件
    const notificationHtml = `
        <div id="notification" class="fixed top-4 right-4 z-50 max-w-sm rounded-lg shadow-lg p-4 transform transition-all duration-300 translate-y-[-200%] opacity-0">
            <div class="flex items-center">
                <div id="notificationIcon" class="flex-shrink-0 mr-3 text-xl"></div>
                <div>
                    <h3 id="notificationTitle" class="font-bold text-sm"></h3>
                    <p id="notificationMessage" class="text-sm mt-1"></p>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', notificationHtml);

    // 导航栏渲染后立即绑定首页按钮事件
    document.getElementById('homeBtn')?.addEventListener('click', () => {
        console.log('跳转到首页');
        window.location.href = 'index.html';
    });
}


// 初始化共用事件
function initSharedEvents() {
    initHomeButton(); // 添加首页按钮事件
    initTabs();       // 导航栏选项卡切换
    initDeleteModal();// 删除模态框事件
    initLogout();     // 退出登录
}

// 初始化首页按钮
function initHomeButton() {
    document.getElementById('homeBtn')?.addEventListener('click', () => {
        console.log('跳转到首页');
        window.location.href = 'index.html';
    });
}

// 导航栏选项卡切换
function initTabs() {
    // 班级管理
    document.getElementById('classesTab')?.addEventListener('click', () => {
        setActiveTab('classesTab', 'info');
        window.location.href = 'class.html';
    });

    // 学生管理
    document.getElementById('studentsTab')?.addEventListener('click', () => {
        setActiveTab('studentsTab', 'primary');
        window.location.href = 'student.html';
    });

    // 教师管理
    document.getElementById('teachersTab')?.addEventListener('click', () => {
        setActiveTab('teachersTab', 'secondary');
        window.location.href = 'teacher.html';
    });

    // 根据当前URL激活选项卡（核心修改：排除index.html页面）
    const currentPath = window.location.pathname.toLowerCase();
    // 如果是index.html页面，不选中任何选项卡
    if (currentPath.includes('index')) {
        ['classesTab', 'studentsTab', 'teachersTab'].forEach(id => {
            const tab = document.getElementById(id);
            if (tab) {
                tab.classList.remove('text-info', 'text-primary', 'text-secondary', 'border-b-2', 'border-info', 'border-primary', 'border-secondary');
                tab.classList.add('text-gray-500');
            }
        });
        return; // 直接返回，不执行任何选中逻辑
    }
    // 其他页面正常判断选中状态
    else if (currentPath.includes('class')) {
        setActiveTab('classesTab', 'info');
    }  else if (currentPath.includes('teacher')) {
        setActiveTab('teachersTab', 'secondary');
    }else if (currentPath.includes('student')) {
        setActiveTab('studentsTab', 'primary');
    }else {
        // 添加默认处理，比如选中首页或清空状态
        setActiveTab('homeTab', 'default');
    }
}

// 设置选项卡激活状态
function setActiveTab(tabId, color) {
    ['classesTab', 'studentsTab', 'teachersTab'].forEach(id => {
        const tab = document.getElementById(id);
        if (tab) {
            tab.classList.remove('text-info', 'text-primary', 'text-secondary', 'border-b-2', 'border-info', 'border-primary', 'border-secondary');
            tab.classList.add('text-gray-500');
        }
    });
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add(`text-${color}`, 'border-b-2', `border-${color}`);
        activeTab.classList.remove('text-gray-500');
    }
}

// 初始化删除模态框事件（核心：共用删除逻辑）
function initDeleteModal() {
    // 取消删除
    document.getElementById('cancelDelete')?.addEventListener('click', () => {
        document.getElementById('confirmDeleteModal').classList.add('hidden');
        resetCurrentEntity();
    });

    // 确认删除（调用对应模块的删除函数）
    document.getElementById('confirmDelete')?.addEventListener('click', () => {
        console.log('[点击确认删除] 类型:', currentEntityType, 'ID:', currentId);

        if (!currentEntityType || !currentId) {
            console.error('确认删除时参数缺失');
            window.showNotification('error', '操作失败', '删除参数丢失');
            return;
        }

        // 在调用删除函数前，先捕获当前ID
        const entityId = currentId;

        // 根据实体类型调用对应删除函数，并传递ID
        if (currentEntityType === 'teacher') {
            window.deleteTeacher?.(entityId);
        } else if (currentEntityType === 'student') {
            window.deleteStudent?.(entityId);
        } else if (currentEntityType === 'class') {
            window.deleteClass?.(entityId);
        }

        // 隐藏模态框并重置
        document.getElementById('confirmDeleteModal').classList.add('hidden');
        resetCurrentEntity();
    });
}

// 全局共用：显示确认删除模态框
window.confirmDelete = function (entityType, id, name) {
    console.log('[确认删除] 类型:', entityType, 'ID:', id, '名称:', name);

    // 验证参数
    if (!entityType || !id || !name) {
        console.error('confirmDelete 参数缺失:', {entityType, id, name});
        window.showNotification('error', '操作失败', '删除参数不完整');
        return;
    }

    currentEntityType = entityType;
    currentId = id;

    // 设置删除提示文本
    const entityNameMap = {'teacher': '教师', 'student': '学生', 'class': '班级'};
    const entityName = entityNameMap[entityType] || '记录';
    document.getElementById('deleteMessage').textContent = `你确定要删除${entityName}"${name}"吗？此操作不可撤销。`;

    // 显示模态框
    document.getElementById('confirmDeleteModal').classList.remove('hidden');
};

// 全局共用：显示通知
window.showNotification = function (type, title, message) {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notificationIcon');
    const titleEl = document.getElementById('notificationTitle');
    const msgEl = document.getElementById('notificationMessage');

    // 设置样式
    const styles = {
        success: {icon: 'fa-check-circle', bg: 'bg-green-50 text-green-700 border-l-4 border-green-400'},
        error: {icon: 'fa-exclamation-circle', bg: 'bg-red-50 text-red-700 border-l-4 border-red-400'},
        warning: {icon: 'fa-exclamation-triangle', bg: 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-400'}
    };
    notification.className = `fixed top-4 right-4 z-50 max-w-sm rounded-lg shadow-lg p-4 ${styles[type].bg} transform transition-all duration-300`;
    icon.innerHTML = `<i class="fa ${styles[type].icon}"></i>`;

    // 设置内容
    titleEl.textContent = title;
    msgEl.textContent = message;

    // 显示通知
    notification.classList.remove('translate-y-[-200%]', 'opacity-0');
    // 3秒后隐藏
    setTimeout(() => {
        notification.classList.add('translate-y-[-200%]', 'opacity-0');
    }, 3000);
};

// 重置当前实体信息
function resetCurrentEntity() {
    currentEntityType = null;
    currentId = null;
}

// 初始化退出登录
function initLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        if (confirm('确定退出登录吗？')) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        }
    });
}