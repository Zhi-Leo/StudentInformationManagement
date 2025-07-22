package com.example.student_management.service;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.repository.ClassInfoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassInfoService {
    private static final Logger logger = LoggerFactory.getLogger(ClassInfoService.class);
    private final ClassInfoRepository classInfoRepository;

    public ClassInfoService(ClassInfoRepository classInfoRepository) {
        this.classInfoRepository = classInfoRepository;
    }

    // 获取所有班级
    public List<ClassInfo> getAllClasses() {
        return classInfoRepository.findAll();
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
        logger.info("收到删除班级请求，ID: {}", id);
        try {
            classInfoRepository.deleteById(id);
            logger.info("班级删除成功，ID: {}", id);
        } catch (Exception e) {
            logger.error("班级删除失败，ID: {}", id, e);
        }
    }
}