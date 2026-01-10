tailwind.config = {
	theme: {
		extend: {
			colors: {
				primary: "#3B82F6",
				secondary: "#10B981",
				danger: "#EF4444",
				warning: "#F59E0B",
				info: "#6366F1",
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
			},
		},
	},
};

// 自动登出全局变量（分开存储两个计时器，避免覆盖）
let totalTimeoutTimer = null; // 总超时计时器（10秒后登出）
let countdownTriggerTimer = null; // 倒计时触发计时器（5秒后显示提示）
let countdownTimer = null; // 倒计时显示计时器
let warningElement = null; // 提示元素
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 总超时10秒
const WARN_BEFORE_LOGOUT = 30 * 1000; // 提前5秒提示

function login0(login) {
	const isLoggedIn = localStorage.getItem("isLoggedIn");
	if (!isLoggedIn || isLoggedIn !== "true") {
		alert("请先登录后再访问" + login + "管理页面！");
		window.location.href = "login.html";
	}
}

/**
 * 初始化自动登出
 */
function initAutoLogout() {
	resetAllTimers(); // 初始启动计时

	// 监听所有用户交互（操作即重置）
	[
		"mousemove",
		"keydown",
		"click",
		"scroll",
		"touchstart",
		"visibilitychange",
	].forEach((event) => window.addEventListener(event, resetAllTimers));

	// 页面关闭前彻底清理
	window.addEventListener("beforeunload", destroyAll);
}

/**
 * 核心修复：用户操作时，完全重置所有计时器（总超时重新从10秒开始）
 */
function resetAllTimers() {
	// 1. 立即销毁所有旧计时器和提示
	destroyAll();

	// 2. 页面在后台不计时
	if (document.hidden) return;

	// 3. 重新设置总超时计时器（10秒后登出，用户操作后从0开始算10秒）
	totalTimeoutTimer = setTimeout(() => {
		forceLogout("无操作超时，已自动登出");
	}, INACTIVITY_TIMEOUT);

	// 4. 重新设置倒计时触发计时器（5秒后显示提示，基于新的总超时）
	countdownTriggerTimer = setTimeout(() => {
		createCountdown();
	}, INACTIVITY_TIMEOUT - WARN_BEFORE_LOGOUT);
}

/**
 * 创建倒计时提示（从5秒递减）
 */
function createCountdown() {
	// 确保没有旧提示
	if (warningElement) destroyAll();

	// 创建提示元素（带唯一ID）
	warningElement = document.createElement("div");
	warningElement.id = "auto-logout-warning";
	warningElement.className =
		"fixed top-4 right-4 bg-warning text-white px-4 py-2 rounded shadow-lg z-50";
	document.body.appendChild(warningElement);

	// 倒计时初始值（5秒）
	let remainingSeconds = WARN_BEFORE_LOGOUT / 1000; // 5

	// 立即更新一次显示
	updateCountdownText(remainingSeconds);

	// 每秒更新倒计时
	countdownTimer = setInterval(() => {
		remainingSeconds--;
		updateCountdownText(remainingSeconds);

		// 倒计时结束（0秒），清除计时器
		if (remainingSeconds <= 0) {
			clearInterval(countdownTimer);
		}
	}, 1000);
}

/**
 * 更新倒计时文本1
 */
function updateCountdownText(remaining) {
	// 确保元素存在
	if (!warningElement || !document.body.contains(warningElement)) return;

	// 显示当前剩余秒数
	warningElement.innerHTML = `
        <div class="flex items-center">
            <i class="fa fa-exclamation-circle mr-2"></i>
            <span>${remaining} 秒后自动登出...</span>
        </div>
    `;
}

/**
 * 销毁所有计时器和提示（确保总超时计时器也被清除）
 */
function destroyAll() {
	// 清除总超时计时器（关键：用户操作后必须清除旧的总计时）
	if (totalTimeoutTimer) {
		clearTimeout(totalTimeoutTimer);
		totalTimeoutTimer = null;
	}
	// 清除倒计时触发计时器
	if (countdownTriggerTimer) {
		clearTimeout(countdownTriggerTimer);
		countdownTriggerTimer = null;
	}
	// 清除倒计时显示计时器
	if (countdownTimer) {
		clearInterval(countdownTimer);
		countdownTimer = null;
	}

	// 删除提示元素
	const oldWarning = document.getElementById("auto-logout-warning");
	if (oldWarning && document.body.contains(oldWarning)) {
		document.body.removeChild(oldWarning);
	}
	warningElement = null;
}

/**
 * 强制登出
 */
function forceLogout(msg = "已退出登录") {
	destroyAll();
	localStorage.removeItem("isLoggedIn");
	localStorage.removeItem("userToken");
	window.location.href = "login.html";
}

/**
 * 刷新Token
 */
