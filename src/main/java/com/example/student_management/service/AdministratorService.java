//package com.example.student_management.service;
//
//import com.example.student_management.entity.Administrator;
//import com.example.student_management.repository.AdministratorRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class AdministratorService {
//    @Autowired
//    private AdministratorRepository administratorRepository;
//
//    public boolean authenticate(String uid, String upass) {
//        Optional<Administrator> administratorOptional = administratorRepository.findByUid(uid);
//        return administratorOptional.isPresent() && administratorOptional.get().getUpass().equals(upass);
//    }
//}
package com.example.student_management.service;

import com.example.student_management.entity.Administrator;

public interface AdministratorService {
    Administrator register(String uid, String upass);
    boolean checkAdminCredentials(String adminUid, String adminUpass);
    // 新增authenticate方法定义
    boolean authenticate(String uid, String upass);
}
