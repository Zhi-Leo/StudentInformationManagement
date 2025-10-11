package com.example.student_management.controller;

import com.example.student_management.entity.Administrator;
import com.example.student_management.service.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegisterController {

    @Autowired
    private AdministratorService administratorService;

    @PostMapping("/register")
    public String register(@RequestParam String newUid, @RequestParam String newUpass,
                           @RequestParam String adminUid, @RequestParam String adminUpass) {
        try {
            // 检查管理员凭证
            if (!administratorService.checkAdminCredentials(adminUid, adminUpass)) {
                return "管理员账号或密码错误，注册失败";
            }
            Administrator registeredAdmin = administratorService.register(newUid, newUpass);
            return "注册成功";
        } catch (RuntimeException e) {
            return e.getMessage();
        } catch (Exception e) {
            return "注册异常，请稍后再试";
        }
    }
}