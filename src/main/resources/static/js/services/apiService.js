// ==================== API服务 ====================

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
        const responseData = await response.json();
        
        // 检查响应状态
        if (!response.ok) {
            throw new Error(responseData.message || 'API请求失败');
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