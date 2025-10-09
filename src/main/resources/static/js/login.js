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
        .then(response => response.text())
        .then(data => {
            alert(data);
            if (data === '登录成功') {
                // 登录成功后跳转到主页
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('登录请求出错:', error);
        });
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const newUid = document.getElementById('newUid').value;
    const newUpass = document.getElementById('newUpass').value;
    const adminUid = document.getElementById('adminUid').value;
    const adminUpass = document.getElementById('adminUpass').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `newUid=${newUid}&newUpass=${newUpass}&adminUid=${adminUid}&adminUpass=${adminUpass}`
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if (data === '注册成功') {
                // 注册成功后显示登录表单
                document.getElementById('registerForm').classList.add('hidden');
                document.getElementById('loginForm').classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('注册请求出错:', error);
        });
});
