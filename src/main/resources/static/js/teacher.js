// 教师管理专用JS
let originalTeachers = [];
let originalClasses = []; // 新增：存储班级列表（供下拉框使用）

document.addEventListener('DOMContentLoaded', () => {
    initTeacherEvents();
    // 并行加载教师和班级数据
    Promise.all([loadTeachers(), loadClasses()]).then(() => {
        // 初始化班级下拉框（添加和编辑教师）
        initClassDropdown('teacherClass', 'addTeacherClassDropdown');
        initClassDropdown('editTeacherClass', 'editTeacherClassDropdown');
    });
});

// 新增：加载班级数据（从后端获取所有班级）
function loadClasses() {
    return fetch('/api/classes')
        .then(response => {
            if (!response.ok) throw new Error(`班级数据加载失败: ${response.status}`);
            return response.json();
        })
        .then(data => {
            originalClasses = data; // 存储班级数据（包含name字段）
            return data;
        })
        .catch(error => {
            console.error('加载班级数据失败:', error);
            window.showNotification('error', '错误', '班级列表加载失败，班级下拉功能不可用');
            return [];
        });
}

// 新增：初始化班级下拉框（通用逻辑）
function initClassDropdown(inputId, dropdownId) {
    const classInput = document.getElementById(inputId);
    const classDropdown = document.getElementById(dropdownId);
    if (!classInput || !classDropdown) return; // 防止DOM元素不存在

    // 点击输入框显示下拉框
    classInput.addEventListener('click', (e) => {
        e.stopPropagation();
        const classDropdown = document.getElementById(dropdownId);
        if (!classDropdown.classList.contains('hidden')) return; // 已显示则不重复渲染
        const currentVal = classInput.value.trim().toLowerCase();
        filterAndShowClasses(currentVal, inputId, dropdownId);
    });

    // 输入时实时筛选班级
    classInput.addEventListener('input', (e) => {
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
    document.addEventListener('click', (e) => {
        const isClickInside = classInput.contains(e.target) || classDropdown.contains(e.target);
        if (!isClickInside) {
            classDropdown.classList.add('hidden');
        }
    });

    // 选择下拉项：填充班级名称
    classDropdown.addEventListener('click', (e) => {
        const classItem = e.target.closest('.class-item');
        if (classItem) {
            const className = classItem.dataset.name;
            classInput.value = className; // 输入框显示班级名称
            classDropdown.classList.add('hidden');
        }
    });

    // 获焦时显示下拉框
    classInput.addEventListener('focus', () => {
        const currentVal = classInput.value.trim().toLowerCase();
        filterAndShowClasses(currentVal, inputId, dropdownId);
    });
}

// 新增：筛选班级并显示下拉选项
// 1. 修改班级筛选逻辑（支持ID和名称搜索）
function filterAndShowClasses(searchVal, inputId, dropdownId) {
    const classDropdown = document.getElementById(dropdownId);
    const classInput = document.getElementById(inputId);
    if (!classInput) return;

    classDropdown.innerHTML = '';

    if (originalClasses.length === 0) {
        classDropdown.innerHTML = `
            <div class="px-4 py-2 text-gray-500 text-sm">
                <i class="fa fa-spinner fa-spin mr-2"></i>班级数据加载中...
            </div>
        `;
        classDropdown.classList.remove('hidden');
        return;
    }

    // 关键修改：同时匹配班级ID和名称（toLowerCase()忽略大小写）
    const filteredClasses = searchVal
        ? originalClasses.filter(cls =>
            cls.id.toLowerCase().includes(searchVal) ||  // 匹配班级ID
            cls.name.toLowerCase().includes(searchVal)   // 匹配班级名称
        )
        : originalClasses.slice(0, 10);

    if (filteredClasses.length === 0) {
        classDropdown.innerHTML = `
            <div class="px-4 py-2 text-gray-500 text-sm">
                未找到匹配的班级
            </div>
        `;
        classDropdown.classList.remove('hidden');
        return;
    }

    // 下拉项显示"ID - 名称"，方便用户识别ID
    filteredClasses.forEach(cls => {
        const item = document.createElement('div');
        const isSelected = classInput.value.trim() === cls.name || classInput.value.trim() === cls.id;
        item.className = `class-item px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
            isSelected ? 'bg-indigo-50 text-indigo-600' : ''
        }`;
        item.dataset.name = cls.name;
        item.dataset.id = cls.id; // 存储ID，方便后续扩展
        item.innerHTML = `
            <div class="font-medium">${cls.id} - ${cls.name}</div>  <!-- 显示ID和名称 -->
            <div class="text-xs text-gray-500">班主任：${cls.headTeacher || '未设置'}</div>
        `;
        classDropdown.appendChild(item);
    });

    classDropdown.classList.remove('hidden');
}

// 2. 修改班级校验逻辑（允许为空）
function validateClassName(inputId) {
    const classInput = document.getElementById(inputId);
    const className = classInput.value.trim();

    // 允许为空，仅当有值时校验有效性
    if (className && !originalClasses.some(cls => cls.name === className || cls.id === className)) {
        window.showNotification('error', '错误', '请选择下拉框中的有效班级（ID或名称）');
        classInput.focus();
        return false;
    }

    return true;
}

// 3. 修改添加教师函数（移除科目必填校验）
function addTeacher() {
    const id = document.getElementById('teacherId').value.trim();
    const name = document.getElementById('teacherName').value.trim();
    const clas = document.getElementById('teacherClass').value.trim(); // 允许为空
    const age = parseInt(document.getElementById('teacherAge').value);
    const sex = document.getElementById('teacherSex').value;
    const teaching = document.getElementById('teacherTeaching').value.trim(); // 允许为空

    // 基础校验（移除!teaching和!clas的判断）
    if (!id || !name || isNaN(age) || age < 20 || age > 70) {
        window.showNotification('error', '错误', '请输入有效的教师信息（ID、姓名必填，年龄20-70岁）');
        return;
    }

    const submitBtn = document.querySelector('#addTeacherForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    fetch('/api/teachers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name, clas, age, sex, teaching}) // 允许clas和teaching为空
    })
        .then(response => {
            if (!response.ok) throw new Error('添加失败，可能ID已存在');
            return response.json();
        })
        .then(data => {
            originalTeachers.push(data);
            renderTeachers(originalTeachers);
            document.getElementById('addTeacherModal').classList.add('hidden');
            window.showNotification('success', '成功', '教师添加成功');
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '保存';
        });
}

