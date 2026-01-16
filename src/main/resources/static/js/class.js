// 班级数据存储
let originalClasses = [];

// 分页参数
let currentClassPage = 0; // 当前页码（从0开始）
const classPageSize = 10; // 每页10条
let totalClassPages = 0; // 总页数
let totalClassItems = 0; // 总条数

// DOM加载完成后初始化
// 页面加载完成初始化（替换原DOMContentLoaded事件）
document.addEventListener('DOMContentLoaded', () => {
    // 第一步：登录状态校验（核心）
    login0("班级");
    // 登出
    initAutoLogout();

    initClassEvents(); // 初始化班级基础事件
    loadClasses(); // 加载班级数据
    loadTeachers(); // 加载教师数据（供下拉框使用）
    bindClassSearchEvent(); // 绑定搜索事件

    // 同时初始化「新增」和「编辑」的教师下拉框
    initTeacherDropdown('headTeacher', 'teacherDropdown', 'headTeacherId'); // 新增班级
    initTeacherDropdown('editHeadTeacher', 'editTeacherDropdown', 'editHeadTeacherId'); // 编辑班级
});

// 初始化班级相关事件
function initClassEvents() {
    // 添加班级按钮
    document.getElementById('addClassBtn')?.addEventListener('click', () => {
        document.getElementById('addClassModal').classList.remove('hidden');
        document.getElementById('addClassForm').reset();
    });

    // 关闭添加班级模态框
    document.getElementById('closeClassModal')?.addEventListener('click', () => {
        document.getElementById('addClassModal').classList.add('hidden');
    });

    // 取消添加班级
    document.getElementById('cancelAddClass')?.addEventListener('click', () => {
        document.getElementById('addClassModal').classList.add('hidden');
    });

    // 添加班级表单提交
    document.getElementById('addClassForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addClass();
    });

    // 关闭编辑班级模态框
    document.getElementById('closeEditClassModal')?.addEventListener('click', () => {
        document.getElementById('editClassModal').classList.add('hidden');
    });

    // 取消编辑班级
    document.getElementById('cancelEditClass')?.addEventListener('click', () => {
        document.getElementById('editClassModal').classList.add('hidden');
    });

    // 编辑班级表单提交
    document.getElementById('editClassForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        updateClass();
    });

    // 刷新按钮
    document.getElementById('refreshClasses')?.addEventListener('click', loadClasses);

    // 搜索班级
    document.getElementById('classSearch')?.addEventListener('input', filterClasses);

    // 表格行点击事件（编辑/删除）- 关键修改：增加headTeacherId传递
    document.getElementById('classesBody')?.addEventListener('click', (e) => {
        const target = e.target.closest('button, .fa-pencil, .fa-trash');
        if (!target) return;

        const row = target.closest('tr');
        const classId = row.cells[0].textContent;
        const className = row.cells[1].textContent;
        const headTeacher = row.cells[2].textContent; // 班主任姓名
        const number = row.cells[3].textContent;
        // 关键：从表格行的data属性获取班主任ID（需确保renderClasses时添加data-id）
        const headTeacherId = row.dataset.headTeacherId || '';

        if (target.classList.contains('fa-pencil') || target.textContent.includes('编辑')) {
            // 传递headTeacherId到编辑函数
            editClass(classId, className, headTeacher, number, headTeacherId);
        } else if (target.classList.contains('fa-trash') || target.textContent.includes('删除')) {
            window.confirmDelete('class', classId, className);
        }
    });
}

// 加载班级数据
function loadClasses() {
    const searchTerm = document.getElementById("classSearch")?.value.trim() || "";
    // 构造请求URL（带分页和搜索参数）
    const url = `/api/classes?page=${currentClassPage}&size=${classPageSize}` +
        (searchTerm ? `&className=${encodeURIComponent(searchTerm)}` : "");

    const token = localStorage.getItem('token');
    fetch(url, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error("班级数据加载失败");
            return response.json();
        })
        .then(apiResponse => {
            // 解析后端返回的ApiResponse对象
            const data = apiResponse?.data || {};
            // 解析分页数据
            const classes = data.content || []; // 当前页班级列表
            totalClassPages = data.totalPages || 0; // 总页数
            totalClassItems = data.totalElements || 0; // 总条数
            
            // 更新本地存储的原始班级数据
            originalClasses = classes;
            
            renderClasses(classes); // 渲染班级表格
            renderClassPagination(); // 渲染分页控件
        })
        .catch(error => {
            console.error("加载班级失败:", error);
            // 出错时确保originalClasses是数组
            originalClasses = [];
            renderClasses(originalClasses);
        });
}