function refreshToken() {
	const token = localStorage.getItem("userToken");
	if (!token) return;
	fetch("/api/refresh-token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	}).catch(() => forceLogout("会话已过期，请重新登录"));
}

// 新增：初始化班级下拉框（通用逻辑）
function initClassDropdown(inputId, dropdownId) {
	const classInput = document.getElementById(inputId);
	const classDropdown = document.getElementById(dropdownId);
	if (!classInput || !classDropdown) return; // 防止DOM元素不存在

	// 点击输入框显示下拉框
	classInput.addEventListener("click", (e) => {
		e.stopPropagation();
		const classDropdown = document.getElementById(dropdownId);
		if (!classDropdown.classList.contains("hidden")) return; // 已显示则不重复渲染
		const currentVal = classInput.value.trim().toLowerCase();
		filterAndShowClasses(currentVal, inputId, dropdownId);
	});

	// 输入时实时筛选班级
	classInput.addEventListener("input", (e) => {
		const searchVal = e.target.value.trim().toLowerCase();
		filterAndShowClasses(searchVal, inputId, dropdownId);
	});

	// 初始化时如果班级数据为空，显示加载中
	if (originalClasses.length === 0) {
		classDropdown.innerHTML = `
            <div class="px-4 py-2 text-gray-500 text-sm">
                <i class="fa fa-spinner fa-spin mr-2"></i>班级数据加载中...
            </div>
        `;
	}

	// 外部点击关闭下拉框
	document.addEventListener("click", (e) => {
		const isClickInside =
			classInput.contains(e.target) || classDropdown.contains(e.target);
		if (!isClickInside) {
			classDropdown.classList.add("hidden");
		}
	});

	// 选择下拉项：填充班级名称
	classDropdown.addEventListener("click", (e) => {
		const classItem = e.target.closest(".class-item");
		if (classItem) {
			const className = classItem.dataset.name;
			classInput.value = className; // 输入框显示班级名称
			classDropdown.classList.add("hidden");
		}
	});

	classInput.addEventListener("focus", () => {
		const currentVal = classInput.value.trim().toLowerCase();
		filterAndShowClasses(currentVal, inputId, dropdownId);
		// 新增：主动触发输入框的聚焦状态（确保光标显示）
		classInput.select(); // 可选：选中现有内容，增强交互
	});
}
//
//
// // 渲染教师分页控件
// function renderTeacherPagination() {
// 	const paginationContainer = document.getElementById("teacherPaginationContainer");
// 	if (!paginationContainer) return;
//
// 	let html = `
//         <div class="flex items-center justify-between px-4 py-3 sm:px-6">
//             <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                     <p class="text-sm text-gray-700">
//                         显示第 <span class="font-medium">${currentTeacherPage + 1}</span> 页，
//                         共 <span class="font-medium">${totalTeacherPages}</span> 页，
//                         总计 <span class="font-medium">${totalTeacherItems}</span> 条记录
//                     </p>
//                 </div>
//             <div>
//                     <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//     `;
//
// 	// 上一页按钮
// 	html += `
//         <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                 onclick="changeTeacherPage(${currentTeacherPage - 1})" ${currentTeacherPage === 0 ? 'disabled' : ''}>
//             <span class="sr-only">上一页</span>
//             <i class="fa fa-chevron-left"></i>
//         </button>
//     `;
//
// 	// 页码按钮（简化版，只显示当前页前后各2页）
// 	for (let i = Math.max(0, currentTeacherPage - 2); i < Math.min(totalTeacherPages, currentTeacherPage + 3); i++) {
// 		html += `
//             <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
// 			i === currentTeacherPage ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
// 		}" onclick="changeTeacherPage(${i})">
//                 ${i + 1}
//             </button>
//         `;
// 	}
//
// 	// 下一页按钮
// 	html += `
//         <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                 onclick="changeTeacherPage(${currentTeacherPage + 1})" ${currentTeacherPage >= totalTeacherPages - 1 ? 'disabled' : ''}>
//             <span class="sr-only">下一页</span>
//             <i class="fa fa-chevron-right"></i>
//         </button>
//     `;
//
// 	html += `
//                     </nav>
//                 </div>
//             </div>
//         </div>
//     `;
//
// 	paginationContainer.innerHTML = html;
// }
//
// // 切换教师页码
// function changeTeacherPage(page) {
// 	if (page >= 0 && page < totalTeacherPages) {
// 		currentTeacherPage = page;
// 		loadTeachers();
// 	}
// }
//
//
//
//
// // 绑定教师搜索事件
// function bindSearchEvent(name) {
// 	document.getElementById(`${name}+"Search"`)?.addEventListener("input", () => {
// 		currentTeacherPage = 0; // 搜索时重置到第一页
// 		loadTeachers();
// 	});
// }
