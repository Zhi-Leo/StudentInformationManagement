// 学生管理专用JS
let originalStudents = [];

document.addEventListener('DOMContentLoaded', () => {
    initStudentEvents();
    loadStudents();
});

// 初始化事件监听
function initStudentEvents() {
    // 模态框控制（添加学生）
    document.getElementById('addStudentBtn')?.addEventListener('click', () => {
        document.getElementById('addStudentModal').classList.remove('hidden');
        document.getElementById('addStudentForm').reset();
    });
    document.getElementById('closeStudentModal')?.addEventListener('click', () => {
        document.getElementById('addStudentModal').classList.add('hidden');
    });
    document.getElementById('cancelAddStudent')?.addEventListener('click', () => {
        document.getElementById('addStudentModal').classList.add('hidden');
    });

    // 模态框控制（编辑学生）
    document.getElementById('closeEditStudentModal')?.addEventListener('click', () => {
        document.getElementById('editStudentModal').classList.add('hidden');
    });
    document.getElementById('cancelEditStudent')?.addEventListener('click', () => {
        document.getElementById('editStudentModal').classList.add('hidden');
    });

    // 表单提交
    document.getElementById('addStudentForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addStudent();
    });
    document.getElementById('editStudentForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        updateStudent();
    });

    // 刷新和搜索
    document.getElementById('refreshStudents')?.addEventListener('click', loadStudents);
    document.getElementById('studentSearch')?.addEventListener('input', filterStudents);

    // 表格事件委托（编辑/删除）
    document.getElementById('studentsBody')?.addEventListener('click', (e) => {
        const target = e.target.closest('button, .fa-pencil, .fa-trash');
        if (!target) return;

        const row = target.closest('tr');
        const id = row.cells[0].textContent;
        const name = row.cells[1].textContent;

        if (target.classList.contains('fa-pencil') || target.textContent.includes('编辑')) {
            editStudent(id);
        } else if (target.classList.contains('fa-trash') || target.textContent.includes('删除')) {
            // 调用共用删除函数（传递类型、ID、名称）
            window.confirmDelete('student', id, name);
        }
    });
}

// 加载学生数据
function loadStudents() {
    const studentsBody = document.getElementById('studentsBody');
    studentsBody.innerHTML = `
        <tr class="text-center">
            <td colspan="6" class="px-6 py-12 text-gray-500">
                <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
                <p>加载中...</p>
            </td>
        </tr>
    `;

    fetch('/api/students')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            return response.json();
        })
        .then(data => {
            originalStudents = data;
            renderStudents(data);
        })
        .catch(error => {
            studentsBody.innerHTML = `
                <tr class="text-center">
                    <td colspan="6" class="px-6 py-12 text-gray-500">
                        <i class="fa fa-exclamation-triangle text-2xl mb-2"></i>
                        <p>加载失败: ${error.message}</p>
                    </td>
                </tr>
            `;
        });
}

// 渲染学生表格
function renderStudents(students) {
    const studentsBody = document.getElementById('studentsBody');
    studentsBody.innerHTML = '';

    if (students.length === 0) {
        studentsBody.innerHTML = `
            <tr class="text-center">
                <td colspan="6" class="px-6 py-12 text-gray-500">
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
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.age}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.sex}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.grade}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i class="fa fa-pencil"></i> 编辑
                </button>
                <button class="text-red-600 hover:text-red-900">
                    <i class="fa fa-trash"></i> 删除
                </button>
            </td>
        `;
        studentsBody.appendChild(row);
    });
}

// 添加学生
function addStudent() {
    const id = document.getElementById('studentId').value.trim();
    const name = document.getElementById('studentName').value.trim();
    const age = parseInt(document.getElementById('studentAge').value);
    const sex = document.getElementById('studentSex').value;
    const grade = parseFloat(document.getElementById('studentGrade').value);

    // 校验
    if (!id || !name || isNaN(age) || age < 5 || age > 100 || isNaN(grade) || grade < 0 || grade > 100) {
        window.showNotification('error', '错误', '请输入有效的学生信息');
        return;
    }

    const submitBtn = document.querySelector('#addStudentForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, age, sex, grade })
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
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '保存';
        });
}

// 编辑学生
function editStudent(id) {
    const student = originalStudents.find(s => s.id === id);
    if (!student) {
        window.showNotification('error', '错误', '未找到该学生');
        return;
    }

    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentAge').value = student.age;
    document.getElementById('editStudentSex').value = student.sex;
    document.getElementById('editStudentGrade').value = student.grade;
    document.getElementById('editStudentModal').classList.remove('hidden');
}

// 更新学生
function updateStudent() {
    const id = document.getElementById('editStudentId').value;
    const name = document.getElementById('editStudentName').value.trim();
    const age = parseInt(document.getElementById('editStudentAge').value);
    const sex = document.getElementById('editStudentSex').value;
    const grade = parseFloat(document.getElementById('editStudentGrade').value);

    if (!name || isNaN(age) || age < 5 || age > 100 || isNaN(grade) || grade < 0 || grade > 100) {
        window.showNotification('error', '错误', '请输入有效的学生信息');
        return;
    }

    fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, age, sex, grade })
    })
        .then(response => {
            if (!response.ok) throw new Error('更新失败');
            return response.json();
        })
        .then(data => {
            const index = originalStudents.findIndex(s => s.id === id);
            if (index !== -1) originalStudents[index] = data;
            renderStudents(originalStudents);
            document.getElementById('editStudentModal').classList.add('hidden');
            window.showNotification('success', '成功', '学生信息更新成功');
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
}

// 核心：删除学生（适配共用逻辑，使用全局currentId）
// 示例：student.js 中的删除函数
window.deleteStudent = function(id) {
    // 使用传入的ID而非全局变量
    console.log('[删除学生] ID:', id);

    if (!id) {
        window.showNotification('error', '错误', '未找到学生ID');
        return;
    }

    fetch(`/api/students/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('删除失败，可能存在关联数据');
            originalStudents = originalStudents.filter(s => s.id !== id);
            renderStudents(originalStudents);
            window.showNotification('success', '删除成功', '学生信息已删除');
        })
        .catch(error => {
            window.showNotification('error', '删除失败', error.message);
        });
};

// 搜索过滤学生
function filterStudents() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase().trim();
    if (!searchTerm) {
        renderStudents(originalStudents);
        return;
    }

    const filteredStudents = originalStudents.filter(student => {
        return student.id.toLowerCase().includes(searchTerm) ||
            student.name.toLowerCase().includes(searchTerm) ||
            student.sex.toLowerCase().includes(searchTerm) ||
            (student.age && student.age.toString().includes(searchTerm)) ||
            (student.grade && student.grade.toString().includes(searchTerm));
    });

    renderStudents(filteredStudents);
}