// 渲染班级表格（添加data-headTeacherId存储ID）
function renderClasses(classes) {
    const classesBody = document.getElementById('classesBody');
    classesBody.innerHTML = '';

    if (classes.length === 0) {
        classesBody.innerHTML = `
            <tr class="text-center">
                <td colspan="5" class="px-6 py-12 text-gray-500">
                    <i class="fa fa-folder-open text-2xl mb-2"></i>
                    <p>暂无班级数据</p>
                </td>
            </tr>
        `;
        return;
    }

    classes.forEach(classInfo => {
        const row = document.createElement('tr');
        // 关键：添加data-headTeacherId存储班主任ID
        row.dataset.headTeacherId = classInfo.headTeacherId || '';
        row.className = 'hover:bg-gray-50 transition-colors duration-150';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${classInfo.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${classInfo.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${classInfo.headTeacher || '未设置'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${classInfo.studentCount ?? '未统计'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i class="fa fa-pencil"></i> 编辑
                </button>
                <button class="text-red-600 hover:text-red-900">
                    <i class="fa fa-trash"></i> 删除
                </button>
            </td>
        `;
        classesBody.appendChild(row);
    });
}


function renderClassPagination() {
    const paginationContainer = document.getElementById("classPaginationContainer");
    if (!paginationContainer) return;

    // 确保分页参数有默认值，避免显示undefined
    const safeTotalClassPages = totalClassPages || 0;
    const safeTotalClassItems = totalClassItems || 0;
    const safeCurrentClassPage = currentClassPage || 0;

    let html = `
        <div class="flex items-center justify-between px-4 py-3 sm:px-6">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700">
                        显示第 <span class="font-medium">${safeCurrentClassPage + 1}</span> 页，
                        共 <span class="font-medium">${safeTotalClassPages}</span> 页，
                        总计 <span class="font-medium">${safeTotalClassItems}</span> 条记录
                    </p>
                </div>
            <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
    `;

    // 上一页按钮
    html += `
        <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onclick="changeClassPage(${safeCurrentClassPage - 1})" ${safeCurrentClassPage === 0 ? 'disabled' : ''}>
            <span class="sr-only">上一页</span>
            <i class="fa fa-chevron-left"></i>
        </button>
    `;

    // 页码按钮（简化版，只显示当前页前后各2页）
    for (let i = Math.max(0, safeCurrentClassPage - 2); i < Math.min(safeTotalClassPages, safeCurrentClassPage + 3); i++) {
        html += `
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
            i === safeCurrentClassPage ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
        }" onclick="changeClassPage(${i})">
                ${i + 1}
            </button>
        `;
    }

    // 下一页按钮
    html += `
        <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onclick="changeClassPage(${safeCurrentClassPage + 1})" ${safeCurrentClassPage >= safeTotalClassPages - 1 ? 'disabled' : ''}>
            <span class="sr-only">下一页</span>
            <i class="fa fa-chevron-right"></i>
        </button>
    `;

    html += `
                    </nav>
                </div>
            </div>
        </div>
    `;

    paginationContainer.innerHTML = html;
}
// 切换班级页码
function changeClassPage(page) {
    // 确保使用安全的分页参数
    const safeTotalClassPages = totalClassPages || 0;
    if (page >= 0 && page < safeTotalClassPages) {
        currentClassPage = page;
        loadClasses();
    }
}

// 绑定班级搜索事件
function bindClassSearchEvent() {
    document.getElementById("classSearch")?.addEventListener("input", () => {
        currentClassPage = 0; // 搜索时重置到第一页
        loadClasses();
    });
}


// 过滤班级列表
function filterClasses() {
    const searchTerm = document.getElementById('classSearch').value.toLowerCase().trim();

    if (!searchTerm) {
        // 如果搜索框为空，显示原始列表
        renderClasses(originalClasses);
        return;
    }

    // 过滤班级列表
    const filteredClasses = originalClasses.filter(cls => {
        // 检查班级的任何字段是否包含搜索词
        return Object.values(cls).some(value =>
            value.toString().toLowerCase().includes(searchTerm)
        );
    });

    renderClasses(filteredClasses);
}



// 编辑班级（完善班主任数据回显）
function editClass(classId, className, headTeacherName, number, headTeacherId) {
    // 1. 填充班级基础信息
    document.getElementById('editClassIdDisplay').value = classId; // 显示ID（只读）
    document.getElementById('editClassId').value = classId; // 隐藏ID（提交用）
    document.getElementById('editClassName').value = className; // 班级名称
    document.getElementById('editClassNumber').value = number || ''; // 班级人数

    // 2. 填充班主任信息（关键：匹配教师ID）
    const editHeadTeacherInput = document.getElementById('editHeadTeacher'); // 编辑姓名输入框
    const editHeadTeacherIdInput = document.getElementById('editHeadTeacherId'); // 编辑隐藏ID

    // 确保teachers是数组
    if (!Array.isArray(teachers)) {
        teachers = [];
    }

    // 若班级已有班主任，匹配教师数据并填充
    if (headTeacherName && teachers.length > 0) {
        const matchedTeacher = teachers.find(teacher =>
            teacher.name === headTeacherName || teacher.id === headTeacherId
        );
        if (matchedTeacher) {
            editHeadTeacherInput.value = matchedTeacher.name; // 显示姓名
            editHeadTeacherIdInput.value = matchedTeacher.id; // 存储ID（用于提交）
        } else {
            // 若教师数据中无匹配（如教师已删除），显示原姓名但清空ID
            editHeadTeacherInput.value = headTeacherName;
            editHeadTeacherIdInput.value = '';
        }
    } else {
        // 无班主任时清空
        editHeadTeacherInput.value = '';
        editHeadTeacherIdInput.value = '';
    }

    // 3. 显示编辑模态框
    document.getElementById('editClassModal').classList.remove('hidden');
}


// 核心：删除班级
window.deleteClass = function (id) {
    console.log('[删除班级] ID:', id);

    if (!id) {
        window.showNotification('error', '错误', '未找到班级ID');
        return;
    }

    const classExists = originalClasses.some(cls => cls.id === id);
    if (!classExists) {
        window.showNotification('error', '错误', '该班级不存在');
        return;
    }

    const token = localStorage.getItem('token');
    fetch(`/api/classes/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || '删除失败，可能存在关联学生');
                });
            }
            originalClasses = originalClasses.filter(cls => cls.id !== id);
            renderClasses(originalClasses);
            renderClassPagination(); // 更新分页信息
            window.showNotification('success', '成功', '班级删除成功');

            // 调用更新所有班级学生数量的接口
            updateAllClassStudentCounts();
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
}

// 更新所有班级的学生数量
function updateAllClassStudentCounts() {
    const token = localStorage.getItem('token');
    fetch('/api/classes/updateAllStudentCounts', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error('更新所有班级人数失败');
            // 重新加载班级数据
            loadClasses();
        })
        .catch(error => {
            console.error('更新所有班级人数失败:', error);
            window.showNotification('error', '失败', '更新所有班级人数失败');
        });
}

