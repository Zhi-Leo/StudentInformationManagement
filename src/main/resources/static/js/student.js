// 学生管理专用JS
let originalStudents = [];
let originalClasses = []; // 存储班级列表（仅用名称，无需ID）

document.addEventListener('DOMContentLoaded', () => {
    // 第一步：登录状态校验（核心）
    login0("学生");
    initStudentEvents();
    // 并行加载学生和班级数据，初始化下拉框
    Promise.all([loadStudents(), loadClasses()]).then(() => {
        initClassDropdown('studentClas', 'classDropdown'); // 添加学生（无ID）
        initClassDropdown('editStudentClas', 'editClassDropdown'); // 编辑学生（无ID）
    });
    loadNavbar();
});

// 1. 加载班级数据（仅需班级名称，无需ID）
function loadClasses() {
    return fetch('/api/classes') // 后端返回格式需包含 "name" 字段（如：[{name: "高一(1)班", ...}]）
        .then(response => {
            if (!response.ok) throw new Error(`班级数据加载失败: ${response.status}`);
            return response.json();
        })
        .then(data => {
            originalClasses = data;
            return data;
        })
        .catch(error => {
            console.error('加载班级数据失败:', error);
            window.showNotification('error', '错误', '班级列表加载失败，班级下拉功能不可用');
            return [];
        });
}

// 2. 初始化班级下拉框（仅用班级名称）
function initClassDropdown(inputId, dropdownId) {
    const classInput = document.getElementById(inputId);
    const classDropdown = document.getElementById(dropdownId);

    // 1. 点击输入框显示下拉框 - 补充 inputId
    classInput.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentVal = classInput.value.trim().toLowerCase();
        filterAndShowClasses(currentVal, inputId, dropdownId); // 新增 inputId
    });

    // 2. 输入时实时筛选 - 补充 inputId
    classInput.addEventListener('input', (e) => {
        const searchVal = e.target.value.trim().toLowerCase();
        filterAndShowClasses(searchVal, inputId, dropdownId); // 新增 inputId
    });

    // 3. 获焦时显示下拉框 - 补充 inputId
    classInput.addEventListener('focus', () => {
        const currentVal = classInput.value.trim().toLowerCase();
        filterAndShowClasses(currentVal, inputId, dropdownId); // 新增 inputId
    });

    // 选择下拉项：直接填入班级名称（无ID）
    classDropdown.addEventListener('click', (e) => {
        const classItem = e.target.closest('.class-item');
        if (classItem) {
            const className = classItem.dataset.name; // 仅获取班级名称
            classInput.value = className; // 输入框显示名称
            classDropdown.classList.add('hidden');
        }
    });
}

// 3. 筛选班级并显示（按名称匹配）- 修复：增加 inputId 参数
function filterAndShowClasses(searchVal, inputId, dropdownId) {
    // 第一步：先获取元素并判断是否存在（关键：提前拦截 null）
    const classDropdown = document.getElementById(dropdownId);
    const classInput = document.getElementById(inputId);
    if (!classDropdown || !classInput) {
        console.error(`下拉框元素不存在：dropdownId=${dropdownId}，inputId=${inputId}`);
        return; // 终止函数，避免后续操作 null
    }

    // 第二步：元素存在，再清空内容（此时不会报错）
    classDropdown.innerHTML = '';

    // 后续逻辑（班级数据加载、筛选等，不变）
    if (originalClasses.length === 0) {
        classDropdown.innerHTML = `
            <div class="px-4 py-2 text-gray-500 text-sm">
                <i class="fa fa-spinner fa-spin mr-2"></i>班级数据加载中...
            </div>
        `;
        classDropdown.classList.remove('hidden');
        return;
    }

    // 按班级名称筛选（模糊匹配）
    const filteredClasses = searchVal
        ? originalClasses.filter(cls => cls.name.toLowerCase().includes(searchVal))
        : originalClasses.slice(0, 10); // 无搜索时显示前10个

    // 无匹配结果
    if (filteredClasses.length === 0) {
        classDropdown.innerHTML = `
            <div class="px-4 py-2 text-gray-500 text-sm">
                未找到匹配的班级
            </div>
        `;
        classDropdown.classList.remove('hidden');
        return;
    }

    // 生成下拉选项（修复：使用 inputId 获取的输入框判断选中状态）
    filteredClasses.forEach(cls => {
        const item = document.createElement('div');
        // 修复：通过 inputId 获取当前输入框的值，判断是否选中
        const isSelected = classInput.value.trim() === cls.name;
        item.className = `class-item px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
            isSelected ? 'bg-indigo-50 text-indigo-600' : ''
        }`;
        item.dataset.name = cls.name; // 仅存储名称
        item.innerHTML = `
            <div class="font-medium">${cls.name}</div>
            <div class="text-xs text-gray-500">班主任：${cls.headTeacher || '未设置'}</div>
        `;
        classDropdown.appendChild(item);
    });

    classDropdown.classList.remove('hidden');
}

