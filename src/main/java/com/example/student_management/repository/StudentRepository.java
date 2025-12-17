package com.example.student_management.repository;

import com.example.student_management.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    // 按姓名查询学生（不变）
    List<Student> findByName(String name);

    // 按班级名称统计学生数量（clas是Student实体中的班级名称字段）
    @Query("SELECT s.clas AS className, COUNT(s) AS studentCount FROM Student s GROUP BY s.clas")
    List<ClassStudentCount> countStudentsByClass();

    // 按班级名称统计单个班级的学生数量
    long countByClas(String className);

    // 内部静态类：接收统计结果
    interface ClassStudentCount {
        String getClassName(); // 对应查询中的s.clas
        Long getStudentCount(); // 对应查询中的COUNT(s)
    }
    // 添加分页查询方法
    Page<Student> findAll(Pageable pageable);

    // 可选：带条件的分页查询（如按姓名搜索）
    Page<Student> findByNameContaining(String name, Pageable pageable);

}