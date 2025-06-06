package com.example.student_management.controller;

import com.example.student_management.service.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
    @Autowired
    private AdministratorService administratorService;

    @PostMapping("/login")
    @CrossOrigin(origins = "*") // 允许所有域名的跨域请求
    public ResponseEntity<String> login(@RequestParam String uid, @RequestParam String upass) {
        if (administratorService.authenticate(uid, upass)) {
            return new ResponseEntity<>("登录成功", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("用户名或密码错误", HttpStatus.UNAUTHORIZED);
        }
    }
}