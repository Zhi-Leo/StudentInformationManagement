// ==================== API服务 ==================== //

/**
 * 发送API请求
 * @param {string} url - 请求URL
 * @param {string} method - 请求方法：GET, POST, PUT, DELETE
 * @param {object} data - 请求体数据
 * @param {object} options - 可选配置
 * @returns {Promise} - Promise对象
 */
export async function apiRequest(url, method = 'GET', data = null, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            // 添加认证令牌
            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        },
        credentials: 'include',
    };
    
    // 合并配置
    const config = { ...defaultOptions, ...options, method };
    
    // 添加请求体
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, config);
        
        // 处理响应
        let responseData;
        const contentType = response.headers.get('Content-Type');
        
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }
        
        // 检查响应状态
        if (!response.ok) {
            throw new Error(responseData.message || responseData || 'API请求失败');
        }
        
        return responseData;
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

/**
 * GET请求
 * @param {string} url - 请求URL
 * @param {object} params - 查询参数
 * @param {object} options - 可选配置
 * @returns {Promise} - Promise对象
 */
export function get(url, params = {}, options = {}) {
    // 构建查询字符串
    const queryString = params && Object.keys(params).length > 0
        ? '?' + new URLSearchParams(params).toString()
        : '';
    
    return apiRequest(url + queryString, 'GET', null, options);
}

/**
 * POST请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求体数据
 * @param {object} options - 可选配置
 * @returns {Promise} - Promise对象
 */
export function post(url, data = {}, options = {}) {
    return apiRequest(url, 'POST', data, options);
}

/**
 * PUT请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求体数据
 * @param {object} options - 可选配置
 * @returns {Promise} - Promise对象
 */
export function put(url, data = {}, options = {}) {
    return apiRequest(url, 'PUT', data, options);
}

/**
 * DELETE请求
 * @param {string} url - 请求URL
 * @param {object} options - 可选配置
 * @returns {Promise} - Promise对象
 */
export function del(url, options = {}) {
    return apiRequest(url, 'DELETE', null, options);
}

/**
 * PATCH请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求体数据
 * @param {object} options - 可选配置
 * @returns {Promise} - Promise对象
 */
export function patch(url, data = {}, options = {}) {
    return apiRequest(url, 'PATCH', data, options);
}

/**
 * 上传文件
 * @param {string} url - 请求URL
 * @param {FormData} formData - FormData对象
 * @param {object} options - 可选配置
 * @returns {Promise} - Promise对象
 */
export function uploadFile(url, formData, options = {}) {
    const uploadOptions = {
        ...options,
        headers: {
            // 文件上传不需要Content-Type，浏览器会自动设置
            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        },
    };
    
    return apiRequest(url, 'POST', formData, uploadOptions);
}

// ==================== 业务API封装 ==================== //

/**
 * 学生相关API
 */
export const studentApi = {
    getAll: (params) => get('/api/students', params),
    getById: (id) => get(`/api/students/${id}`),
    create: (student) => post('/api/students', student),
    update: (id, student) => put(`/api/students/${id}`, student),
    delete: (id) => del(`/api/students/${id}`)
};

/**
 * 班级相关API
 */
export const classApi = {
    getAll: (params) => get('/api/classes', params),
    getById: (id) => get(`/api/classes/${id}`),
    create: (classInfo) => post('/api/classes', classInfo),
    update: (id, classInfo) => put(`/api/classes/${id}`, classInfo),
    delete: (id) => del(`/api/classes/${id}`),
    updateStudentCounts: () => put('/api/classes/updateAllStudentCounts')
};

/**
 * 教师相关API
 */
export const teacherApi = {
    getAll: (params) => get('/api/teachers', params),
    getById: (id) => get(`/api/teachers/${id}`),
    create: (teacher) => post('/api/teachers', teacher),
    update: (id, teacher) => put(`/api/teachers/${id}`, teacher),
    delete: (id) => del(`/api/teachers/${id}`)
};

/**
 * 认证相关API
 */
export const authApi = {
    login: (credentials) => {
        const formData = new URLSearchParams();
        formData.append('uid', credentials.uid);
        formData.append('upass', credentials.upass);
        
        return fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData,
            credentials: 'include'
        }).then(response => response.json());
    },
    register: (data) => {
        const formData = new URLSearchParams();
        formData.append('newUid', data.newUid);
        formData.append('newUpass', data.newUpass);
        formData.append('adminUid', data.adminUid);
        formData.append('adminUpass', data.adminUpass);
        
        return fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData,
            credentials: 'include'
        }).then(response => response.text());
    }
};