// 全局存储教师列表（与教师管理模块共享时，可改为window.teachers）
let teachers = [];



// 初始化教师下拉框（通用版：支持新增/编辑模态框）
function initTeacherDropdown(inputId, dropdownId, hiddenId) {
    const headTeacherInput = document.getElementById(inputId); // 显示姓名的输入框
    const teacherDropdown = document.getElementById(dropdownId); // 下拉选项框
    const headTeacherIdInput = document.getElementById(hiddenId); // 存储教师ID的隐藏框

    // 1. 输入框点击：强制显示下拉（无论是否有值）
    headTeacherInput.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止冒泡（避免触发外部关闭）
        const currentValue = headTeacherInput.value.trim().toLowerCase();
        filterAndShowTeachers(currentValue, inputId, dropdownId, hiddenId); // 传参区分实例
    });

    // 2. 输入框变化：实时筛选+清空已选ID
    headTeacherInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        headTeacherIdInput.value = ''; // 输入变化视为重新选择
        filterAndShowTeachers(searchTerm, inputId, dropdownId, hiddenId);
    });

    // 3. 外部点击：关闭下拉（仅当点击区域不是输入框/下拉框时）
    document.addEventListener('click', (e) => {
        const isClickInside = headTeacherInput.contains(e.target) || teacherDropdown.contains(e.target);
        if (!isClickInside) {
            teacherDropdown.classList.add('hidden');
        }
    });

    // 4. 选择下拉项：更新输入框+隐藏ID
    teacherDropdown.addEventListener('click', (e) => {
        const teacherItem = e.target.closest('.teacher-item');
        if (teacherItem) {
            const teacherId = teacherItem.dataset.id;
            const teacherName = teacherItem.dataset.name;
            headTeacherInput.value = teacherName;
            headTeacherIdInput.value = teacherId;
            teacherDropdown.classList.add('hidden'); // 选择后关闭下拉
        }
    });

    // 5. 输入框获焦：显示下拉（增强交互）
    headTeacherInput.addEventListener('focus', () => {
        const currentValue = headTeacherInput.value.trim().toLowerCase();
        filterAndShowTeachers(currentValue, inputId, dropdownId, hiddenId);
    });
}

