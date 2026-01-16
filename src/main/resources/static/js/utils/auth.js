// ==================== 认证工具 ====================

// 自动登出全局变量（分开存储两个计时器，避免覆盖）
let totalTimeoutTimer = null; // 总超时计时器（5分钟后登出）
let countdownTriggerTimer = null; // 倒计时触发计时器（提前30秒提示）
let countdownTimer = null; // 倒计时显示计时器
let warningElement = null; // 提示元素
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 总超时5分钟
const WARN_BEFORE_LOGOUT = 30 * 1000; // 提前30秒提示

/**
 * 登录验证函数
 * @param {string} login - 页面名称
 */
export function login0(login) {
	const isLoggedIn = localStorage.getItem("isLoggedIn");
	if (!isLoggedIn || isLoggedIn !== "true") {
		alert("请先登录后再访问" + login + "管理页面！");
		window.location.href = "login.html";
	}
}

/**
 * 初始化自动登出功能
 */
export function initAutoLogout() {
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
 * 核心修复：用户操作时，完全重置所有计时器（总超时重新从5分钟开始）
 */
export function resetAllTimers() {
	// 1. 立即销毁所有旧计时器和提示
	destroyAll();

	// 2. 页面在后台不计时
	if (document.hidden) return;

	// 3. 重新设置总超时计时器（5分钟后登出，用户操作后从0开始算5分钟）
	totalTimeoutTimer = setTimeout(() => {
		forceLogout("无操作超时，已自动登出");
	}, INACTIVITY_TIMEOUT);

	// 4. 重新设置倒计时触发计时器（4分30秒后显示提示，基于新的总超时）
	countdownTriggerTimer = setTimeout(() => {
		createCountdown();
	}, INACTIVITY_TIMEOUT - WARN_BEFORE_LOGOUT);
}

/**
 * 创建倒计时提示（从30秒递减）
 */
export function createCountdown() {
	// 确保没有旧提示
	if (warningElement) destroyAll();

	// 创建提示元素（带唯一ID）
	warningElement = document.createElement("div");
	warningElement.id = "auto-logout-warning";
	warningElement.className = 
		"fixed top-4 right-4 bg-warning text-white px-4 py-2 rounded shadow-lg z-50";
	document.body.appendChild(warningElement);

	// 倒计时初始值（30秒）
	let remainingSeconds = WARN_BEFORE_LOGOUT / 1000; // 30

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
 * 更新倒计时文本
 */
export function updateCountdownText(remaining) {
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
export function destroyAll() {
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
 * @param {string} msg - 登出提示消息
 */
export function forceLogout(msg = "已退出登录") {
	destroyAll();
	localStorage.removeItem("isLoggedIn");
	localStorage.removeItem("token");
	localStorage.removeItem("uid");
	window.location.href = "login.html";
}

/**
 * 刷新Token
 */
export function refreshToken() {
	const token = localStorage.getItem("token");
	if (!token) return;
	fetch("/api/refresh-token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	}).catch(() => forceLogout("会话已过期，请重新登录"));
}