// 4. 班级名称校验（确保是有效班级名称）
function validateClassName(inputId) {
    const classInput = document.getElementById(inputId);
    const className = classInput.value.trim();

    // 空校验
    if (!className) {
        window.showNotification('error', '错误', '班级不能为空，请选择或搜索班级');
        classInput.focus();
        return false;
    }

    // 有效性校验（是否存在于班级列表中）
    const isClassValid = originalClasses.some(cls => cls.name === className);
    if (!isClassValid) {
        window.showNotification('error', '错误', '请选择下拉框中的有效班级名称');
        classInput.focus();
        return false;
    }

    return true;
}

// 5. 加载导航栏（复用）
// student.js 中的 loadNavbar 函数（修复后）
function loadNavbar() {
    return fetch('index.html')
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const tpl = doc.getElementById('navbarTpl');

            if (tpl && document.getElementById('navbarContainer')) {
                // 关键：只提取模板内的 HTML，过滤所有 <script> 标签
                const navbarHtml = tpl.innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                document.getElementById('navbarContainer').innerHTML = navbarHtml;
                initNavbar(); // 仅初始化导航栏的点击事件（无 message 监听）
            }
        })
        .catch(err => {
            console.error('加载导航栏失败:', err);
            return Promise.resolve();
        });
}

// 6. 初始化导航栏（复用）
function initNavbar() {
    const studentsTab = document.getElementById('studentsTab');
    if (studentsTab) {
        studentsTab.classList.add('text-primary', 'border-b-2', 'border-primary');
        studentsTab.classList.remove('text-gray-500');
    }
    // 退出登录逻辑（仅清除状态，无校验）
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        if (confirm('确定退出登录吗？')) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        }
    });
}

// 7. 初始化事件监听（移除ID相关逻辑）
function initStudentEvents() {
    // 模态框控制（添加学生）
    document.getElementById('addStudentBtn')?.addEventListener('click', () => {
        document.getElementById('addStudentModal').classList.remove('hidden');
        document.getElementById('addStudentForm').reset();
        // 移除：重置班级ID隐藏字段的代码
    });
    document.getElementById('closeStudentModal')?.addEventListener('click', () => {
        document.getElementById('addStudentModal').classList.add('hidden');
    });
    document.getElementById('cancelAddStudent')?.addEventListener('click', () => {
        document.getElementById('addStudentModal').classList.add('hidden');
    });

    // 模态框控制（编辑学生）
    document.getElementById('cancelEditStudent')?.addEventListener('click', () => {
        document.getElementById('editStudentModal').classList.add('hidden');
    });
    const editCloseBtn = document.querySelector('#editStudentModal .fa-times')?.parentElement;
    if (editCloseBtn) {
        editCloseBtn.addEventListener('click', () => {
            document.getElementById('editStudentModal').classList.add('hidden');
        });
    }

    // 表单提交（校验班级名称）
    document.getElementById('addStudentForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateClassName('studentClas')) return; // 校验名称（无ID）
        addStudent();
    });
    document.getElementById('editStudentForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateClassName('editStudentClas')) return; // 校验名称（无ID）
        updateStudent();
    });

    // 刷新和搜索
    document.getElementById('refreshStudents')?.addEventListener('click', () => {
        Promise.all([loadStudents(), loadClasses()]);
    });
    document.getElementById('studentSearch')?.addEventListener('input', filterStudents);

    // 表格事件（编辑/删除）
    const studentsBody = document.getElementById('studentsBody');
    if (studentsBody) {
        studentsBody.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.text-red-600, .fa-trash');
            const editBtn = e.target.closest('.text-indigo-600, .fa-pencil');
            if (!deleteBtn && !editBtn) return;

            const row = e.target.closest('tr');
            const studentId = row?.cells[0]?.textContent;
            const studentName = row?.cells[2]?.textContent;
            if (!studentId) {
                window.showNotification('error', '错误', '未获取到学生ID');
                return;
            }

            if (editBtn) {
                editStudent(studentId);
            } else if (deleteBtn) {
                window.confirmDelete('student', studentId, studentName);
            }
        });
    }
}

