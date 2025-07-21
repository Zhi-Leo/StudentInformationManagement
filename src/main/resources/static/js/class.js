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

        if (target.classList.contains('fa-pencil') || target.textContent.includes('编辑')) {
            editClass(classId, className);
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
            <td colspan="3" class="px-6 py-12 text-gray-500">
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
                    <td colspan="3" class="px-6 py-12 text-gray-500">
                        <i class="fa fa-exclamation-triangle text-2xl mb-2"></i>
                        <p>加载失败: ${error.message}</p>
                    </td>
                </tr>
            `;
        });
}

// 渲染班级表格
function renderClasses(classes) {
    const classesBody = document.getElementById('classesBody');
    classesBody.innerHTML = '';

    if (classes.length === 0) {
        classesBody.innerHTML = `
            <tr class="text-center">
                <td colspan="3" class="px-6 py-12 text-gray-500">
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

// 添加班级
function addClass() {
    const id = document.getElementById('classId').value.trim();
    const name = document.getElementById('className').value.trim();

    // 前端校验
    if (!id || !name) {
        window.showNotification('error', '错误', '班级ID和名称不能为空');
        return;
    }

    fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
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

// 编辑班级
function editClass(id, name) {
    document.getElementById('editClassId').value = id;
    document.getElementById('editClassName').value = name;
    document.getElementById('editClassModal').classList.remove('hidden');
}

// 更新班级
function updateClass() {
    const id = document.getElementById('editClassId').value;
    const name = document.getElementById('editClassName').value.trim();

    if (!name) {
        window.showNotification('error', '错误', '班级名称不能为空');
        return;
    }

    fetch(`/api/classes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
    })
        .then(response => {
            if (!response.ok) throw new Error('更新失败');
            return response.json();
        })
        .then(data => {
            window.showNotification('success', '成功', '班级更新成功');
            // 更新本地数据
            const index = originalClasses.findIndex(c => c.id === id);
            if (index !== -1) originalClasses[index] = data;
            renderClasses(originalClasses);
            document.getElementById('editClassModal').classList.add('hidden');
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
}

// 核心：删除班级（修正函数命名和API路径）
window.deleteClass = function(id) {
    console.log('[删除班级] ID:', id);

    if (!id) {
        window.showNotification('error', '错误', '未找到班级ID');
        return;
    }

    // 确认班级是否存在
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
                // 尝试获取更详细的错误信息
                return response.text().then(text => {
                    throw new Error(text || '删除失败，可能存在关联学生');
                });
            }
            // 更新本地数据
            originalClasses = originalClasses.filter(cls => cls.id !== id);
            renderClasses(originalClasses);
            window.showNotification('success', '成功', '班级删除成功');
        })
        .catch(error => {
            window.showNotification('error', '失败', error.message);
        });
};

// 搜索过滤班级
function filterClasses() {
    const searchTerm = document.getElementById('classSearch').value.toLowerCase();
    const filtered = originalClasses.filter(c =>
        c.id.toLowerCase().includes(searchTerm) ||
        c.name.toLowerCase().includes(searchTerm)
    );
    renderClasses(filtered);
}