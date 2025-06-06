package com.example.student_management.repository;

import com.example.student_management.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, String> {
    // 继承 JpaRepository 已包含基本 CRUD 方法
    List<Teacher> findByName(String name); // 自动生成按姓名查询的方法
}