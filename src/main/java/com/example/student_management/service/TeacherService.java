package com.example.student_management.service;

import com.example.student_management.entity.Teacher;
import com.example.student_management.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    // 获取所有教师
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    // 分页查询所有教师
    public Page<Teacher> findAll(Pageable pageable) {
        return teacherRepository.findAll(pageable);
    }

    // 带条件的分页查询
    public Page<Teacher> findByNameContaining(String name, Pageable pageable) {
        return teacherRepository.findByNameContaining(name, pageable);
    }

    // 根据 ID 获取教师
    public Teacher getTeacherById(String id) {
        Optional<Teacher> optional = teacherRepository.findById(id);
        return optional.orElse(null);
    }

    // 添加教师
    public Teacher addTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    // 更新教师
    public Teacher updateTeacher(Teacher teacher) {
        if (teacherRepository.existsById(teacher.getId())) {
            return teacherRepository.save(teacher);
        }
        return null;
    }

    // 删除教师
    public void deleteTeacher(String id) {
        teacherRepository.deleteById(id);
    }
}