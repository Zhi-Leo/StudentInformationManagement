// 教师管理专用JS
let originalTeachers = [];

document.addEventListener('DOMContentLoaded', () => {
    initTeacherEvents();
    loadTeachers();
});

// 初始化事件监听
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

    // 表单提交
    document.getElementById('addTeacherForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addTeacher();
    });
    document.getElementById('editTeacherForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        updateTeacher();
    });

    // 刷新和搜索
    document.getElementById('refreshTeachers')?.addEventListener('click', loadTeachers);
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

// 加载教师数据
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

    fetch('/api/teachers')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            return response.json();
        })
        .then(data => {
            originalTeachers = data;
            renderTeachers(data);
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
        });
}

// 渲染教师表格（新增班级列）
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

// 添加教师（包含班级字段）
function addTeacher() {
    const id = document.getElementById('teacherId').value.trim();
    const name = document.getElementById('teacherName').value.trim();
    const clas = document.getElementById('teacherClass').value.trim(); // 班级字段
    const age = parseInt(document.getElementById('teacherAge').value);
    const sex = document.getElementById('teacherSex').value;
    const teaching = document.getElementById('teacherTeaching').value.trim();

    // 校验
    if (!id || !name || !clas || !teaching || isNaN(age) || age < 20 || age > 70) {
        window.showNotification('error', '错误', '请输入有效的教师信息（班级和科目必填，年龄20-70岁）');
        return;
    }

    const submitBtn = document.querySelector('#addTeacherForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    fetch('/api/teachers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name, clas, age, sex, teaching}) // 包含班级字段
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

// 编辑教师（包含班级字段）
function editTeacher(id) {
    const teacher = originalTeachers.find(t => t.id === id);
    if (!teacher) {
        window.showNotification('error', '错误', '未找到该教师');
        return;
    }

    // 填充编辑表单，包含班级字段
    document.getElementById('editTeacherId').value = teacher.id;
    document.getElementById('editTeacherName').value = teacher.name;
    document.getElementById('editTeacherClass').value = teacher.clas || ''; // 班级字段
    document.getElementById('editTeacherAge').value = teacher.age;
    document.getElementById('editTeacherSex').value = teacher.sex;
    document.getElementById('editTeacherTeaching').value = teacher.teaching;
    document.getElementById('editTeacherModal').classList.remove('hidden');
}

// 更新教师（包含班级字段）
function updateTeacher() {
    const id = document.getElementById('editTeacherId').value;
    const name = document.getElementById('editTeacherName').value.trim();
    const clas = document.getElementById('editTeacherClass').value.trim(); // 班级字段
    const age = parseInt(document.getElementById('editTeacherAge').value);
    const sex = document.getElementById('editTeacherSex').value;
    const teaching = document.getElementById('editTeacherTeaching').value.trim();

    // 校验
    if (!name || !clas || !teaching || isNaN(age) || age < 20 || age > 70) {
        window.showNotification('error', '错误', '请输入有效的教师信息（班级和科目必填，年龄20-70岁）');
        return;
    }

    fetch(`/api/teachers/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name, clas, age, sex, teaching}) // 包含班级字段
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

// 删除教师
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

// 搜索过滤教师（支持班级搜索）
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