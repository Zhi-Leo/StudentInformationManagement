package com.example.student_management.service;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.repository.ClassInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ClassInfoService {
    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(ClassInfoService.class);
    private final ClassInfoRepository classInfoRepository;

    public ClassInfoService(ClassInfoRepository classInfoRepository) {
        this.classInfoRepository = classInfoRepository;
    }

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
        logger.info("更新班级 - 检查班级是否存在，ID: {}", classInfo.getId());
        if (classInfoRepository.existsById(classInfo.getId())) {
            logger.info("更新班级 - 班级存在，保存更新信息: {}", classInfo);
            return classInfoRepository.save(classInfo);
        }
        logger.info("更新班级 - 班级不存在，ID: {}", classInfo.getId());
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