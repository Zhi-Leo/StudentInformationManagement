// 学生管理专用JS
let originalStudents = [];

document.addEventListener('DOMContentLoaded', () => {
    initStudentEvents();
    loadStudents();
    // 加载导航栏（如果需要）
    loadNavbar();
});

// 加载导航栏（复用逻辑）
function loadNavbar() {
    fetch('index.html')
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const tpl = doc.getElementById('navbarTpl');
            if (tpl && document.getElementById('navbarContainer')) {
                document.getElementById('navbarContainer').innerHTML = tpl.innerHTML;
                initNavbar();
            }
        })
        .catch(err => console.error('加载导航栏失败:', err));
}

// 初始化导航栏
function initNavbar() {
    const studentsTab = document.getElementById('studentsTab');
    if (studentsTab) {
        studentsTab.classList.add('text-primary', 'border-b-2', 'border-primary');
        studentsTab.classList.remove('text-gray-500');
    }
    // 退出登录事件
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        if (confirm('确定退出登录吗？')) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        }
    });
}

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
    document.getElementById('cancelEditStudent')?.addEventListener('click', () => {
        document.getElementById('editStudentModal').classList.add('hidden');
    });
    // 关闭编辑模态框（假设存在关闭按钮）
    document.querySelector('#editStudentModal .fa-times')?.parentElement?.addEventListener('click', () => {
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

        if (target.classList.contains('fa-pencil') || target.textContent.includes('编辑')) {
            editStudent(id);
        } else if (target.classList.contains('fa-trash') || target.textContent.includes('删除')) {
            window.confirmDelete('student', id, row.cells[2].textContent);
        }
    });
}

// 加载学生数据
function loadStudents() {
    const studentsBody = document.getElementById('studentsBody');
    studentsBody.innerHTML = `
        <tr class="text-center">
            <td colspan="7" class="px-6 py-12 text-gray-500">
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
                    <td colspan="7" class="px-6 py-12 text-gray-500">
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
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.clas || ''}</td> <!-- 班级列 -->
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

// 过滤学生列表
function filterStudents() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase().trim();

    if (!searchTerm) {
        // 如果搜索框为空，显示原始列表
        renderStudents(originalStudents);
        return;
    }

    // 过滤学生列表
    const filteredStudents = originalStudents.filter(student => {
        // 检查学生的任何字段是否包含搜索词
        return Object.values(student).some(value =>
            value.toString().toLowerCase().includes(searchTerm)
        );
    });

    renderStudents(filteredStudents);
}

// 添加学生
function addStudent() {
    const id = document.getElementById('studentId').value.trim();
    const clas = document.getElementById('studentClas').value.trim(); // 班级字段
    const name = document.getElementById('studentName').value.trim();
    const age = parseInt(document.getElementById('studentAge').value);
    const sex = document.getElementById('studentSex').value;
    const grade = parseFloat(document.getElementById('studentGrade').value);

    // 校验
    if (!id || !clas || !name || isNaN(age) || age < 5 || age > 100 || isNaN(grade) || grade < 0 || grade > 100) {
        window.showNotification('error', '错误', '请输入有效的学生信息（班级不能为空）');
        return;
    }

    const submitBtn = document.querySelector('#addStudentForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    fetch('/api/students', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, clas, name, age, sex, grade}) // 包含班级字段
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

            // 调用更新所有班级学生数量的接口
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

// 更新所有班级的学生数量
function updateAllClassStudentCounts() {
    fetch('/api/classes/updateAllStudentCounts', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
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

// 编辑学生
function editStudent(id) {
    const student = originalStudents.find(s => s.id === id);
    if (!student) {
        window.showNotification('error', '错误', '未找到该学生');
        return;
    }

    // 填充表单数据
    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editStudentClas').value = student.clas || ''; // 班级字段
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentAge').value = student.age;
    document.getElementById('editStudentSex').value = student.sex;
    document.getElementById('editStudentGrade').value = student.grade;

    document.getElementById('editStudentModal').classList.remove('hidden');
}

// 更新学生
function updateStudent() {
    const id = document.getElementById('editStudentId').value;
    const clas = document.getElementById('editStudentClas').value.trim();
    const name = document.getElementById('editStudentName').value.trim();
    const age = parseInt(document.getElementById('editStudentAge').value);
    const sex = document.getElementById('editStudentSex').value;
    const grade = parseFloat(document.getElementById('editStudentGrade').value);

    // 校验
    if (!id || !clas || !name || isNaN(age) || age < 5 || age > 100 || isNaN(grade) || grade < 0 || grade > 100) {
        window.showNotification('error', '错误', '请输入有效的学生信息（班级不能为空）');
        return;
    }

    const submitBtn = document.querySelector('#editStudentForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, clas, name, age, sex, grade})
    })
        .then(response => {
            if (!response.ok) throw new Error('更新失败');
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

            // 调用更新所有班级学生数量的接口
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