// 4. 修改更新教师函数（移除科目必填校验）
function updateTeacher() {
    const id = document.getElementById('editTeacherId').value;
    const name = document.getElementById('editTeacherName').value.trim();
    const clas = document.getElementById('editTeacherClass').value.trim(); // 允许为空
    const age = parseInt(document.getElementById('editTeacherAge').value);
    const sex = document.getElementById('editTeacherSex').value;
    const teaching = document.getElementById('editTeacherTeaching').value.trim(); // 允许为空

    // 基础校验（移除!teaching和!clas的判断）
    if (!name || isNaN(age) || age < 20 || age > 70) {
        window.showNotification('error', '错误', '请输入有效的教师信息（姓名必填，年龄20-70岁）');
        return;
    }

    fetch(`/api/teachers/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name, clas, age, sex, teaching}) // 允许clas和teaching为空
    })
        .then(response => {
            if (!response.ok) throw new Error('更新失败');
            return response.json();
        })
        .then(data => {
            const index = originalTeachers.findIndex(t => t.id === id);
            if (index !== -1) originalTeachers[index] = data;
            renderTeachers(originalTeachers);
            document.getElementById('editTeacherModal').classList.add('hidden');
            window.showNotification('success', '成功', '教师信息更新成功');
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
}


// 初始化事件监听（修改版）
function initTeacherEvents() {
    // 模态框控制（添加教师）
    document.getElementById('addTeacherBtn')?.addEventListener('click', () => {
        document.getElementById('addTeacherModal').classList.remove('hidden');
        document.getElementById('addTeacherForm').reset();
    });
    document.getElementById('closeTeacherModal')?.addEventListener('click', () => {
        document.getElementById('addTeacherModal').classList.add('hidden');
    });
    document.getElementById('cancelAddTeacher')?.addEventListener('click', () => {
        document.getElementById('addTeacherModal').classList.add('hidden');
    });

    // 模态框控制（编辑教师）
    document.getElementById('closeEditTeacherModal')?.addEventListener('click', () => {
        document.getElementById('editTeacherModal').classList.add('hidden');
    });
    document.getElementById('cancelEditTeacher')?.addEventListener('click', () => {
        document.getElementById('editTeacherModal').classList.add('hidden');
    });

    // 表单提交（添加班级校验）
    document.getElementById('addTeacherForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        // 新增：校验班级选择
        if (!validateClassName('teacherClass')) return;
        addTeacher();
    });
    document.getElementById('editTeacherForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        // 新增：校验班级选择
        if (!validateClassName('editTeacherClass')) return;
        updateTeacher();
    });

    // 刷新和搜索
    document.getElementById('refreshTeachers')?.addEventListener('click', () => {
        // 刷新时重新加载教师和班级数据
        Promise.all([loadTeachers(), loadClasses()]);
    });
    document.getElementById('teacherSearch')?.addEventListener('input', filterTeachers);

    // 表格事件委托（编辑/删除）
    document.getElementById('teachersBody')?.addEventListener('click', (e) => {
        const target = e.target.closest('button, .fa-pencil, .fa-trash');
        if (!target) return;

        const row = target.closest('tr');
        const id = row.cells[0].textContent;
        const name = row.cells[1].textContent;

        if (target.classList.contains('fa-pencil') || target.textContent.includes('编辑')) {
            editTeacher(id);
        } else if (target.classList.contains('fa-trash') || target.textContent.includes('删除')) {
            window.confirmDelete('teacher', id, name);
        }
    });
}

// 加载教师数据（不变）
function loadTeachers() {
    const teachersBody = document.getElementById('teachersBody');
    teachersBody.innerHTML = `
        <tr class="text-center">
            <td colspan="7" class="px-6 py-12 text-gray-500">
                <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
                <p>加载中...</p>
            </td>
        </tr>
    `;

    return fetch('/api/teachers')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            return response.json();
        })
        .then(data => {
            originalTeachers = data;
            renderTeachers(data);
            return data;
        })
        .catch(error => {
            teachersBody.innerHTML = `
                <tr class="text-center">
                    <td colspan="7" class="px-6 py-12 text-gray-500">
                        <i class="fa fa-exclamation-triangle text-2xl mb-2"></i>
                        <p>加载失败: ${error.message}</p>
                    </td>
                </tr>
            `;
            return [];
        });
}

// 渲染教师表格（不变）
function renderTeachers(teachers) {
    const teachersBody = document.getElementById('teachersBody');
    teachersBody.innerHTML = '';

    if (teachers.length === 0) {
        teachersBody.innerHTML = `
            <tr class="text-center">
                <td colspan="7" class="px-6 py-12 text-gray-500">
                    <i class="fa fa-users text-2xl mb-2"></i>
                    <p>暂无教师数据</p>
                </td>
            </tr>
        `;
        return;
    }

    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors duration-150';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${teacher.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${teacher.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${teacher.clas || ''}</td> <!-- 班级列 -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${teacher.age}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${teacher.sex}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${teacher.teaching}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i class="fa fa-pencil"></i> 编辑
                </button>
                <button class="text-red-600 hover:text-red-900">
                    <i class="fa fa-trash"></i> 删除
                </button>
            </td>
        `;
        teachersBody.appendChild(row);
    });
}



