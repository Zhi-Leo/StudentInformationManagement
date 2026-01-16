document.getElementById('registerBtn').addEventListener('click', () => {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
});

document.getElementById('cancelRegisterBtn').addEventListener('click', () => {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const uid = document.getElementById('uid').value;
    const upass = document.getElementById('upass').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `uid=${uid}&upass=${upass}`
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === '登录成功' && data.token) {
                // 登录成功后保存JWT令牌到localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('uid', data.uid);
                window.location.href = '/html/index.html';
            }
        })
        .catch(error => {
            console.error('登录请求出错:', error);
            alert('登录请求出错，请稍后重试');
        });
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault(); // 阻止默认表单提交

    // 1. 获取所有表单字段的值
    const newUid = document.getElementById('newUid').value.trim(); // 去空格
    const newUpass = document.getElementById('newUpass').value.trim();
    const adminUid = document.getElementById('adminUid').value.trim();
    const adminUpass = document.getElementById('adminUpass').value.trim();

    // 2. 定义验证规则和错误提示
    let errorMsg = ''; // 存储错误信息
    const uidReg = /^[a-zA-Z0-9_]{4,20}$/; // 账号规则：4-20位，仅字母、数字、下划线
    const passReg = /^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/; // 密码规则：6-20位，含字母+数字

    // 3. 逐个字段校验
    // 校验新账号
    if (!uidReg.test(newUid)) {
        errorMsg = '新账号需为4-20位，仅允许字母、数字和下划线';
    }
    // 校验新密码（若账号通过再校验密码，避免重复提示）
    else if (!passReg.test(newUpass)) {
        errorMsg = '新密码需为6-20位，且必须包含字母和数字';
    }
    // 校验管理员账号（同普通账号规则，可根据实际需求调整）
    else if (!(adminUid==="root")) {
        errorMsg = '管理员账号错误';
    }
    // 校验管理员密码（同普通密码规则，可要求更高复杂度，如加特殊符号）
    else if (!(adminUpass==="root")) {
        errorMsg = '管理员密码错误';
    }

    // 4. 处理校验结果
    if (errorMsg) {
        // 校验失败：提示错误（可用更友好的方式，如表单下显示红色文字，而非alert）
        alert(errorMsg);
        return; // 终止后续逻辑，不发起请求
    }

    // 5. 校验通过：发起注册请求
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `newUid=${encodeURIComponent(newUid)}&newUpass=${encodeURIComponent(newUpass)}&adminUid=${encodeURIComponent(adminUid)}&adminUpass=${encodeURIComponent(adminUpass)}`
        // 注意：添加 encodeURIComponent，避免字段值含特殊符号（如&）导致参数截断
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if (data === '注册成功') {
                // 注册成功后切换回登录表单
                document.getElementById('registerForm').classList.add('hidden');
                document.getElementById('loginForm').classList.remove('hidden');
                // （可选）清空注册表单，避免残留数据
                this.reset();
            }
        })
        .catch(error => {
            console.error('注册请求出错:', error);
            alert('网络异常，请稍后再试');
        });
});
