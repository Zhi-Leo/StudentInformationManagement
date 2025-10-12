package com.example.student_management.repository;

import com.example.student_management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    // 按姓名查询学生（不变）
    List<Student> findByName(String name);

    // 修正：按班级名称（s.clas）分组统计，结果字段名为className（而非classId）
    @Query("SELECT s.clas AS className, COUNT(s) AS studentCount FROM Student s GROUP BY s.clas")
    List<ClassStudentCount> countStudentsByClass();

    // 按班级名称统计学生数量（clas是班级名称，与学生表字段对应）
    int countByClas(String clas);

    // 修正：统计结果接口的字段名（className而非classId）
    interface ClassStudentCount {
        String getClassName(); // 对应查询中的"className"
        Long getStudentCount();
    }
}