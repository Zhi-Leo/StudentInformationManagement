package com.example.student_management.repository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegisterController {

    @PostMapping("/register")
    public String register(
            @RequestParam("newUid") String newUid,
            @RequestParam("newUpass") String newUpass,
            @RequestParam("adminUid") String adminUid,
            @RequestParam("adminUpass") String adminUpass) {

        // 这里添加实际的注册逻辑
        // 1. 验证管理员账号密码是否正确
        // 2. 检查新用户ID是否已存在
        // 3. 创建新用户记录

        // 示例：简单返回注册成功
        return "注册成功";
    }
}