// 编辑教师（回显班级名称）
function editTeacher(id) {
    const teacher = originalTeachers.find(t => t.id === id);
    if (!teacher) {
        window.showNotification('error', '错误', '未找到该教师');
        return;
    }

    // 填充表单（包含班级）
    const classInput = document.getElementById('editTeacherClass');
    classInput.value = teacher.clas || '';

    // 触发下拉框筛选，实现高亮
    const event = new Event('input', { bubbles: true });
    classInput.dispatchEvent(event);

    // 填充编辑表单，包含班级字段
    document.getElementById('editTeacherId').value = teacher.id;
    document.getElementById('editTeacherName').value = teacher.name;
    document.getElementById('editTeacherClass').value = teacher.clas || ''; // 回显班级名称
    document.getElementById('editTeacherAge').value = teacher.age;
    document.getElementById('editTeacherSex').value = teacher.sex;
    document.getElementById('editTeacherTeaching').value = teacher.teaching;
    document.getElementById('editTeacherModal').classList.remove('hidden');
}


// 删除教师（不变）
window.deleteTeacher = function (id) {
    if (!id) {
        window.showNotification('error', '错误', '未找到教师ID');
        return;
    }

    fetch(`/api/teachers/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('删除失败，可能存在关联课程或班级');
            originalTeachers = originalTeachers.filter(teacher => teacher.id !== id);
            renderTeachers(originalTeachers);
            window.showNotification('success', '成功', '教师删除成功');
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
};

// 搜索过滤教师（支持班级搜索，不变）
function filterTeachers() {
    const searchTerm = document.getElementById('teacherSearch').value.toLowerCase().trim();

    if (!searchTerm) {
        renderTeachers(originalTeachers);
        return;
    }

    const filteredTeachers = originalTeachers.filter(teacher => {
        return teacher.id.toLowerCase().includes(searchTerm) ||
            teacher.name.toLowerCase().includes(searchTerm) ||
            (teacher.clas && teacher.clas.toLowerCase().includes(searchTerm)) || // 搜索班级
            teacher.sex.toLowerCase().includes(searchTerm) ||
            teacher.teaching.toLowerCase().includes(searchTerm) ||
            (teacher.age && teacher.age.toString().includes(searchTerm));
    });

    renderTeachers(filteredTeachers);
}