// 从数据库加载教师列表（后端返回分页数据，需要从content字段获取数组）
function loadTeachers() {
    // 请求所有教师数据（不分页）
    const token = localStorage.getItem('token');
    fetch('/api/teachers?page=0&size=100', {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            return response.json();
        })
        .then(apiResponse => {
            // 从ApiResponse中获取分页数据
            const data = apiResponse?.data || {};
            // 从分页响应中获取教师数组
            const teacherList = Array.isArray(data.content) ? data.content : [];
            // 确保teachers始终是数组
            teachers = teacherList;
            // 加载完成后，若输入框有值，可触发一次筛选（可选）
            const currentValue = document.getElementById('headTeacher').value.trim().toLowerCase();
            if (currentValue) {
                filterAndShowTeachers(currentValue, 'headTeacher', 'teacherDropdown', 'headTeacherId');
            }
        })
        .catch(error => {
            console.error('加载教师失败:', error);
            teachers = []; // 出错时确保teachers是数组
            window.showNotification('error', '错误', '教师列表加载失败，请刷新页面');
        });
}

// 筛选教师并显示下拉框（通用版：支持新增/编辑实例）
function filterAndShowTeachers(searchTerm, inputId, dropdownId, hiddenId) {
    const teacherDropdown = document.getElementById(dropdownId);
    const headTeacherIdInput = document.getElementById(hiddenId); // 当前实例的隐藏ID
    teacherDropdown.innerHTML = ''; // 清空旧选项

    // 确保teachers是数组，增强防御性
    if (!Array.isArray(teachers)) {
        teachers = [];
    }

    // 情况1：教师数据未加载或为空
    if (teachers.length === 0) {
        teacherDropdown.innerHTML = `
            <div class="px-4 py-2 text-gray-500 text-sm">
                <i class="fa fa-spinner fa-spin mr-2"></i>加载中...
            </div>
        `;
        teacherDropdown.classList.remove('hidden');
        return;
    }

    // 情况2：筛选教师（支持姓名/ID模糊匹配）
    const filteredTeachers = searchTerm
        ? teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm) ||
            teacher.id.toLowerCase().includes(searchTerm)
        )
        : teachers.slice(0, 10); // 无搜索词时显示前10条（避免下拉过长）

    // 情况3：无匹配结果
    if (filteredTeachers.length === 0) {
        teacherDropdown.innerHTML = `
            <div class="px-4 py-2 text-gray-500 text-sm">
                未找到匹配的教师
            </div>
        `;
        teacherDropdown.classList.remove('hidden');
        return;
    }

    // 情况4：生成下拉选项（高亮已选中的教师）
    filteredTeachers.forEach(teacher => {
        const item = document.createElement('div');
        // 若当前教师ID与隐藏框ID一致，添加高亮样式
        const isSelected = headTeacherIdInput.value === teacher.id;
        item.className = `teacher-item px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
            isSelected ? 'bg-indigo-50 text-indigo-600' : ''
        }`;
        item.dataset.id = teacher.id;
        item.dataset.name = teacher.name;
        item.innerHTML = `
            <div class="font-medium">${teacher.name}</div>
            <div class="text-xs text-gray-500">教师ID: ${teacher.id}</div>
        `;
        teacherDropdown.appendChild(item);
    });

    // 强制显示下拉框
    teacherDropdown.classList.remove('hidden');
}

