// ==================== 通用分页组件 ==================== //

/**
 * 创建统一的分页管理器
 * @param {Object} config - 分页配置
 * @param {string} config.containerId - 分页容器ID
 * @param {number} config.currentPage - 当前页码（从0开始）
 * @param {number} config.pageSize - 每页条数
 * @param {number} config.totalPages - 总页数
 * @param {number} config.totalItems - 总条数
 * @param {function} config.onPageChange - 页码变更回调函数
 * @returns {Object} 分页管理器实例
 */
export function createPagination(config) {
    const { containerId, currentPage = 0, pageSize = 10, totalPages = 0, totalItems = 0, onPageChange } = config;
    
    // 分页状态
    let state = {
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: totalItems
    };
    
    /**
     * 渲染分页组件
     */
    function render() {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const { currentPage, totalPages, totalItems } = state;
        
        // 确保页码有效
        const safeTotalPages = Math.max(0, totalPages);
        const safeTotalItems = Math.max(0, totalItems);
        const safeCurrentPage = Math.max(0, Math.min(currentPage, safeTotalPages - 1));
        
        let html = `
            <div class="flex items-center justify-between px-4 py-3 sm:px-6">
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            显示第 <span class="font-medium">${safeCurrentPage + 1}</span> 页，
                            共 <span class="font-medium">${safeTotalPages}</span> 页，
                            总计 <span class="font-medium">${safeTotalItems}</span> 条记录
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        `;
        
        // 上一页按钮
        html += `
            <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" 
                    onclick="${onPageChange.name}(${safeCurrentPage - 1})" ${safeCurrentPage === 0 ? 'disabled' : ''}>
                <span class="sr-only">上一页</span>
                <i class="fa fa-chevron-left"></i>
            </button>
        `;
        
        // 页码按钮（显示当前页前后各2页）
        const startPage = Math.max(0, safeCurrentPage - 2);
        const endPage = Math.min(safeTotalPages, safeCurrentPage + 3);
        
        for (let i = startPage; i < endPage; i++) {
            html += `
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${i === safeCurrentPage ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}" 
                        onclick="${onPageChange.name}(${i})">
                    ${i + 1}
                </button>
            `;
        }
        
        // 下一页按钮
        html += `
            <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" 
                    onclick="${onPageChange.name}(${safeCurrentPage + 1})" ${safeCurrentPage >= safeTotalPages - 1 ? 'disabled' : ''}>
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
        
        container.innerHTML = html;
    }
    
    /**
     * 更新分页状态
     * @param {Object} newState - 新的分页状态
     */
    function update(newState) {
        state = { ...state, ...newState };
        render();
    }
    
    /**
     * 获取当前分页状态
     * @returns {Object} 当前分页状态
     */
    function getState() {
        return { ...state };
    }
    
    // 初始化渲染
    render();
    
    return {
        render,
        update,
        getState
    };
}

/**
 * 简化的分页渲染函数（兼容现有代码）
 * @param {Object} params - 分页参数
 * @param {string} params.containerId - 分页容器ID
 * @param {number} params.currentPage - 当前页码（从0开始）
 * @param {number} params.totalPages - 总页数
 * @param {number} params.totalItems - 总条数
 * @param {function} params.onPageChange - 页码变更回调
 */
export function renderSimplePagination({ containerId, currentPage = 0, totalPages = 0, totalItems = 0, onPageChange }) {
    const pagination = createPagination({
        containerId,
        currentPage,
        totalPages,
        totalItems,
        onPageChange: (newPage) => {
            if (onPageChange) {
                onPageChange(newPage);
            }
        }
    });
    
    return pagination;
}
