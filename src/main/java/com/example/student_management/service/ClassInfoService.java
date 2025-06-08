package com.example.student_management.service;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.repository.ClassInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClassInfoService {
    @Autowired
    private ClassInfoRepository classInfoRepository;

    public ClassInfo saveClass(ClassInfo classInfo) {
        System.out.println("Saving class to database: " + classInfo);
        return classInfoRepository.save(classInfo);
    }

    // 获取所有班级
    public List<ClassInfo> getAllClasses() {
        return classInfoRepository.findAll();
    }

    // 根据 ID 获取班级
    public ClassInfo getClassById(String id) {
        Optional<ClassInfo> optional = classInfoRepository.findById(id);
        return optional.orElse(null);
    }

    // 添加班级
    public ClassInfo addClass(ClassInfo classInfo) {
        return classInfoRepository.save(classInfo);
    }

    // 更新班级
    public ClassInfo updateClass(ClassInfo classInfo) {
        if (classInfoRepository.existsById(classInfo.getId())) {
            return classInfoRepository.save(classInfo);
        }
        return null;
    }

    // 删除班级
    public void deleteClass(String id) {
        classInfoRepository.deleteById(id);
    }
}