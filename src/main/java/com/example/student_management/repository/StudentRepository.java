package com.example.student_management.repository;


import com.example.student_management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

// JpaRepository<实体类, 主键类型>
public interface StudentRepository extends JpaRepository<Student, String> {
    // 继承 JpaRepository 已包含基本 CRUD 方法
    // 可在此添加自定义查询方法（如按姓名查询）
    List<Student> findByName(String name); // 自动生成按姓名查询的方法

    // 修改此方法，使用正确的查询和返回类型
    @Query("SELECT s.clas AS classId, COUNT(s) AS studentCount FROM Student s GROUP BY s.clas")
    List<ClassStudentCount> countStudentsByClass();

    // 添加一个接口来表示查询结果
    interface ClassStudentCount {
        String getClassId();
        Long getStudentCount();
    }


    // 添加 countByClas 方法
    int countByClas(String clas);
}