package com.example.student_management.repository;

import com.example.student_management.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, String> {
    // 继承 JpaRepository 已包含基本 CRUD 方法
    List<Teacher> findByName(String name); // 自动生成按姓名查询的方法
    // 分页查询所有教师
    Page<Teacher> findAll(Pageable pageable);

    // 可选：按教师姓名模糊查询（带分页）
    Page<Teacher> findByNameContaining(String name, Pageable pageable);

}