// 添加班级（支持手动输入有效教师姓名）
function addClass() {
    const classId = document.getElementById('classId').value.trim();
    const className = document.getElementById('className').value.trim();
    const headTeacherInput = document.getElementById('headTeacher'); // 教师姓名输入框
    let headTeacherName = headTeacherInput.value.trim();
    const headTeacherIdInput = document.getElementById('headTeacherId'); // 隐藏ID字段
    let headTeacherId = headTeacherIdInput.value.trim();
    const classNumberInput = document.getElementById('classNumber').value.trim();
    const studentCount = classNumberInput ? parseInt(classNumberInput) : null;

    // 前端校验：1. 班级ID和名称必填
    if (!classId || !className) {
        window.showNotification('error', '错误', '班级ID和名称不能为空');
        return;
    }

    // 前端校验：2. 教师姓名非空时，自动匹配数据库教师
    if (headTeacherName) {
        const matchedTeacher = matchTeacherByInput(headTeacherName);
        if (matchedTeacher) {
            // 匹配成功：自动补全ID和标准姓名（避免输入错别字）
            headTeacherId = matchedTeacher.id;
            headTeacherName = matchedTeacher.name; // 统一姓名格式（如消除空格）
            headTeacherInput.value = matchedTeacher.name; // 同步更新输入框显示
            headTeacherIdInput.value = matchedTeacher.id; // 同步更新隐藏ID
        } else {
            // 匹配失败：提示用户姓名不存在
            window.showNotification('error', '错误', '输入的班主任姓名/ID不存在，请重新输入或从下拉框选择');
            headTeacherInput.focus(); // 聚焦到输入框，方便修改
            return;
        }
    } else {
        // 教师姓名为空：清空ID（允许不设置班主任）
        headTeacherId = '';
    }

    // 提交到后端（包含自动匹配的headTeacherId）
    const token = localStorage.getItem('token');
    fetch('/api/classes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
        body: JSON.stringify({
            id: classId,
            name: className,
            headTeacherId: headTeacherId, // 自动匹配或下拉选择的ID
            headTeacher: headTeacherName || '未设置', // 姓名（为空时显示“未设置”）
            studentCount: studentCount
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('添加失败，可能班级ID已存在');
            return response.json();
        })
        .then(data => {
            window.showNotification('success', '成功', '班级添加成功');
            originalClasses.unshift(data);
            renderClasses(originalClasses);
            renderClassPagination(); // 更新分页信息
            // 重置表单
            document.getElementById('addClassForm').reset();
            headTeacherIdInput.value = '';
            // 关闭模态框
            document.getElementById('addClassModal').classList.add('hidden');
            // 更新班级列表
            updateAllClassStudentCounts();
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
}

// 更新班级（支持手动输入有效教师姓名）
function updateClass() {
    const id = document.getElementById('editClassId').value;
    const name = document.getElementById('editClassName').value.trim();
    const headTeacherInput = document.getElementById('editHeadTeacher'); // 编辑页教师输入框
    let headTeacherName = headTeacherInput.value.trim();
    const headTeacherIdInput = document.getElementById('editHeadTeacherId'); // 编辑页隐藏ID
    let headTeacherId = headTeacherIdInput.value.trim();
    const classNumberInput = document.getElementById('editClassNumber').value.trim();
    const studentCount = classNumberInput ? parseInt(classNumberInput) : null;

    // 前端校验：1. 班级名称必填
    if (!name) {
        window.showNotification('error', '错误', '班级名称不能为空');
        return;
    }

    // 前端校验：2. 教师姓名非空时，自动匹配数据库教师
    if (headTeacherName) {
        const matchedTeacher = matchTeacherByInput(headTeacherName);
        if (matchedTeacher) {
            // 匹配成功：补全ID和标准姓名
            headTeacherId = matchedTeacher.id;
            headTeacherName = matchedTeacher.name;
            headTeacherInput.value = matchedTeacher.name;
            headTeacherIdInput.value = matchedTeacher.id;
        } else {
            // 匹配失败：提示错误
            window.showNotification('error', '错误', '输入的班主任姓名/ID不存在，请重新输入或从下拉框选择');
            headTeacherInput.focus();
            return;
        }
    } else {
        // 教师姓名为空：清空ID（允许取消设置班主任）
        headTeacherId = '';
    }

    // 提交到后端
    const token = localStorage.getItem('token');
    fetch(`/api/classes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
        body: JSON.stringify({
            id,
            name,
            headTeacher: headTeacherName || '未设置',
            headTeacherId: headTeacherId,
            studentCount
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('更新失败');
            return response.json();
        })
        .then(data => {
            window.showNotification('success', '成功', '班级更新成功');
            const index = originalClasses.findIndex(c => c.id === id);
            if (index !== -1) originalClasses[index] = data;
            renderClasses(originalClasses);
            renderClassPagination(); // 更新分页信息
            document.getElementById('editClassModal').classList.add('hidden');
            updateAllClassStudentCounts();
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
}


// 工具函数：根据输入内容（姓名/ID）匹配数据库中的教师
function matchTeacherByInput(inputValue) {
    // 确保teachers是数组
    if (!Array.isArray(teachers)) {
        teachers = [];
    }
    if (!inputValue || teachers.length === 0) return null; // 无输入或教师数据未加载
    const trimmedValue = inputValue.trim().toLowerCase();

    // 优先精确匹配（避免重名问题，若需模糊匹配可改为includes）
    const matchedTeacher = teachers.find(teacher =>
        teacher.name.toLowerCase() === trimmedValue || // 姓名精确匹配
        teacher.id.toLowerCase() === trimmedValue      // ID精确匹配
    );
    return matchedTeacher;
}