// 8. 编辑学生（仅回显班级名称）
function editStudent(id) {
    const student = originalStudents.find(s => s.id === id);
    if (!student) {
        return window.showNotification('error', '错误', '未找到该学生');
    }

    // 回显基本信息
    document.getElementById('editStudentId').value = student.id || '';
    document.getElementById('editStudentName').value = student.name || '';
    document.getElementById('editStudentAge').value = student.age || '';
    document.getElementById('editStudentSex').value = student.sex || '男';
    document.getElementById('editStudentGrade').value = student.grade || '';

    // 回显班级名称（直接显示，无ID）
    const classInput = document.getElementById('editStudentClas');
    if (classInput) {
        classInput.value = student.clas || ''; // student.clas 已存储班级名称
    }

    // 显示模态框
    const editModal = document.getElementById('editStudentModal');
    if (editModal) {
        editModal.classList.remove('hidden');
    }
}

// 9. 新增学生（提交班级名称到数据库）
function addStudent() {
    const id = document.getElementById('studentId').value.trim();
    const clas = document.getElementById('studentClas').value.trim(); // 直接获取班级名称
    const name = document.getElementById('studentName').value.trim();
    const age = parseInt(document.getElementById('studentAge').value);
    const sex = document.getElementById('studentSex').value;
    const grade = parseFloat(document.getElementById('studentGrade').value);

    // 基础校验
    if (!id) return window.showNotification('error', '错误', '学生ID不能为空');
    if (!name) return window.showNotification('error', '错误', '学生姓名不能为空');
    if (isNaN(age) || age < 5 || age > 100) return window.showNotification('error', '错误', '年龄需为5-100之间的数字');
    if (isNaN(grade) || grade < 0 || grade > 100) return window.showNotification('error', '错误', '成绩需为0-100之间的数字');

    const submitBtn = document.querySelector('#addStudentForm button[type="submit"]');
    if (!submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    // 提交班级名称到后端（clas字段为名称，无ID）
    fetch('/api/students', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, clas, name, age, sex, grade}) // clas是班级名称
    })
        .then(response => {
            if (!response.ok) throw new Error('添加失败，可能ID已存在');
            return response.json();
        })
        .then(data => {
            originalStudents.push(data);
            renderStudents(originalStudents);
            document.getElementById('addStudentModal').classList.add('hidden');
            window.showNotification('success', '成功', '学生添加成功');
            updateAllClassStudentCounts();
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '保存';
        });
}

// 10. 更新学生（提交班级名称到数据库）
function updateStudent() {
    const id = document.getElementById('editStudentId').value.trim();
    const clas = document.getElementById('editStudentClas').value.trim(); // 直接获取班级名称
    const name = document.getElementById('editStudentName').value.trim();
    const age = parseInt(document.getElementById('editStudentAge').value);
    const sex = document.getElementById('editStudentSex').value;
    const grade = parseFloat(document.getElementById('editStudentGrade').value);

    // 基础校验
    if (!id) return window.showNotification('error', '错误', '学生ID不可为空');
    if (!name) return window.showNotification('error', '错误', '学生姓名不能为空');
    if (isNaN(age) || age < 5 || age > 100) return window.showNotification('error', '错误', '年龄需为5-100之间的数字');
    if (isNaN(grade) || grade < 0 || grade > 100) return window.showNotification('error', '错误', '成绩需为0-100之间的数字');

    const submitBtn = document.querySelector('#editStudentForm button[type="submit"]');
    if (!submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    // 提交班级名称到后端（clas字段为名称，无ID）
    fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, clas, name, age, sex, grade}) // clas是班级名称
    })
        .then(response => {
            if (!response.ok) throw new Error('更新失败，请重试');
            return response.json();
        })
        .then(data => {
            const index = originalStudents.findIndex(s => s.id === id);
            if (index !== -1) {
                originalStudents[index] = data;
            }
            renderStudents(originalStudents);
            document.getElementById('editStudentModal').classList.add('hidden');
            window.showNotification('success', '成功', '学生信息更新成功');
            updateAllClassStudentCounts();
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '保存';
        });
}

