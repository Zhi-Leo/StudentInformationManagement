package com.example.student_management.repository;


import com.example.student_management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// JpaRepository<实体类, 主键类型>
public interface StudentRepository extends JpaRepository<Student, String> {
    // 继承 JpaRepository 已包含基本 CRUD 方法
    // 可在此添加自定义查询方法（如按姓名查询）
    List<Student> findByName(String name); // 自动生成按姓名查询的方法
}