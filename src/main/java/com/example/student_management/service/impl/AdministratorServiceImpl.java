package com.example.student_management.service.impl;

import com.example.student_management.entity.Administrator;
import com.example.student_management.repository.AdministratorRepository;
import com.example.student_management.service.AdministratorService;
import com.example.student_management.service.PasswordEncoderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdministratorServiceImpl implements AdministratorService {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private PasswordEncoderService passwordEncoderService;

    @Override
    public Administrator register(String uid, String upass) {
        Optional<Administrator> existingAdmin = administratorRepository.findByUid(uid);
        if (existingAdmin.isPresent()) {
            throw new RuntimeException("账号已存在");
        }
        // 加密密码
        String encodedPassword = passwordEncoderService.encodePassword(upass);
        Administrator admin = new Administrator(uid, encodedPassword);
        return administratorRepository.save(admin);
    }

    @Override
    public boolean checkAdminCredentials(String adminUid, String adminUpass) {
        Optional<Administrator> admin = administratorRepository.findByUid(adminUid);
        if (admin.isPresent()) {
            Administrator administrator = admin.get();
            String encodedPassword = administrator.getUpass();
            
            // 首先尝试使用BCrypt验证
            if (passwordEncoderService.verifyPassword(adminUpass, encodedPassword)) {
                return true;
            } else {
                // 如果BCrypt验证失败，尝试使用明文比较（兼容旧密码）
                if (adminUpass.equals(encodedPassword)) {
                    // 如果明文比较成功，更新密码为BCrypt格式
                    String newEncodedPassword = passwordEncoderService.encodePassword(adminUpass);
                    administrator.setUpass(newEncodedPassword);
                    administratorRepository.save(administrator);
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public boolean authenticate(String uid, String upass) {
        Optional<Administrator> adminOptional = administratorRepository.findByUid(uid);
        if (adminOptional.isPresent()) {
            Administrator admin = adminOptional.get();
            String encodedPassword = admin.getUpass();
            
            // 首先尝试使用BCrypt验证
            if (passwordEncoderService.verifyPassword(upass, encodedPassword)) {
                return true;
            } else {
                // 如果BCrypt验证失败，尝试使用明文比较（兼容旧密码）
                if (upass.equals(encodedPassword)) {
                    // 如果明文比较成功，更新密码为BCrypt格式
                    String newEncodedPassword = passwordEncoderService.encodePassword(upass);
                    admin.setUpass(newEncodedPassword);
                    administratorRepository.save(admin);
                    return true;
                }
            }
        }
        return false;
    }
}