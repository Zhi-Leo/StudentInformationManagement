package com.example.student_management.service.impl;

import com.example.student_management.entity.Administrator;
import com.example.student_management.repository.AdministratorRepository;
import com.example.student_management.service.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdministratorServiceImpl implements AdministratorService {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Override
    public Administrator register(String uid, String upass) {
        Optional<Administrator> existingAdmin = administratorRepository.findByUid(uid);
        if (existingAdmin.isPresent()) {
            throw new RuntimeException("账号已存在");
        }
        Administrator admin = new Administrator(uid, upass);
        return administratorRepository.save(admin);
    }

    @Override
    public boolean checkAdminCredentials(String adminUid, String adminUpass) {
        Optional<Administrator> admin = administratorRepository.findByUid(adminUid);
        return admin.isPresent() && admin.get().getUpass().equals(adminUpass);
    }

    @Override
    public boolean authenticate(String uid, String upass) {
        Optional<Administrator> admin = administratorRepository.findByUid(uid);
        return admin.isPresent() && admin.get().getUpass().equals(upass);
    }
}