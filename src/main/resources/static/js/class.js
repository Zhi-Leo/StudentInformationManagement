// 班级数据存储
let originalClasses = [];

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initClassEvents();
    loadClasses();
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

    // 表格行点击事件（编辑/删除）
    document.getElementById('classesBody')?.addEventListener('click', (e) => {
        const target = e.target.closest('button, .fa-pencil, .fa-trash');
        if (!target) return;

        const row = target.closest('tr');
        const classId = row.cells[0].textContent;
        const className = row.cells[1].textContent;
        const headTeacher = row.cells[2].textContent;
        const number = row.cells[3].textContent;

        if (target.classList.contains('fa-pencil') || target.textContent.includes('编辑')) {
            editClass(classId, className, headTeacher, number);
        } else if (target.classList.contains('fa-trash') || target.textContent.includes('删除')) {
            // 调用共用删除函数（传递类型、ID、名称）
            window.confirmDelete('class', classId, className);
        }
    });
}

// 加载班级数据
function loadClasses() {
    const classesBody = document.getElementById('classesBody');
    classesBody.innerHTML = `
        <tr class="text-center">
            <td colspan="5" class="px-6 py-12 text-gray-500">
                <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
                <p>加载中...</p>
            </td>
        </tr>
    `;

    fetch('/api/classes')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            return response.json();
        })
        .then(data => {
            originalClasses = data;
            renderClasses(data);
        })
        .catch(error => {
            classesBody.innerHTML = `
                <tr class="text-center">
                    <td colspan="5" class="px-6 py-12 text-gray-500">
                        <i class="fa fa-exclamation-triangle text-2xl mb-2"></i>
                        <p>加载失败: ${error.message}</p>
                    </td>
                </tr>
            `;
        });
}

// 渲染班级表格（处理空值显示）
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

// 添加班级（允许班主任和人数为空）
function addClass() {
    const id = document.getElementById('classId').value.trim();
    const name = document.getElementById('className').value.trim();
    const headTeacher = document.getElementById('headTeacher').value.trim();
    const classNumberInput = document.getElementById('classNumber').value.trim();
    const studentCount = classNumberInput ? parseInt(classNumberInput) : null;

    // 前端校验：仅校验必填项
    if (!id || !name) {
        window.showNotification('error', '错误', '班级ID和名称不能为空');
        return;
    }

    fetch('/api/classes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name, headTeacher, studentCount})
    })
        .then(response => {
            if (!response.ok) throw new Error('添加失败，可能ID已存在');
            return response.json();
        })
        .then(data => {
            window.showNotification('success', '成功', '班级添加成功');
            originalClasses.push(data);
            renderClasses(originalClasses);
            document.getElementById('addClassModal').classList.add('hidden');
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
}

// 编辑班级（允许班主任和人数为空）
function editClass(id, name, headTeacher, number) {
    // 显示班级ID（只读）
    document.getElementById('editClassIdDisplay').value = id;
    // 隐藏字段用于提交（保持ID不变）
    document.getElementById('editClassId').value = id;
    // 其他字段正常回显
    document.getElementById('editClassName').value = name;
    document.getElementById('editHeadTeacher').value = headTeacher;
    document.getElementById('editClassNumber').value = number || '';
    document.getElementById('editClassModal').classList.remove('hidden');
}

// 更新班级（允许班主任和人数为空）
function updateClass() {
    const id = document.getElementById('editClassId').value;
    const name = document.getElementById('editClassName').value.trim();
    const headTeacher = document.getElementById('editHeadTeacher').value.trim();
    const classNumberInput = document.getElementById('editClassNumber').value.trim();
    const studentCount = classNumberInput ? parseInt(classNumberInput) : null;

    // 仅校验班级名称必填
    if (!name) {
        window.showNotification('error', '错误', '班级名称不能为空');
        return;
    }

    fetch(`/api/classes/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name, headTeacher, studentCount})
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
            document.getElementById('editClassModal').classList.add('hidden');
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
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

    fetch(`/api/classes/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || '删除失败，可能存在关联学生');
                });
            }
            originalClasses = originalClasses.filter(cls => cls.id !== id);
            renderClasses(originalClasses);
            window.showNotification('success', '成功', '班级删除成功');
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
};

// 搜索过滤班级（适配空值）
function filterClasses() {
    const searchTerm = document.getElementById('classSearch').value.toLowerCase();
    const filtered = originalClasses.filter(c =>
        c.id.toLowerCase().includes(searchTerm) ||
        c.name.toLowerCase().includes(searchTerm) ||
        (c.headTeacher && c.headTeacher.toLowerCase().includes(searchTerm))
    );
    renderClasses(filtered);
}