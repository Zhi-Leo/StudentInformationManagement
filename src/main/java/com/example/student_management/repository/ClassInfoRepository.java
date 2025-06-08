package com.example.student_management.repository;

import com.example.student_management.entity.ClassInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassInfoRepository extends JpaRepository<ClassInfo, String> {
    // 可以添加自定义方法
}