package com.example.student_management.service;

import com.example.student_management.entity.Student;
import com.example.student_management.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // 声明为 Spring 服务组件
public class StudentService {
    @Autowired // 自动注入 Repository
    private StudentRepository studentRepository;

    // 获取所有学生
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // 根据 ID 获取学生
    public Student getStudentById(String id) {
        Optional<Student> optional = studentRepository.findById(id);
        return optional.orElse(null); // 存在则返回学生，否则返回 null
    }
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // 添加学生
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }
    // 更新学生
    public Student updateStudent(Student student) {
        // 检查学生是否存在
        if (studentRepository.existsById(student.getId())) {
            return studentRepository.save(student);
        }
        return null; // 学生不存在则返回 null
    }

    // 删除学生
    public void deleteStudent(String id) {
        studentRepository.deleteById(id);
    }
}