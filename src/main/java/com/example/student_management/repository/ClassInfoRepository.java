package com.example.student_management.repository;

import com.example.student_management.entity.ClassInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassInfoRepository extends JpaRepository<ClassInfo, String> {
    // 可以添加自定义方法
    // 新增：按班级名称查询（核心，用于通过名称匹配班级）
    Optional<ClassInfo> findByName(String name);
}