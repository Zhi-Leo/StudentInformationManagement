// ==================== 通用表格渲染组件 ==================== //

/**
 * 创建通用表格渲染器
 * @param {Object} config - 表格配置
 * @param {string} config.containerId - 表格容器ID
 * @param {Array} config.columns - 表格列配置
 * @param {Array} config.data - 表格数据
 * @param {Object} config.actions - 操作按钮配置
 * @returns {Object} 表格渲染器实例
 */
export function createTableRenderer(config) {
    const { containerId, columns, data = [], actions = {} } = config;
    
    /**
     * 渲染表格
     * @param {Array} newData - 可选的新数据
     */
    function render(newData = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const tableData = newData !== null ? newData : data;
        const tableDataArray = Array.isArray(tableData) ? tableData : [];
        
        // 创建表格头部
        let html = '<thead class="bg-gray-50">';
        html += '<tr>';
        
        columns.forEach(column => {
            html += `<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${column.title}</th>`;
        });
        
        // 添加操作列
        if (Object.keys(actions).length > 0) {
            html += '<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>';
        }
        
        html += '</tr></thead>';
        
        // 创建表格主体
        html += '<tbody class="bg-white divide-y divide-gray-200">';
        
        if (tableDataArray.length === 0) {
            html += `<tr class="text-center">`;
            html += `<td colspan="${columns.length + (Object.keys(actions).length > 0 ? 1 : 0)}" class="px-6 py-12 text-gray-500">`;
            html += `<i class="fa fa-users text-2xl mb-2"></i>`;
            html += `<p>暂无数据</p>`;
            html += `</td>`;
            html += `</tr>`;
        } else {
            tableDataArray.forEach(rowData => {
                html += '<tr class="hover:bg-gray-50 transition-colors duration-150">';
                
                // 渲染数据列
                columns.forEach(column => {
                    const value = typeof column.field === 'function' ? column.field(rowData) : rowData[column.field];
                    const displayValue = value !== null && value !== undefined ? value : '';
                    
                    html += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${displayValue}</td>`;
                });
                
                // 渲染操作按钮
                if (Object.keys(actions).length > 0) {
                    html += '<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">';
                    
                    Object.entries(actions).forEach(([key, action]) => {
                        const { text, icon, className, onClick, condition = () => true } = action;
                        
                        if (condition(rowData)) {
                            html += `<button class="text-${className || 'indigo'}-600 hover:text-${className || 'indigo'}-900 mr-3 transition-colors" onclick="${onClick.name}('${rowData.id}')">`;
                            if (icon) {
                                html += `<i class="fa fa-${icon}"></i> ${text}`;
                            } else {
                                html += `${text}`;
                            }
                            html += `</button>`;
                        }
                    });
                    
                    html += '</td>';
                }
                
                html += '</tr>';
            });
        }
        
        html += '</tbody>';
        
        container.innerHTML = html;
    }
    
    /**
     * 更新表格数据
     * @param {Array} newData - 新的表格数据
     */
    function updateData(newData) {
        render(newData);
    }
    
    /**
     * 更新表格配置
     * @param {Object} newConfig - 新的表格配置
     */
    function updateConfig(newConfig) {
        config = { ...config, ...newConfig };
        render();
    }
    
    // 初始化渲染
    render();
    
    return {
        render,
        updateData,
        updateConfig
    };
}