// 11. 加载学生数据（复用）
function loadStudents() {
    const studentsBody = document.getElementById('studentsBody');
    if (!studentsBody) return Promise.resolve();

    studentsBody.innerHTML = `
        <tr class="text-center">
            <td colspan="7" class="px-6 py-12 text-gray-500">
                <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
                <p>加载中...</p>
            </td>
        </tr>
    `;

    return fetch('/api/students')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            return response.json();
        })
        .then(data => {
            originalStudents = data;
            renderStudents(originalStudents);
            return data;
        })
        .catch(error => {
            studentsBody.innerHTML = `
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

// 12. 渲染学生表格（仅显示班级名称）
function renderStudents(students) {
    const studentsBody = document.getElementById('studentsBody');
    if (!studentsBody) return;

    studentsBody.innerHTML = '';

    if (students.length === 0) {
        studentsBody.innerHTML = `
            <tr class="text-center">
                <td colspan="7" class="px-6 py-12 text-gray-500">
                    <i class="fa fa-users text-2xl mb-2"></i>
                    <p>暂无学生数据</p>
                </td>
            </tr>
        `;
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors duration-150';
        row.dataset.studentId = student.id;
        // 仅显示班级名称（student.clas 已存储名称）
        const classDisplay = student.clas || '未分配班级';

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${classDisplay}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.age}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.sex}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.grade}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors">
                    <i class="fa fa-pencil"></i> 编辑
                </button>
                <button class="text-red-600 hover:text-red-900 transition-colors">
                    <i class="fa fa-trash"></i> 删除
                </button>
            </td>
        `;
        studentsBody.appendChild(row);
    });
}

// 13. 筛选学生（复用）
function filterStudents() {
    const searchTerm = document.getElementById('studentSearch')?.value.toLowerCase().trim() || '';

    const filteredStudents = originalStudents.filter(student =>
        Object.values(student).some(value =>
            value?.toString().toLowerCase().includes(searchTerm)
        )
    );

    renderStudents(filteredStudents);
}

// 14. 确认删除（复用）
window.confirmDelete = function (type, id, name) {
    const confirmMsg = type === 'student'
        ? `确定删除学生【${name}】（ID：${id}）吗？删除后不可恢复！`
        : `确定删除该${type === 'class' ? '班级' : '数据'}吗？`;

    if (confirm(confirmMsg)) {
        if (type === 'student') {
            deleteStudent(id);
        }
    }
};

// 15. 删除学生（复用）
function deleteStudent(studentId) {
    const allDeleteBtns = document.querySelectorAll('#studentsBody .text-red-600');
    allDeleteBtns.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 删除中...';
    });

    fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errMsg => {
                    throw new Error(errMsg || `删除失败，状态码: ${response.status}`);
                });
            }
            if (response.status === 204) return null;
            return response.json();
        })
        .then(() => {
            originalStudents = originalStudents.filter(student => student.id !== studentId);
            renderStudents(originalStudents);
            window.showNotification('success', '成功', '学生删除成功');
            updateAllClassStudentCounts();
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        })
        .finally(() => {
            allDeleteBtns.forEach(btn => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa fa-trash"></i> 删除';
            });
        });
}

// 16. 更新班级人数（复用）
function updateAllClassStudentCounts() {
    fetch('/api/classes/updateAllStudentCounts', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {
            if (!response.ok) throw new Error('更新班级人数失败');
        })
        .catch(error => {
            console.error('更新班级人数失败:', error);
            window.showNotification('error', '失败', '更新班级人数失败');
        });
}